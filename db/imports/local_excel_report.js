
'use strict'
const PATH_TEMPLATE = '../../back/template'

const date = require('date-and-time')

const PATH_UPLOADS = './res_from_svod_xlsx'

const XlsxPopulate = require('xlsx-populate')

const applyStyle = (cell, v) => {
  if ('styles' in v) {
    Object.keys(v).forEach(k => {
      cell.style(k, v[k])
    })
  }
}
const getFormatValue = v => {
  if ('valueType' in v) {
    const format = getFormat(v)
    const value = getValue(v)
    if (format) {
      if (v.valueType === 'money') {
        return new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
          currencyDisplay: 'symbol',
          useGrouping: false
        }).format(value)
      } else if (v.valueType === 'numeric') {
        const [, c = ''] = format.split('.')
        return new Intl.NumberFormat('ru-RU', {
          style: 'decimal',
          useGrouping: false,
          minimumFractionDigits: c.length,
          maximumFractionDigits: c.length
        }).format(value)
      } else if (v.valueType === 'date') {
        let newFormat
        if (format.slice(-2) === 'mm') {
          newFormat = `${format.slice(0, format.length - 2).toUpperCase()}hh`
        } else {
          newFormat = format.toUpperCase()
        }
        return date.format(value, newFormat)
      } else {
        return `${value}`
      }
    } else {
      return value
    }
  } else {
    return v.value
  }
}

const getValue = v => {
  if ('valueType' in v) {
    let value = v.value
    if (v.valueType === 'integer') {
      try {
        value = parseInt(v.value, 10)
      } catch (e) {
        throw new Error(`Невозможно привести тип данных ${v.value} к целому типу`)
      }
    } else if (v.valueType === 'money' || v.valueType === 'numeric') {
      try {
        value = +v.value
      } catch (e) {
        throw new Error(`Невозможно привести тип данных ${v.value} к числовому типу`)
      }
    } else if (v.valueType === 'date') {
      try {
        value = new Date(v.value)
      } catch (e) {
        throw new Error(`Невозможно привести тип данных ${v.value} к типу дата`)
      }
    }
    return value
  } else {
    return v.value || ''
  }
}

const getFormat = v => {
  if ('valueType' in v) {
    if (v.valueType === 'integer') {
      return '0'
    } else if (v.valueType === 'money') {
      return '0.00'
    } else if (v.valueType === 'numeric') {
      return v.format || '0.00'
    } else if (v.valueType === 'date') {
      return v.format || 'dd.mm.yyyy'
    } else {
      return v.format || ''
    }
  } else {
    return v.format || ''
  }
}

const createXlsxFile = async ({ outputFileName, json: jsonData }) => {
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
    console.log('Ошибка при выполнении createXlsxFile')
    return Promise.reject(err)
  }
}

module.exports = createXlsxFile
