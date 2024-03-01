export default class MessageHistoryRepo {
	#db
	#table = 'message_history'

	constructor(db) {
		this.#db = db
	}

	async append(whatsappId, role, message) {
		await this.#db(this.#table).insert([
			{
				whatsapp_id: whatsappId,
				role, 
				body: message
			}
		])
	}

	async clear(whatsappId) {
		await this.#db(this.#table)
			.where({whatsapp_id: whatsappId})
			.del()
	}

	async deleteFirst(whatsappId, messagesCount) {
		const sql = 'DELETE FROM ? WHERE id IN (SELECT id FROM ? ORDER BY created_at LIMIT ?)'

		await this.#db.raw(sql, [
			this.#table,
			this.#table,
			messagesCount
		])
	}

	getMessages(whatsappId) {
		 return this.#db(this.#table)
			.where({whatsapp_id: whatsappId})
	}
}