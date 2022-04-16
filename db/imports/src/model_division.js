'use strict'
/* Модуль работы с данными БД
table division
*/
const clDbQuery = require('./database').query // from pool
module.exports = {
  add: async (args) => {
    try {
      console.log(args)
      const sql = 'INSERT INTO division(name, oid, organization_id,list_name) VALUES ($1,$2,(SELECT id FROM organization WHERE oid = $3),$4) RETURNING id'

      const { rows } = await clDbQuery(sql, [
        args.name,
        args.oid,
        args.oidMo,
        args.list_name
      ])
      return rows[0].id
    } catch (err) {
      throw Error(err)
    }
  },
  findByOid: async (oid) => {
    try {
      const sql = 'SELECT id, oid, name, list_name FROM division WHERE oid = $1'
      const { rows, rowCount } = await clDbQuery(sql, [oid])
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  },
  update: async (args) => {
    try {
      const sql = 'UPDATE stat.division SET name=$2, organization_id=(SELECT id FROM organization WHERE oid = $3), list_name = $4 WHERE oid = $1 RETURNING id'
      const resalt = await clDbQuery(sql, [args.oid, args.name, args.oidMo, args.list_name])
      return resalt.rowCount
    } catch (err) {
      throw Error(err)
    }
  },
  listName: async () => {
    try {
      const sql = 'SELECT name FROM division'
      const { rows, rowCount } = await clDbQuery(sql, [])
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  },
  listOid: async () => {
    try {
      const sql = 'SELECT oid FROM division'
      const { rows, rowCount } = await clDbQuery(sql, [])
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  }
}
