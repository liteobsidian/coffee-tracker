'use strict'
import db from '@db'
import log from '@log'
import { LIST, LIST_ACTIVE } from './sql'

export const list = async () => {
  try {
    const { rowCount, rows } = await db.query(LIST, [])
    return rowCount ? rows : []
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}

export const listActive = async ({ period }) => {
  try {
    const { rowCount, rows } = await db.query(LIST_ACTIVE, [period])
    const items = rowCount ? rows.map(el => el.name) : []
    return items
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}
