import { getListDB } from './db'
import xlsx from 'node-xlsx'
import fs from 'fs'

export const getList = async (data) => {
  try {
    const response = await getListDB(data)
    const range = { s: { c: 0, r: 0 }, e: { c: 4, r: 0 } } // A1:A5
    const sheetOptions = { '!merges': [range] }
    console.log([
      [`${data.description}${data.dateStart ? ' c ' + data.dateStart : ''}${data.dateEnd ? ' до ' + data.dateEnd : ''}`],
      [],
      ['Дата смены', 'Идентификатор точки', 'Название точки', 'Выручка за день', 'Выручка точки за выбранный период'],
      ...response
    ])
    const buffer = await xlsx.build([{
      name: 'Налоговый отчёт',
      data: [
        [`${data.description}${data.dateStart ? ' c ' + data.dateStart : ''}${data.dateEnd ? ' до ' + data.dateEnd : ''}`],
        [],
        ['Дата смены', 'Идентификатор точки', 'Название точки', 'Выручка за день', 'Выручка точки за выбранный период'],
        ...response
      ],
      options: sheetOptions
    }])
    fs.writeFileSync(`template/${data.method}.xlsx`, buffer, () => {})
    return response
  } catch (error) {
    return Promise.reject(error)
  }
}
