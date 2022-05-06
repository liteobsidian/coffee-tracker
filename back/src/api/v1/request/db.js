import db from '@db'
import { ADD, ADD_NOMENCLATURE, EDIT_NOMENCLATURE, DELETE, EDIT, LIST } from './sql'

export const addRequestDB = async ({ date_create, division_id, userId, nomenclature }) => {
  const client = await db.getClient()
  try {
    await client.query('BEGIN')
    await client.query('SET timezone = \'utc-3\'')
    await client.query('SET DateStyle = \'DMY\'')
    if (!date_create) throw new Error('Отсутствует дата заявки')
    if (!division_id) throw new Error('Отсутствует id точки')
    const { rowCount, rows } = await client.query(ADD,
      [date_create, division_id, userId]
    )
    if (!rowCount) throw new Error(`Ошибка при внесении заявки ${date_create}.`)
    if (!rows[0].id || !nomenclature.length) return rows[0]
    const { rowCount: countRows } = await client.query(ADD_NOMENCLATURE, [rows[0].id, JSON.stringify(nomenclature)])
    if (!countRows) throw new Error('Ошибка при внесении номенклатуры')
    client.query('COMMIT')
    return rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    return Promise.reject(error)
  } finally {
    client.release()
  }
}
export const editRequestDB = async ({ id, date_create, division_id, userId, is_accept, date_accept, nomenclature }) => {
  const client = await db.getClient()
  try {
    await client.query('BEGIN')
    await client.query('SET DateStyle = \'DMY\'')

    if (!date_create) throw new Error('Отсутствует дата заявки')
    if (!division_id) throw new Error('Отсутствует id точки')
    const { rowCount, rows } = await client.query(EDIT,
      [id, date_create.split('.').reverse().join('-'), division_id, userId, is_accept,
        date_accept ? date_accept.split('.').reverse().join('-') : null]
    )
    console.log('ADD row COUNT', rowCount)
    if (!rowCount) throw new Error('Ошибка при изменении заявки')
    const { rowCount: countRows } = await client.query(EDIT_NOMENCLATURE, [id, JSON.stringify(nomenclature)])
    if (!countRows) throw new Error('Ошибка при изменении номенклатуры')
    await client.query('COMMIT')
    return rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    return Promise.reject(error)
  } finally {
    await client.release()
  }
}
export const deleteRequestDB = async (id) => {
  try {
    if (!id) throw new Error('Отсутствует id заявки')
    const { rowCount, rows } = await db.query(DELETE,
      [id]
    )
    if (!rowCount) throw new Error('Ошибка при удалении заявки')
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const getRequestListDB = async ({ query = '' }) => {
  try {
    const { rowCount, rows } = await db.query(LIST)
    if (!rowCount) throw new Error('Ошибка загрузки списка заявок.')
    return rows
  } catch (error) {
    return Promise.reject(error)
  }
}
