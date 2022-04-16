'use strict'
/* Модуль работы с данными БД
table finance_source
*/
const clDbQuery = require('./database').clDbQuery // from pool
module.exports = {
  add: async (args) => {
    try {
      const sql = 'INSERT INTO finance_source(name, b_date, e_date) VALUES ($1,$2,$3) RETURNING id'

      const { rows } = await clDbQuery(sql, [
        args.name,
        args.b_date,
        args.e_date
      ])
      return rows[0].id
    } catch (err) {
      throw Error(err)
    }
  },
  findByName: async (name) => {
    try {
      const sql = 'SELECT id, name, b_date, e_date FROM stat.finance_source WHERE LOWER(name) = LOWER($1)'
      const { rows, rowCount } = await clDbQuery(sql, [name])
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  },
  update: async (args) => {
    try {
      const sql = 'UPDATE stat.finance_source SET name=$2,b_date=$3, e_date=$4 WHERE id=$1 RETURNING id'
      const resalt = await clDbQuery(sql, [args.id, args.name, args.b_date, args.e_date])
      return resalt.rowCount
    } catch (err) {
      throw Error(err)
    }
  },
  listActive: async (period) => {
    try {
      const sql = 'SELECT id, name, b_date, e_date FROM stat.finance_source WHERE b_date <= $1 AND ( e_date isNull or e_date >= $1)'
      const { rows, rowCount } = await clDbQuery(sql, [period])
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  }
}
