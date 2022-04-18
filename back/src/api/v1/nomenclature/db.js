import db from '@db'
import { ADD, DELETE, EDIT, LIST } from './sql'

export const addNomenclatureDB = async ({ name, unit, lot_value, min_count, max_count, cost, is_perishable }) => {
  try {
    if (!name) throw new Error('Отсутствует название номенклатуры')
    const { rowCount, rows } = await db.query(ADD,
      [name, unit, lot_value, min_count, max_count, cost, is_perishable]
    )
    if (!rowCount) throw new Error(`Ошибка при внесении номенклатуры ${name}.`)
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const editNomenclatureDB = async ({ id, name, unit, lot_value, min_count, max_count, cost, is_perishable }) => {
  try {
    if (!name) throw new Error('Отсутствует название номенклатуры')
    const { rowCount, rows } = await db.query(EDIT,
      [id, name, unit, lot_value, min_count, max_count, cost, is_perishable]
    )
    if (!rowCount) throw new Error('Ошибка при изменении номенклатуры')
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const deleteNomenclatureDB = async (id) => {
  try {
    if (!id) throw new Error('Отсутствует id номенклатуры')
    const { rowCount, rows } = await db.query(DELETE,
      [id]
    )
    if (!rowCount) throw new Error('Ошибка при удалении номенклатуры')
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const getNomenclatureDB = async ({ query = '' }) => {
  try {
    const { rowCount, rows } = await db.query(LIST,
      [query]
    )
    if (!rowCount) throw new Error('Ошибка загрузки списка номенклатур')
    return rows
  } catch (error) {
    return Promise.reject(error)
  }
}
