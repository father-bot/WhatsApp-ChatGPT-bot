import {ActionList, Body, Interactive, ListSection, Row} from 'whatsapp-api-js/messages'
import personalities from '../../personalities.js'

export default function handlePersonalitiesList(ctx) {
	function sendPersonalitiesList(chunk, chunksCount) {
		const message = new Interactive(
			new ActionList(
				'Click to assign',
				new ListSection(
					undefined,
					...chunk
				)
			),
			new Body(chunksCount === 0 ? 'You can assign one of these roles' : `Next ${chunk.length} roles`)
		);
		ctx.reply(message)
	}

	let currentChunk = []
	let chunksCount = 0
	personalities.iterate((personalityID, personality) => {
		const row = new Row(`change_personality#${personalityID}`, personality.name)
		currentChunk.push(row)

		if (currentChunk.length === 10) {
			sendPersonalitiesList(currentChunk, chunksCount)
			currentChunk = []
			chunksCount++
		}
	})

	sendPersonalitiesList(currentChunk, chunksCount)
}