export default function handleClearMessageHistory({sock, messageEvent}, db) {
	const remoteJid = messageEvent.key.remoteJid
	db.messageHistory.clear(remoteJid) // in background

	sock.sendMessage(remoteJid, {
		text: 'You have cleared your message history'
	})
}
