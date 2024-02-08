import http from 'node:http'
import url from 'node:url'
import {v4 as uuidv4} from 'uuid'
import OpenAI from 'openai'
import WhatsAppAPI from 'whatsapp-api-js/middleware/node-http'
import {NodeNext} from 'whatsapp-api-js/setup/node'
import {Text} from 'whatsapp-api-js/messages'
import PostgresDAO from './repository/postgres/PostgresDAO.js'
import config from './config.js'
import handlers from "./handlers/index.js";

async function processRequest(ctx, db, historyCache, openai) {
    const msg = ctx.message

    if (!await db.users.checkExistence(msg.from)) {
        const id = uuidv4()
        await db.users.signUp(id, msg.from)
    }

    let buttonReplyID = ''
    let buttonListID = ''
    if (msg.type === 'interactive') {
        if (msg.interactive.type === 'button_reply') {
            buttonReplyID = msg.interactive.button_reply.id
        }
        if (msg.interactive.type === 'list_reply') {
            buttonListID = msg.interactive.list_reply.id
        }
    }

    if (buttonReplyID === 'settings') {
        return handlers.handleSettings(ctx)
    }
    if (buttonReplyID === 'personalitiesList') {
        return handlers.handlePersonalitiesList(ctx)
    }
    if (buttonListID.includes('change_personality')) {
        return handlers.handleChangePersonality(ctx, db)
    }
	if (msg.text.body === '/clear') {
		return handlers.handleClearMessageHistory(ctx, db)
	}
    handlers.handleChatGPTMessage(ctx, db, openai) // in background as the top async calls
}

(async function main() {
    process.on('unhandledRejection', (reason) => {
		throw new Error(`Uncaught error in promise: ${reason}`)
	})

	const configWhatsapp = config.whatsapp
    const whatsapp = new WhatsAppAPI(NodeNext({
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
        processRequest(ctx, postgresDAO, historyCache, openai)

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
