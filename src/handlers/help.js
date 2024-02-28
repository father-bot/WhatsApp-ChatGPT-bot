export default function handleHelp({sock, messageEvent}) {
	const message = `/clear — clears message history (all the context bot have will be lost, it starts a new dialog)

/image $prompt — generates an image based on your prompt
example: /image sunrise low dim sun a new winter day

/retry — regenerates the last ChatGPT bot answer (once it's done the answer will be sent to the dialog)`

	sock.sendMessage(messageEvent.key.remoteJid, {
		text: message
	})
}
