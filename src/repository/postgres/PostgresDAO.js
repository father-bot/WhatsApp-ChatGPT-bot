import KnexDAO from '../KnexDAO.js'
import UserRepo from './UserRepo.js'
import MessageHistoryRepo from "./MessageHistoryRepo.js";

export default class PostgresDAO extends KnexDAO {
    constructor(host, port, user, database, password) {
        super({
            client: 'pg',
            connection: {
                host,
                port,
                user,
                database,
                password
            }
        })
    }

    users = new UserRepo(this.db)

	messageHistory = new MessageHistoryRepo(this.db)
}
