import {Text} from 'whatsapp-api-js/messages'

export default function handleChangePersonality(ctx, db) {
	const msg = ctx.message
	const personalityID = msg.interactive.list_reply.id
		.split('#')[1]

	db.users.setPersonality(msg.from, personalityID) // in background
	ctx.reply(new Text('You have changed your bot role successfully'))
}
