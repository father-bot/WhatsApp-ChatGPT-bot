export default function handleHelp({sock, messageEvent}) {
	const message = `/clear — clears message history (all the context bot have will be lost, it starts a new dialog)

/image $prompt — generates an image based on your prompt
example: /image sunrise low dim sun a new winter day`

	sock.sendMessage(messageEvent.key.remoteJid, {
		text: message
	})
}
