import OpenAI from 'openai'
import {makeWASocket,useMultiFileAuthState,DisconnectReason} from '@whiskeysockets/baileys'
import PostgresDAO from './repository/postgres/PostgresDAO.js'
import config from './config.js'
import handlers from './handlers/index.js'

async function processRequest(ctx, db, openai) {
	const {messageEvent} = ctx
    if (messageEvent.key.fromMe) return

	if (!await db.users.checkExistence(messageEvent.key.remoteJid)) {
        await db.users.signUp(messageEvent.key.remoteJid)
    }

	const messageType = Object.keys(messageEvent.message)[0]

	switch(messageType) {
		case 'conversation':
			const text = messageEvent.message.conversation

			if (text.includes('/role ')) 
				return handlers.handleChangePersonality(ctx, db)
			if (text.includes('/model '))
				return handlers.handleChangeAIModel(ctx, db)
			if (text.includes('/image'))
				return handlers.handleGenerateImage(ctx, openai)
			
			if (text === '/help')        handlers.handleHelp(ctx)
			else if (text === '/clear')  handlers.handleClearMessageHistory(ctx, db)
			else if (text === '/retry')  handlers.handleRegenerateLastBotAnswer(ctx, db, openai)
			else if (text === '/roles')  handlers.handlePersonalitiesList(ctx)
			else if (text === '/models') handlers.handleAIModelsList(ctx)
			else                         handlers.handleChatGPTMessage(ctx, db, openai)

			break
		case 'audioMessage':
			handlers.handleTranscribeVoiceMessage(ctx, openai)
	}	
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
			const ctx = {sock, messageEvent: msg.messages[0]}
			processRequest(ctx, postgresDAO, openai)
		})
	}
	connectToWhatsapp()
})()
