'use strict'
// АНАЛИЗ
/* Модуль работы с данными БД
table division
*/
const clFarmDbQuery = require('./database').clFarmDbQuery // FARM
module.exports = {
  findByName: async (name) => {
    // console.log('!!!',name)
    try {
      const sql = 'SELECT id, name FROM farm.auth_position WHERE LOWER(name)=LOWER($1);'
      const { rows, rowCount } = await clFarmDbQuery(sql, [String(name).trim()])
      // console.log('rows ',rows)
      // console.log('rowCount ', rowCount)
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  }
}
