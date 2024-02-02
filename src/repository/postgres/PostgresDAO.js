import KnexDAO from '../KnexDAO.js'
import UserRepo from './UserRepo.js'

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
}
