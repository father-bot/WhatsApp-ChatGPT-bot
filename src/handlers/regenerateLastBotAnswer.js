import personalities from '../personalities.js'

export default async function regenerateLastBotAnswer(ctx, db, openai) {
	const msg = ctx.message

	let history = []
	const personalityID = await db.users.getPersonality(msg.from)
	if (personalityID) {
		const personality = personalities[personalityID]
		history.push({role: 'system', content: personality.prompt})
	}

	const messages = (await db.messageHistory.getMessages(msg.from))
		.map(messageObj => ({role: messageObj.role, content: messageObj.message}))

	const lastQuestion = messages.filter(messageObj => messageObj.role === 'user').pop()

	for (let messageObj of messages) {
		if (messageObj.content === lastQuestion.content) break
		history.push(messageObj)
	}
	history.push(lastQuestion)

	const chatCompletion = await openai.chat.completions.create({
		messages: history,
		model: 'gpt-4'
	})
	const answer = chatCompletion.choices[0].message.content

	ctx.reply(answer)
}