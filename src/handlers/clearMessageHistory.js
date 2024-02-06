import {Text} from 'whatsapp-api-js/messages'

export default function handleClearMessageHistory(ctx, db) {
	db.messageHistory.clear(ctx.message.from) // in background

	ctx.reply(new Text('You have cleared your message history'))
}
