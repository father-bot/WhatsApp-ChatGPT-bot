import {Text} from 'whatsapp-api-js/messages'
import personalities from '../../personalities.js'

export default async function handleRegenerateLastBotAnswer(ctx, db, openai) {
	const msg = ctx.message

	let history = []
	const personalityID = await db.users.getPersonality(msg.from)
	if (personalityID) {
		const personality = personalities[personalityID]
		history.push({role: 'system', content: personality.prompt})
	}

	const messages = await db.messageHistory.getMessages(msg.from)
	for (let i = messages.length-1; ; i--) {
		const message = messages[i]
		if (!message) return ctx.reply(new Text('There are no bot answers to regenerate'))

		if (message.role === 'user') {
			history.push(...messages
				.slice(0, i+1)
				.map(message => ({role: message.role, content: message.body}))
			)
			break
		}
	}

	const model = await db.users.getAIModel(msg.from)
	const chatCompletion = await openai.chat.completions.create({
		messages: history,
		model
	})
	const answer = chatCompletion.choices[0].message.content

	ctx.reply(new Text(answer))
}