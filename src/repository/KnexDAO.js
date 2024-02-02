import knex from 'knex'

export default class KnexDAO {
   constructor(conn) {
      this.db = knex(conn)
   }
}
