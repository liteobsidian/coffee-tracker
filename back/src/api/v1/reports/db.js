import db from '@db'
import { LIST } from './sql'

export const getListDB = async ({ dateStart = null, dateEnd = null, method }) => {
  try {
    const { rowCount, rows } = await db.query(LIST,
      [method, dateStart, dateEnd]
    )
    if (!rowCount) throw new Error('Ошибка загрузки списка остатков.')
    return rows
  } catch (error) {
    return Promise.reject(error)
  }
}
