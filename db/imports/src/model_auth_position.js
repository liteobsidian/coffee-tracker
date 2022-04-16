'use strict'
/* Модуль работы с данными БД
table auth_position
*/
const clDbQuery = require('./database').query // stat pool
module.exports = {
  // Функция добавления данных из экспортного файла farm с указанием точного соответвствия id
  addOnce: async (args) => {
    try {
      console.log(args)

      // id;name;parent_id;sort;normative;form_30;sert;actual;comment;p_group;data_end
      const sql = 'INSERT INTO stat.auth_position(id,name,parent_id,sort,normative,sert,actual,comment,p_group,data_end) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id'
      const { rows } = await clDbQuery(sql, [
        args.id,
        args.name,
        args.parent_id,
        args.sort,
        args.normative,
        args.sert,
        args.actual,
        args.comment,
        args.p_group,
        args.data_end
      ])
      return rows[0].id
    } catch (err) {
      throw Error(err)
    }
  },
  // Функция добавления данных из эталонного справочника position_08.02.2020
  addOnce100000: async (args) => {
    try {
      // console.log(args)
      const sql = 'INSERT INTO stat.auth_position(name,parent_id,actual) VALUES ($1,$2,$3) RETURNING id'
      const { rows } = await clDbQuery(sql, [
        args.name,
        100000,
        true
      ])
      return rows[0].id
    } catch (err) {
      throw Error(err)
    }
  },

  findById: async (args) => {
    // console.log('!!!',args)
    try {
      const sql = 'SELECT id, name FROM stat.auth_position WHERE id=$1;'
      const { rows, rowCount } = await clDbQuery(sql, [args.id])
      // console.log('rows ',rows)
      // console.log('rowCount ', rowCount)
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  },

  findByName: async ({ name }) => {
    // console.log('!!!',name)
    try {
      const sql = 'SELECT id, name FROM stat.auth_position WHERE LOWER(name)=LOWER($1);'
      const { rows, rowCount } = await clDbQuery(sql, [String(name).trim()])
      // console.log('rows ',rows)
      // console.log('rowCount ', rowCount)
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  },
  updateOnce: async (args) => {
    try {
      const sql = 'UPDATE stat.auth_position SET name=$2,parent_id=$3,sort=$4,normative=$5,sert=$6,actual=$7,comment=$8,p_group=$9,data_end=$10 WHERE id = $1 RETURNING id'
      const resalt = await clDbQuery(sql, [
        args.id,
        args.name,
        args.parent_id,
        args.sort,
        args.normative,
        args.sert,
        args.actual,
        args.comment,
        args.p_group,
        args.data_end
      ])
      return resalt.rowCount
    } catch (err) {
      throw Error(err)
    }
  },
  listName: async () => {
    try {
      const sql = 'SELECT name FROM stat.auth_position'
      const { rows, rowCount } = await clDbQuery(sql, [])
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  }
}
