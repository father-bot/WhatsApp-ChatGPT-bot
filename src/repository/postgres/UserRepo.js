export default class UserRepo {
    #db
    #table = 'users'
    
    constructor(db) {
        this.#db = db
    }

    async checkExistence(phone) {
        const rows = (await this.#db(this.#table).where({phone})).length

        return rows !== 0
    }
    
    async signUp(id, phone, messagesLeft) {
        await this.#db(this.#table).insert([
            {id, phone, messages_left: messagesLeft}
        ])
    }

    async setPersonality(phone, personality) {
        await this.#db(this.#table)
            .where({phone})
            .update({personality})
    }

    async getPersonality(phone) {
        const queryResult = await this.#db(this.#table)
            .where({phone})
            .select('personality')

        return queryResult[0].personality
    }
}
