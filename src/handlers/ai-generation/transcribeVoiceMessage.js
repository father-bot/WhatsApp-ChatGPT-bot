import {toFile as toOpenaiFileObj} from 'openai'
import {downloadMediaMessage} from '@whiskeysockets/baileys'

export default async function handleTranscribeVoiceMessage(ctx, openai) {
	const {sock, messageEvent} = ctx

	const buffer = await downloadMediaMessage(
		ctx.messageEvent,
		'buffer',
		{},
		{}
	)
	const file = await toOpenaiFileObj(buffer, 'voice.ogg')

	const transcription = await openai.audio.transcriptions.create({
		file,
		model: 'whisper-1',
		response_format: 'text'
	})

	const message = `🔉 — ${transcription}`
	sock.sendMessage(messageEvent.key.remoteJid, {
		text: message
	})
}
