import db from '@db'
// import { LIST } from './sql'

export const getListDB = async ({ dateStart = '01.01.1970', dateEnd = '31.12.2099', method, description }) => {
  try {
    console.log(method, dateStart, dateEnd, description)
    const { rowCount, rows } = await db.query(
      `select ${method}('${dateStart ? dateStart.split('.').reverse().join('-') : '01.01.1970'}'::date,
      '${dateEnd ? dateEnd.split('.').reverse().join('-') : '31.12.2099'}'::date)`
      // LIST,
      // [method, dateStart.split('.').reverse().join('-'), dateEnd.split('.').reverse().join('-')]
    )
    if (!rowCount) throw new Error('Ошибка загрузки списка остатков.')
    return rows[0][method]
  } catch (error) {
    return Promise.reject(error)
  }
}
