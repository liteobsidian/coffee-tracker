'use strict'
/* Модуль работы с данными БД
*/
const clDbQuery = require('./database').query // from pool
module.exports = {
  add: async (args) => {
    try {
      console.log(args)
      const sql = 'INSERT INTO organization(oid,name,short_name, name_subject_mo,federal_subject_id) VALUES( $1, $2,$2,$3,$4) RETURNING id'
      const { rows } = await clDbQuery(sql, [
        args.oid,
        args.name,
        args.name_subject_mo,
        args.federal_id
      ])
      return rows[0].id
    } catch (err) {
      throw Error(err)
    }
  },
  insertFromNsi: async (args) => {
    try {
      console.log(args)
      const sql = 'INSERT INTO organization(oid,name,short_name, name_subject_mo,federal_subject_id,inn,kpp,ogrn) VALUES( $1, $2,$3,$4,$5,$6,$7,$8) RETURNING id'
      const { rows } = await clDbQuery(sql, [
        args.oid,
        args.name,
        args.short_name,
        args.name_subject_mo,
        args.federal_id,
        args.inn,
        args.kpp,
        args.ogrn
      ])
      return rows[0].id
    } catch (err) {
      throw Error(err)
    }
  },
  updateFromNsi: async (args) => {
    try {
      const sql = `UPDATE stat.organization 
      SET name=$2, 
      short_name=$3, 
      full_name=$2, 
      name_subject_mo=$4,
      federal_subject_id=$5,
      inn=$6,
      kpp=$7,
      ogrn=$8 
      WHERE oid = $1 RETURNING id`
      const resalt = await clDbQuery(sql, [args.oid,
        args.name,
        args.short_name,
        args.name_subject_mo,
        args.federal_id,
        args.inn,
        args.kpp,
        args.ogrn])
      return resalt.rowCount
    } catch (err) {
      throw Error(err)
    }
  },
  findByOid: async (oid) => {
    try {
      const sql = 'SELECT id, oid, name, name_subject_mo , federal_subject_id FROM stat.organization WHERE oid = $1'
      const { rows, rowCount } = await clDbQuery(sql, [oid])
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  },

  update: async (args) => {
    try {
      const sql = 'UPDATE stat.organization SET name=$2, short_name=$2, full_name=$2, name_subject_mo=$3, federal_subject_id=$4 WHERE oid = $1 RETURNING id'
      const resalt = await clDbQuery(sql, [args.oid, args.name, args.name_subject_mo, args.federal_id])
      return resalt.rowCount
    } catch (err) {
      throw Error(err)
    }
  },

  history: async (args) => {
    try {
      const sql = 'SELECT id,service_id,uuid,file_path, data, created_at FROM recipes.request as r WHERE r.service_id = $1 and r.created_at BETWEEN $2 and $3'
      const { rows, rowCount } = await clDbQuery(sql, [args.service_id, args.start, args.end])
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  },
  findBySnils: async (snils) => {
    try {
      const sql = "SELECT uuid, data->'patient'->'snils' as snils, data, created_at FROM recipes.request WHERE data -> 'patient' ->> 'snils' = $1"
      const { rows, rowCount } = await clDbQuery(sql, [snils])
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  },
  listName: async () => {
    try {
      const sql = 'SELECT name FROM stat.organization'
      const { rows, rowCount } = await clDbQuery(sql, [])
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  },
  listOid: async () => {
    try {
      const sql = 'SELECT oid FROM stat.organization'
      const { rows, rowCount } = await clDbQuery(sql, [])
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  },
  findByInn: async (inn) => {
    try {
      const sql = 'SELECT id,oid,inn,name,name_subject_mo,federal_subject_id,list_oid,list_name FROM stat.organization WHERE inn = $1'
      const { rows, rowCount } = await clDbQuery(sql, [inn])
      return rowCount ? rows : []
    } catch (err) {
      throw Error(err)
    }
  },
  insertFromNsiByInn: async (args) => {
    try {
      console.log(args)
      // to_jsonb(array[$9]
      const sql = 'INSERT INTO organization(oid,name,short_name, name_subject_mo,federal_subject_id,inn,kpp,ogrn,list_oid,list_name) VALUES( $1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id'
      const { rows } = await clDbQuery(sql, [
        args.oid,
        args.name,
        args.short_name,
        args.name_subject_mo,
        args.federal_id,
        args.inn,
        args.kpp,
        args.ogrn,
        args.list_oid,
        args.list_name
      ])
      return rows[0].id
    } catch (err) {
      throw Error(err)
    }
  },
  updateFromNsiByInn: async (args) => {
    try {
      const sql = `UPDATE stat.organization 
      SET name=$2, 
      short_name=$3, 
      full_name=$2, 
      name_subject_mo=$4,
      federal_subject_id=$5,
      kpp=$6,
      ogrn=$7,
      list_oid = $8,
      list_name = $9
      WHERE inn = $1 RETURNING id`
      // to_jsonb(array[
      const resalt = await clDbQuery(sql, [args.inn,
        args.name,
        args.short_name,
        args.name_subject_mo,
        args.federal_id,
        args.kpp,
        args.ogrn,
        args.list_oid,
        args.list_name
      ])
      return resalt.rowCount
    } catch (err) {
      throw Error(err)
    }
  }

}
