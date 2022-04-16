import { Pool, types, Client } from 'pg'
import log from '@log'
import { DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DEBUG } from '@config'
types.setTypeParser(1114, str => str)
types.setTypeParser(1082, str => str)

const pool = new Pool({
  database: DB_NAME,
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD
})

pool.on('error', (err, client) => {
  log.error('Ошибка клиента', { error: err, client: client })
  process.exit(-1)
})

export default {
  query (text, params) {
    const start = Date.now()
    return pool.query(text, params)
      .then(res => {
        const duration = Date.now() - start
        if (duration > 200 || DEBUG) {
          log.debug(`Выполнен запрос, текст запроса: ${text}  время выполнения: ${duration} мс, возвращено строк: ${res.rowCount}`)
        }
        return res
      })
  },
  getClient: async () => {
    const client = await pool.connect()
    const query = client.query
    const release = client.release
    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!')
      console.error(`The last executed query on this client was: ${client.lastQuery}`)
    }, 5000)
    // monkey patch the query method to keep track of the last query executed
    client.query = (...args) => {
      client.lastQuery = args
      return query.apply(client, args)
    }
    client.release = () => {
      // clear our timeout
      clearTimeout(timeout)
      // set the methods back to their old un-monkey-patched version
      client.query = query
      client.release = release
      return release.apply(client)
    }
    return client
  },
  // Вариант клиента с прямым соединением через connect к postgresql
  clDbQuery: async (text, params) => {
    try {
      const start = Date.now()
      const client = new Client({
        database: DB_NAME,
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD
      })
      await client.connect()
      const result = await client.query(text, params)
      await client.end()
      const duration = Date.now() - start
      log.debug('PID=%s, SQL= %s ,params= [%s], время выполнения: %s мс, возвращено строк: %s', String(process.pid).padEnd(8, ' '), text, params.join(';'), duration, result.rowCount)
      return result
    } catch (err) {
      throw Error(err)
    }
  }
}
