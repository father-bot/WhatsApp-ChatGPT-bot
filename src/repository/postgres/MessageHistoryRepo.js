export default class MessageHistoryRepo {
	#db
	#table = 'message_history'

	constructor(db) {
		this.#db = db
	}

	async append(phone, role, message) {
		await this.#db(this.#table).insert([
			{phone, role, body: message}
		])
	}

	async clear(phone) {
		await this.#db(this.#table)
			.where({phone})
			.del()
	}

	async deleteFirst(phone, messagesCount) {
		const sql = 'DELETE FROM ? WHERE id IN (SELECT id FROM ? ORDER BY created_at LIMIT ?)'

		await this.#db.raw(sql, [
			this.#table,
			this.#table,
			messagesCount
		])
	}

	getMessages(phone) {
		 return this.#db(this.#table)
			.where({phone})
	}
}