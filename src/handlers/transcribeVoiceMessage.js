import {toFile as toOpenaiFileObj} from 'openai'
import https from 'node:https'
import {Text} from 'whatsapp-api-js/messages'

function fetchAudio(url, whatsappKey) {
	return new Promise((resolve) => {
		const {hostname, pathname, search} = new URL(url)

		https.get({
			hostname: hostname,
			path: pathname+search,
			headers: {
				'Authorization': `Bearer ${whatsappKey}`,
				'User-Agent': 'nodejs'
			}
		}, (res) => {
			let body = []
			res.on('data', chunk => body.push(chunk))
			res.on('end', () => resolve(Buffer.concat(body)))
		})
	})
}

export default async function handleTranscribeVoiceMessage(ctx, openai) {
	const msg = ctx.message

	const {url} = await ctx.Whatsapp.retrieveMedia(msg.audio.id)
	const buffer = await fetchAudio(url, ctx.Whatsapp.token)

	const file = await toOpenaiFileObj(buffer, 'voice.ogg')

	const transcription = await openai.audio.transcriptions.create({
		file: file,
		model: 'whisper-1',
		response_format: 'text'
	})

	const message = `🔉 — ${transcription}`
	ctx.reply(new Text(message))
}
