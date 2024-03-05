export default async function handleGenerateImage({sock, messageEvent}, openai) {
	const prompt = messageEvent.message.conversation
		.replace('/image', '')
	const remoteJid = messageEvent.key.remoteJid

	if (!prompt) {
		const helpMessage = `you need to pass a prompt to generate an image
follow this format: /image $prompt
example: /image sunrise low dim sun a new winter day`
		return sockSendMessage(remoteJid, {
			text: helpMessage
		})
	}

	const res = await openai.images.generate({
		model: 'dall-e-3',
		prompt: prompt,
		size: '1024x1024',
		quality: 'hd',
		n: 1
	})

	const imageObj = res.data[0]

	sock.sendMessage(remoteJid, {
		image: {url: imageObj.url},
		caption: imageObj.revised_prompt
	})
}
