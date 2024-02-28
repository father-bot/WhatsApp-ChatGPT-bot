import personalities from '../../personalities.js'

export default function handlePersonalitiesList({sock, messageEvent}) {
	let message = 'Type one of these commands to set a role:\n\n'
	personalities.iterate((personalityID, personality) => {
		message += `/role ${personalityID}\n`
	});

	sock.sendMessage(messageEvent.key.remoteJid, {
		text: message
	})
}
