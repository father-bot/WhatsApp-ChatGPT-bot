import OpenAI from 'openai'
import {makeWASocket,useMultiFileAuthState,DisconnectReason} from '@whiskeysockets/baileys'
import PostgresDAO from './repository/postgres/PostgresDAO.js'
import config from './config.js'
import handlers from './handlers/index.js'

async function processRequest(ctx, db, openai) {
	const {messageObj} = ctx
    if (messageObj.key.fromMe) return
	
	if (!await db.users.checkExistence(messageObj.key.remoteJid)) {
        await db.users.signUp(messageObj.key.remoteJid)
    }

	const text = messageObj.message.conversation
	if (text === '/clear') return handlers.handleClearMessageHistory(ctx, db)

	handlers.handleChatGPTMessage(ctx, db, openai)
}

(async function main() {
    process.on('unhandledRejection', (reason) => {
		throw new Error(`Uncaught error in promise: ${reason}`)
	})

    const configPSQL = config.postgres
    const postgresDAO = new PostgresDAO(
        configPSQL.host,
        configPSQL.port,
        configPSQL.user,
        configPSQL.database,
        configPSQL.password)

    const openai = new OpenAI({apiKey: config.openai.apiKey})

	const connectToWhatsapp = async () => {
        const {state, saveCreds} = await useMultiFileAuthState('/whatsapp-session')

		const sock = makeWASocket({
			printQRInTerminal: true,
			auth: state
		})
		sock.ev.on('creds.update', saveCreds)
		sock.ev.on('connection.update', update => {
			const {connection, lastDisconnect} = update
			if (connection === 'close') {
				const shouldReconnect = lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
				if (shouldReconnect) connectToWhatsapp()
			}
		})
		sock.ev.on('messages.upsert', msg => {
			const ctx = {sock, messageObj: msg.messages[0]}
			processRequest(ctx, postgresDAO, openai)
		})
	}
	connectToWhatsapp()
})()
