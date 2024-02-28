export default function handleClearMessageHistory({sock, messageObj}, db) {
	const remoteJid = messageObj.key.remoteJid
	db.messageHistory.clear(remoteJid) // in background

	sock.sendMessage(remoteJid, {
		text: 'You have cleared your message history'
	})
}
