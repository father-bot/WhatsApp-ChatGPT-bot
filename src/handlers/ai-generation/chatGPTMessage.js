import personalities from '../../personalities.js'

export default async function handleChatGPTMessage({sock, messageEvent}, db, openai) {
	const remoteJid = messageEvent.key.remoteJid
	await db.messageHistory.append(remoteJid, 'user', messageEvent.message.conversation)

	let history = (await db.messageHistory.getMessages(remoteJid))
		.map(message => ({role: message.role, content: message.body}))

	if (history.length === 50) {
		const messagesToDelete = 30
		db.messageHistory.deleteFirst(msg.from, messagesToDelete) // in background
	}

	const personalityID = await db.users.getPersonality(remoteJid)
	if (personalityID) {
		const personality = personalities[personalityID]
		history = [
			{role: 'system', content: personality.prompt},
			...history
		]
	}

	const model = await db.users.getAIModel(remoteJid)
	const chatCompletion = await openai.chat.completions.create({
		messages: history,
		model
	})

	const answer = chatCompletion.choices[0].message.content
	db.messageHistory.append(remoteJid, 'assistant', answer) // in background

	const message = `${answer}
---
type /help to get a list of available commands`

    sock.sendMessage(remoteJid, {
		text: message
	})
}
