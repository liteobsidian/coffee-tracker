import db from '@db'
import { ADD, DELETE, EDIT, LIST } from './sql'

export const addWorkdayDB = async ({ date, user_id, division_id, uncash_sum, cash_sum, date_open, date_close }) => {
  try {
    if (!date) throw new Error('Отсутствует дата смены')
    const { rowCount, rows } = await db.query(ADD,
      [date, user_id, division_id, uncash_sum, cash_sum, date_open, date_close]
    )
    if (!rowCount) throw new Error(`Ошибка при внесении смены ${date}.`)
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const editWorkdayDB = async ({ id, date, user_id, division_id, uncash_sum, cash_sum, date_open, date_close }) => {
  try {
    if (!date) throw new Error('Отсутствует дата смены')
    const { rowCount, rows } = await db.query(EDIT,
      [id, date, user_id, division_id, uncash_sum, cash_sum, date_open, date_close]
    )
    if (!rowCount) throw new Error('Ошибка при изменении смены')
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const deleteWorkdayDB = async (id) => {
  try {
    if (!id) throw new Error('Отсутствует id смены')
    const { rowCount, rows } = await db.query(DELETE,
      [id]
    )
    if (!rowCount) throw new Error('Ошибка при удалении смены')
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const getWorkdaysDB = async ({ query = '' }) => {
  try {
    const { rows } = await db.query(LIST,
      [query]
    )
    return rows
  } catch (error) {
    return Promise.reject(error)
  }
}
