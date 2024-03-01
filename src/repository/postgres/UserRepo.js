export default class UserRepo {
    #db
    #table = 'users'
    
    constructor(db) {
        this.#db = db
    }

    async checkExistence(whatsappId) {
        const queryResult = await this.#db(this.#table)
            .where({whatsapp_id: whatsappId})

        return queryResult.length !== 0
    }
    
    async signUp(whatsappId) {
        await this.#db(this.#table).insert([
            {whatsapp_id: whatsappId}
        ])
    }

    async setPersonality(whatsappId, personality) {
        await this.#db(this.#table)
            .where({whatsapp_id: whatsappId})
            .update({personality})
    }

    async getPersonality(whatsappId) {
        const queryResult = await this.#db(this.#table)
            .where({whatsapp_id: whatsappId})
            .select('personality')

        return queryResult[0].personality
    }

    async setAIModel(whatsappId, model) {
        await this.#db(this.#table)
            .where({whatsapp_id: whatsappId})
            .update({ai_model: model})
    }

    async getAIModel(whatsappId) {
        const queryResult = await this.#db(this.#table)
            .where({whatsapp_id: whatsappId})
            .select('ai_model')

        return queryResult[0].ai_model
    }
}
