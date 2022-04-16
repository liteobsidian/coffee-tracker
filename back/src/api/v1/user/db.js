'use strict'
import db from '@db'
import log from '@log'
import { GET } from './sql'
export const getProfile = async ({ id = null }) => {
  try {
    if (!id) throw new Error(`Отсутствует информация о пользователе ${id}`)
    const { rowCount, rows } = await db.query(GET,
      [id]
    )
    if (!rowCount) throw new Error(`Ошибка при попытке получения профиля пользователя ${id}. Пользователь не найден в БД`)
    return rows[0]
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}
