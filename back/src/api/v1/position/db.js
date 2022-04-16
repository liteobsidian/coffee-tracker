'use strict'
import db from '@db'
import log from '@log'
import { LIST, LIST_NAME } from './sql'

export const list = async () => {
  try {
    const { rowCount, rows } = await db.query(LIST, [])
    return rowCount ? rows : []
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}

export const listName = async () => {
  try {
    const { rowCount, rows } = await db.query(LIST_NAME, [])
    const items = rowCount ? rows.map(el => el.name.toLowerCase()) : []
    return items
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}
