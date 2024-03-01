import personalities from '../../personalities.js'

export default async function handleRegenerateLastBotAnswer({sock, messageEvent}, db, openai) {
	const remoteJid = messageEvent.key.remoteJid
	
	let history = []
	const personalityID = await db.users.getPersonality(remoteJid)
	if (personalityID) {
		const personality = personalities[personalityID]
		history.push({role: 'system', content: personality.prompt})
	}

	const messages = await db.messageHistory.getMessages(remoteJid)
	for (let i = messages.length-1; ; i--) {
		const message = messages[i]
		if (!message) 
			return sock.sendMessage(remoteJid, {
				text: 'There are no bot answers to regenerate'
			})

		if (message.role === 'user') {
			history.push(...messages
				.slice(0, i+1)
				.map(message => ({role: message.role, content: message.body}))
			)
			break
		}
	}

	const model = await db.users.getAIModel(remoteJid)
	const chatCompletion = await openai.chat.completions.create({
		messages: history,
		model
	})
	const answer = chatCompletion.choices[0].message.content

	sock.sendMessage(remoteJid, {text: answer})
}