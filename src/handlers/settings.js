export default function handleSettings({sock, messageEvent}) {
	const buttons = [
		{
			quickReplyButton: {
				displayText: 'Change role', id: 'personalitiesList'
			}
		},
		{
			quickReplyButton: {
				displayText: 'Change AI model', id: 'aiModelsList'
			}
		},
		{
			quickReplyButton: {
				displayText: 'Settings', id: 'settings'
			}
		}
	]

	sock.sendMessage(messageEvent.key.remoteJid, {
		text: 'What do you want to adjust?',
		templateButtons: buttons
	})
}