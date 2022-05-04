import db from '@db'
import { GET, ADD, DELETE, EDIT, LIST } from './sql'

export const getInventoryDB = async ({ id }) => {
  try {
    if (!id) throw new Error('Отсутствует id инвентаризации')
    const { rowCount, rows } = await db.query(GET,
      [id]
    )
    if (!rowCount) throw new Error(`Ошибка при внесении инвентаризации ID: ${id}.`)
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}

export const addInventoryDB = async ({ date, division_id, division_name, nomenclature }) => {
  try {
    if (!date) throw new Error('Отсутствует дата инвентаризации')
    if (!division_id) throw new Error('Отсутствует id точки')
    const { rowCount, rows } = await db.query(ADD,
      [date, division_id, division_name, JSON.stringify(nomenclature)]
    )
    if (!rowCount) throw new Error(`Ошибка при внесении инвентаризации ${date}.`)
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const editInventoryDB = async ({ id, date, division_id, division_name, nomenclature }) => {
  try {
    if (!date) throw new Error('Отсутствует дата инвентаризации')
    if (!division_id) throw new Error('Отсутствует id точки')
    const { rowCount, rows } = await db.query(EDIT,
      [id, date, division_id, division_name, JSON.stringify(nomenclature)]
    )
    if (!rowCount) throw new Error('Ошибка при изменении инвентаризации')
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const deleteInventoryDB = async (id) => {
  try {
    if (!id) throw new Error('Отсутствует id инвентаризации')
    const { rowCount, rows } = await db.query(DELETE,
      [id]
    )
    if (!rowCount) throw new Error('Ошибка при удалении инвентаризации')
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const getInventoryListDB = async ({ query = '' }) => {
  try {
    const { rowCount, rows } = await db.query(LIST,
      [query]
    )
    if (!rowCount) throw new Error('Ошибка загрузки списка подразделений.')
    return rows
  } catch (error) {
    return Promise.reject(error)
  }
}
