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
    
    async signUp(phone) {
        await this.#db(this.#table).insert([
            {phone}
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

    async setAIModel(phone, model) {
        await this.#db(this.#table)
            .where({phone})
            .update({ai_model: model})
    }

    async getAIModel(phone) {
        const queryResult = await this.#db(this.#table)
            .where({phone})
            .select('ai_model')

        return queryResult[0].ai_model
    }
}
