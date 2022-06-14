import db from '@db'
import { LIST } from './sql'

export const getListDB = async ({ query = '' }) => {
  try {
    const currentDate = new Date()
    const { rowCount, rows } = await db.query(LIST,
      [currentDate.toISOString().split('T')[0], query]
    )
    if (!rowCount) throw new Error('Ошибка загрузки списка остатков.')
    return rows
  } catch (error) {
    return Promise.reject(error)
  }
}
