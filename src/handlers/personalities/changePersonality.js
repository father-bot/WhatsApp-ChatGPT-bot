export default function handleChangePersonality({sock, messageEvent}, db) {
	const personalityID = messageEvent.message.conversation
		.split('/role ')[1]
	const remoteJid = messageEvent.key.remoteJid
	
	db.users.setPersonality(remoteJid, personalityID) // in background
	
	sock.sendMessage(remoteJid, {
		text: 'You have changed your bot role successfully'
	})
}
