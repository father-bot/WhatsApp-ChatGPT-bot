import http from 'node:http'
import url from 'node:url'
import {v4 as uuidv4} from 'uuid'
import OpenAI from 'openai'
import WhatsAppAPI from 'whatsapp-api-js/middleware/node-http'
import {NodeNext} from 'whatsapp-api-js/setup/node'
import {
    ActionButtons,
    ActionList,
    Body, Button,
    Interactive,
    ListSection,
    Row,
    Text
} from 'whatsapp-api-js/messages'
import PostgresDAO from './repository/postgres/PostgresDAO.js'
import personalities from './personalities.js'
import config from './config.js'

async function handleChangePersonality(ctx, db) {
    const msg = ctx.message
    const personalityID = msg.interactive.list_reply.id
        .split('#')[1]

    await db.users.setPersonality(msg.from, personalityID)
    ctx.reply(new Text('You have changed your bot role successfully'))
}

async function handlePersonalitiesList(ctx) {
    function sendPersonalitiesList(chunk, chunksCount) {
        const message = new Interactive(
            new ActionList(
                'Click to assign',
                new ListSection(
                    undefined,
                    ...chunk
                )
            ),
            new Body(chunksCount === 0 ? 'You can assign one of these roles' : `Next ${chunk.length} roles`)
        );
        ctx.reply(message)
    }

    let currentChunk = []
    let chunksCount = 0
    personalities.iterate((personalityID, personality) => {
        const row = new Row(`change_personality#${personalityID}`, personality.name)
        currentChunk.push(row)

        if (currentChunk.length === 10) {
            sendPersonalitiesList(currentChunk, chunksCount)
            currentChunk = []
            chunksCount++
        }
    })

    sendPersonalitiesList(currentChunk, chunksCount)
}

async function handleChatGPTMessage(ctx, db, openai) {
	const msg = ctx.message

	await db.messageHistory.append(msg.from, 'user', msg.text.body)
	let history = (await db.messageHistory.getMessages(msg.from))
		.map(message => ({role: message.role, content: message.message}))

	if (history.length === 50) {
		const messagesToDelete = 30
		db.messageHistory.deleteFirst(msg.from, messagesToDelete) // in background
	}

	const personalityID = await db.users.getPersonality(msg.from)
	if (personalityID) {
		const personality = personalities[personalityID]
		history = [
			{role: 'system', content: personality.prompt},
			...history
		]
	}

	const chatCompletion = await openai.chat.completions.create({
		messages: history,
		model: 'gpt-4'
	})

	const answer = chatCompletion.choices[0].message.content
	db.messageHistory.append(msg.from, 'assistant', answer) // in background

	const message = new Interactive(
		new ActionButtons(new Button('settings', 'Settings')),
		new Body(answer)
	)
	ctx.reply(message)
}

async function handleSettings(ctx) {
    const message = new Interactive(
        new ActionButtons(new Button('personalitiesList', 'Change role')),
        new Body('What do you want to adjust?')
    )
    ctx.reply(message)
}

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
        return handleSettings(ctx)
    }
    if (buttonReplyID === 'personalitiesList') {
        return handlePersonalitiesList(ctx)
    }
    if (buttonListID.includes('change_personality')) {
        return handleChangePersonality(ctx, db)
    }
    await handleChatGPTMessage(ctx, db, openai)
}

(async function main() {
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
