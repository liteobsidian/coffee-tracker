/* Модуль подключения к БД */
const log = require('./common/logger')
const cfg = require('../config.js')
const { Pool, Client } = require('pg')
const pool = new Pool({
  database: cfg.DB_NAME,
  host: cfg.DB_HOST,
  port: cfg.DB_PORT,
  user: cfg.DB_USER,
  password: cfg.DB_PASSWORD
})

const poolFarm = new Pool({
  database: cfg.FARMDB_NAME,
  host: cfg.FARMDB_HOST,
  port: cfg.FARMDB_PORT,
  user: cfg.FARMDB_USER,
  password: cfg.FARMDB_PASSWORD
})

pool.on('error', (err, client) => {
  log.error('Ошибка клиента', { error: err, client: client })
  process.exit(-1)
})
module.exports = {
  query: (text, params) => {
    const start = Date.now()
    return new Promise((resolve, reject) => {
      pool.query(text, params, (error, res) => {
        if (error) reject(error)
        const duration = Date.now() - start
        if (duration > cfg.MAX_TIME_QUERY || cfg.DEBUG) {
          if (typeof res !== 'undefined') {
            // log.debug(`Выполнен запрос, текст запроса: ${text}  время выполнения: ${duration} мс, возвращено строк: ${res.rowCount}`)
          }
        }
        resolve(res)
      })
    })
  },
  clDbQuery: async (text, params) => {
    try {
      const start = Date.now()
      const client = new Client({
        user: cfg.DB_USER,
        host: cfg.DB_HOST,
        database: cfg.DB_NAME,
        password: cfg.DB_PASSWORD,
        port: cfg.DB_PORT
      })
      await client.connect()
      const res = await client.query(text, params)
      await client.end()
      const duration = Date.now() - start
      // log.info('PID=%s, SQL= %s ,params= [%s], время выполнения: %s мс, возвращено строк: %s', String(process.pid).padEnd(8, ' '), text, params.join(';'), duration, res.rowCount)
      return res
    } catch (err) {
      throw Error(err)
    }
  },
  clAuthDbQuery: async (text, params) => {
    try {
      const start = Date.now()
      const authClient = new Client({
        user: cfg.AUTH_DB_USER,
        host: cfg.AUTH_DB_HOST,
        database: cfg.AUTH_DB_NAME,
        password: cfg.AUTH_DB_PASSWORD,
        port: cfg.AUTH_DB_PORT
      })
      await authClient.connect()
      const res = await authClient.query(text, params)
      await authClient.end()
      const duration = Date.now() - start
      log.debug('PID=%s, SQL= %s ,params= [%s], время выполнения: %s мс, возвращено строк: %s', String(process.pid).padEnd(8, ' '), text, params.join(';'), duration, res.rowCount)
      return res
    } catch (err) {
      throw Error(err)
    }
  },
  // ТЕСТ OK
  // clFarmDbQuery: (text, params) => {
  //   const start = Date.now()
  //   return new Promise((resolve, reject) => {
  //     poolFarm.query(text, params, (error, res) => {
  //       if (error) reject(error)
  //       const duration = Date.now() - start
  //       if (duration > cfg.MAX_TIME_QUERY || cfg.DEBUG) {
  //         if (typeof res !== 'undefined') {
  //           // log.debug(`Выполнен запрос, текст запроса: ${text}  время выполнения: ${duration} мс, возвращено строк: ${res.rowCount}`)
  //         }
  //       }
  //       resolve(res)
  //     })
  //   })
  // },

  clFarmDbQuery: async (text, params) => {
    try {
      const start = Date.now()
      const client = new Client({
        user: cfg.FARMDB_USER,
        host: cfg.FARMDB_HOST,
        database: cfg.FARMDB_NAME,
        password: cfg.FARMDB_PASSWORD,
        port: cfg.FARMDB_PORT
      })
      await client.connect()
      const res = await client.query(text, params)
      await client.end()
      // const duration = Date.now() - start
      // log.debug('PID=%s, SQL= %s ,params= [%s], время выполнения: %s мс, возвращено строк: %s', String(process.pid).padEnd(8, ' '), text, params.join(';'), duration, res.rowCount)
      return res
    } catch (err) {
      throw Error(err)
    }
  }
}
