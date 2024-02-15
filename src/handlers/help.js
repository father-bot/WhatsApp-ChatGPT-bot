import {Text} from 'whatsapp-api-js/messages'

export default function handleHelp(ctx) {
	const message = `/clear — clears message history (all the context bot have will be lost, it starts a new dialog)

/image $prompt — generates an image based on your prompt
example: /image sunrise low dim sun a new winter day`

	ctx.reply(new Text(message))
}
