import {Text} from 'whatsapp-api-js/messages'

export default function handleHelp(ctx) {
	const message = `List of the available commands:

/regen — regenerates the last bot answer`

	ctx.reply(new Text(message))
}
