import db from '@db'
import { LIST } from './sql'

export const getListDB = async ({ query = '' }) => {
  try {
    const { rowCount, rows } = await db.query(LIST,
      [query]
    )
    if (!rowCount) throw new Error('Ошибка загрузки списка остатков.')
    return rows
  } catch (error) {
    return Promise.reject(error)
  }
}
