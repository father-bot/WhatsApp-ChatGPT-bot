import {ActionButtons, Body, Button, Interactive} from 'whatsapp-api-js/messages'

export default function handleSettings(ctx) {
	const message = new Interactive(
		new ActionButtons(new Button('personalitiesList', 'Change role')),
		new Body('What do you want to adjust?')
	)
	ctx.reply(message)
}