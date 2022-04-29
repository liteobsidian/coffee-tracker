import db from '@db'
import { ADD, DELETE, EDIT, LIST } from './sql'

export const addDivisionDB = async ({ name, address, city, factor, nomenclature }) => {
  try {
    if (!name) throw new Error('Отсутствует название подразделения')
    const { rowCount, rows } = await db.query(ADD,
      [name, address, city, factor, JSON.stringify(nomenclature)]
    )
    if (!rowCount) throw new Error(`Ошибка при внесении подразделения ${name}.`)
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const editDivisionDB = async ({ id, name, address, city, factor, nomenclature }) => {
  try {
    if (!name) throw new Error('Отсутствует название подразделения')
    const { rowCount, rows } = await db.query(EDIT,
      [id, name, address, city, factor, nomenclature]
    )
    if (!rowCount) throw new Error('Ошибка при изменении подразделения')
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const deleteDivisionDB = async (id) => {
  try {
    if (!id) throw new Error('Отсутствует id подразделения')
    const { rowCount, rows } = await db.query(DELETE,
      [id]
    )
    if (!rowCount) throw new Error('Ошибка при удалении подразделения')
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const getDivisionsDB = async ({ query = '' }) => {
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
