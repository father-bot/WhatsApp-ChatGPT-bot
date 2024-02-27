import OpenAI from 'openai'
import {makeWASocket,useMultiFileAuthState,DisconnectReason} from '@whiskeysockets/baileys'
import PostgresDAO from './repository/postgres/PostgresDAO.js'
import config from './config.js'
// it's not ported to baileys yet
// import handlers from './handlers/index.js'

async function processRequest(ctx, db, openai) {
    const msg = ctx.message

    if (!await db.users.checkExistence(msg.from)) {
        await db.users.signUp(msg.from)
    }

	switch (msg.type) {
		case 'audio':
			handlers.handleTranscribeVoiceMessage(ctx, openai); break
		case 'interactive':
			const buttonReplyId = msg.interactive.type === 'button_reply' ?
				msg.interactive.button_reply.id : ''
			const buttonListId = msg.interactive.type === 'list_reply' ?
				msg.interactive.list_reply.id : ''

			if (buttonReplyId === 'settings')
				handlers.handleSettings(ctx)
			if (buttonReplyId === 'personalitiesList')
				handlers.handlePersonalitiesList(ctx)
			if (buttonReplyId === 'help')
				handlers.handleHelp(ctx)
			if (buttonReplyId === 'regenerateLastBotAnswer')
				handlers.handleRegenerateLastBotAnswer(ctx, db, openai)
			if (buttonReplyId === 'aiModelsList')
				handlers.aiModelsList(ctx)
			if (buttonReplyId.includes('changeAIModel'))
				handlers.changeAIModel(ctx, db)
			if (buttonListId.includes('changePersonality'))
				handlers.handleChangePersonality(ctx, db)
			break
		case 'text':
			const text = msg.text.body
			if (text.includes('/image'))
				handlers.handleGenerateImage(ctx, openai)
			else if (text === '/clear')
				handlers.handleClearMessageHistory(ctx, db)
			else
				handlers.handleChatGPTMessage(ctx, db, openai) // in background as the top async calls
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
	}
	connectToWhatsapp()
})()
