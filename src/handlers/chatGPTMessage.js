import personalities from '../personalities.js'
import {ActionButtons, Body, Button, Interactive} from 'whatsapp-api-js/messages'

export default async function handleChatGPTMessage(ctx, db, openai) {
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