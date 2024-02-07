export default function handleHelp(ctx) {
	const message = `List of the available commands:

/regen — regenerates the last bot answer`

	ctx.send(new Text(message))
}
