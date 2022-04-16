'use strict'
import db from '@db'
import log from '@log'
import { LIST, GET } from './sql'

export const listTypesDB = async () => {
  try {
    const { rowCount, rows } = await db.query(LIST, [])
    return rowCount ? rows : []
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}
export const findById = async ({ type_report }) => {
  try {
    const { rowCount, rows } = await db.query(GET, [type_report])
    return rowCount ? rows : []
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}
