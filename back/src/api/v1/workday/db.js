import db from '@db'
import { START, GET, ADD, DELETE, EDIT, LIST, END, NEXT, UPDATE_FACTOR } from './sql'

export const getUserWorkdayDB = async ({ id = '' }) => {
  try {
    if (!id) throw new Error('Пользователь не распознан')
    const { rowCount, rows } = await db.query(GET,
      [id]
    )
    return rowCount ? rows[0] : null
  } catch (error) {
    return Promise.reject(error)
  }
}
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
    const { rows: statusUpdate } = await db.query(UPDATE_FACTOR)
    console.log(statusUpdate[0])
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
export const startDayDB = async ({ id }) => {
  try {
    const { rows } = await db.query(START,
      [id]
    )
    return rows
  } catch (error) {
    return Promise.reject(error)
  }
}
export const endDayDB = async ({ userId, uncash_sum, cash_sum }) => {
  try {
    if (!uncash_sum && !cash_sum) throw new Error('В запросе отсутствует выручка')
    if (!userId) throw new Error('В запросе отсутствует информация о пользователе')
    const { rows } = await db.query(END,
      [userId, uncash_sum, cash_sum]
    )
    const { rows: statusUpdate } = await db.query(UPDATE_FACTOR)
    console.log(statusUpdate[0])
    return rows
  } catch (error) {
    return Promise.reject(error)
  }
}

export const nextDayDB = async ({ id }) => {
  try {
    const { rows } = await db.query(NEXT,
      [id]
    )
    return rows.length ? rows[0] : null
  } catch (error) {
    return Promise.reject(error)
  }
}
