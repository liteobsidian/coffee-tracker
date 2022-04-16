import log from '@log'
import XlsxPopulate from 'xlsx-populate'
import { getFormatValue, getValue, getFormat } from './utils'
import { PATH_TEMPLATE, PATH_UPLOADS } from './config'

const applyStyle = (cell, v) => {
  if ('styles' in v) {
    Object.keys(v).forEach(k => {
      cell.style(k, v[k])
    })
  }
}
export const createXlsxFile = async ({ outputFileName, json: jsonData }) => {
  try {
    // Формируем локально файл xlsx
    // const { params, name: templateFileName, tableTag, data: tableData } = jsonData
    const { params, name: templateFileName, tableTag } = jsonData
    const workbook = await XlsxPopulate.fromFileAsync(`${PATH_TEMPLATE}/${templateFileName}`)
    const clearUnusedParam = () => {
      workbook.find(/<.*>/).forEach(cell => {
        cell.value(cell.value().replace(/<.*>/g, ''))
      })
    }
    const applyParam = (param = {}) => {
      workbook.find(`<${param.key}>`).forEach(cell => {
        if (cell.value() === `<${param.key}>`) {
          const value = getValue(param)
          const format = getFormat(param)
          cell.value(value)
          if (format) {
            cell.style('numberFormat', format)
          }
          applyStyle(cell, param)
        } else {
          const value = getFormatValue(param)
          const REG = new RegExp(`<${param.key}>`, 'g')
          cell.value(cell.value().replace(REG, value))
        }
      })
    }
    const applyData = (data = {}) => {
      if (!Object.keys(data).length) {
        throw new Error('Отсутсвуют данные для заполнения шаблона XLSX')
      }
      // const table = data
      if (data.length) {
        workbook.find(tableTag).slice(0, 1).forEach(startCell => {
          data.forEach((row, i) => {
            // console.log('row', i)
            row.forEach((item, j) => {
              const updateCell = startCell.relativeCell(i, j)
              const value = getValue(item)
              updateCell.value(value)
            })
          })
        })
      }
      clearUnusedParam()
    }
    // Выполним заполнение параметров
    params.forEach(param => applyParam(param))
    // Выполним заполнение данными табличной части
    applyData(jsonData.data)
    await workbook.toFileAsync(`${PATH_UPLOADS}/${outputFileName}`)
    return true
  } catch (err) {
    log.error('Ошибка при выполнении createXlsxFile')
    log.error(err)
    return Promise.reject(err)
  }
}
