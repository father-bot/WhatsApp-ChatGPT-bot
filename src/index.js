import http from 'node:http'
import url from 'node:url'
import OpenAI from 'openai'
import WhatsAppAPI from 'whatsapp-api-js/middleware/node-http'
import {Node18} from 'whatsapp-api-js/setup/node'
import {Text} from 'whatsapp-api-js/messages'
import PostgresDAO from './repository/postgres/PostgresDAO.js'
import config from './config.js'
import handlers from './handlers/index.js'

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
			if (buttonListId.includes('change_personality'))
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

	const configWhatsapp = config.whatsapp
    const whatsapp = new WhatsAppAPI(Node18({
        token: configWhatsapp.apiKey,
        appSecret: configWhatsapp.appSecret,
        webhookVerifyToken: configWhatsapp.webhookVerifyToken
    }));

    const configPSQL = config.postgres
    const postgresDAO = new PostgresDAO(
        configPSQL.host,
        configPSQL.port,
        configPSQL.user,
        configPSQL.database,
        configPSQL.password)

    const openai = new OpenAI({apiKey: config.openai.apiKey})

    whatsapp.on.message = (ctx) =>
        processRequest(ctx, postgresDAO, openai)

    http.createServer(async (req, res) => {
		if (url.parse(req.url).pathname !== '/whatsapp/webhook') {
			res.statusCode = 404
			return res.end()
		}
		if (req.method === 'GET') {
			try {
				res.statusCode = 200
				res.end(whatsapp.handle_get(req))
			} catch (error) {
				res.statusCode = error
				res.end()
			}
			return
		}
		res.statusCode = await whatsapp.handle_post(req)
		res.end()
    }).listen(configWhatsapp.webhookPort)
})()
