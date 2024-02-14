import {Image, Text} from 'whatsapp-api-js/messages'

export default async function handleGenerateImage(ctx, openai) {
	const prompt = ctx.message.text.body
		.replace('/image', '')

	if (!prompt) {
		const helpMessage = `you need to pass a prompt to generate an image
follow this format: /image $prompt
example: /image sunrise low dim sun a new winter day`
		return ctx.reply(new Text(helpMessage))
	}

	const res = await openai.images.generate({
		model: 'dall-e-3',
		prompt: prompt,
		size: '1024x1024',
		quality: 'hd',
		n: 1
	})

	const imageObj = res.data[0]

	const message = new Image(
		imageObj.url,
		false,
		imageObj.revised_prompt
	)
	ctx.reply(message)
}
