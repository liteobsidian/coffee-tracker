'use strict'
// Сформировать из сводного за месяц файла кучу файлов в разрезе МО за месяц

const path = require('path')
const createXlsxFile = require('./local_excel_report')
const xlsx = require('xlsx')
const { promisify } = require('util')
const fs = require('fs')
const readFile = promisify(fs.readFile)
// const writeFIle = promisify(fs.writeFile)

const PERIOD = '2021_01'
const FILE_XLS = './svod_xlsx_whith_error/Липецкая_01_2021.xls'

const NameFile = (startName, inn) => {
  const name = startName.match(/(["'])(\\?.)*?\1/)
  const Inn_ = inn
  let fileNameMo = ''
  if (name === null) {
    fileNameMo = startName
  } else {
    fileNameMo = name[0]
  }
  fileNameMo = fileNameMo.replace(/['"]+/g, '')
  return 'ИНН' + Inn_ + '_' + fileNameMo + '_' + PERIOD
}

const MakeOutputFile = async data => {
  let json = {}
  const outputFileName = `MO_${data.name}_${data.period}.xlsx`

  const PATH_OUTPUT_FILE_NAME = path.join('./res_from_svod_xlsx', outputFileName)

  const templateFile = '../../back/template/template_v2021_v7.xlsx'

  try {
    const newItems = data.data
    const params = []
    json = {
      name: templateFile,
      tableName: 'Таблица 1',
      params: params,
      tableTag: '<TABLE_NOT_BORDER>',
      data: newItems.map((el, i) => {
        const l = []
        for (let j = 0; j < el.length; j++) {
          l.push({ value: el[j], valueType: typeof el[j] })
        }
        return l
      }
      )
    }
    const resultCreateFile = await createXlsxFile({ outputFileName, json })
    if (!resultCreateFile) throw new Error('Ошибка формирования xlsx файла!')
    return [outputFileName, PATH_OUTPUT_FILE_NAME]
  } catch (err) {
    console.log(err)
    return Promise.reject(err)
  }
}

async function main () {
  try {
    const rawData = await readFile(FILE_XLS)
    const x = xlsx.read(rawData, { type: 'buffer' })
    const ws = x.SheetNames.includes('Таблица 1') ? x.Sheets['Таблица 1'] : x.Sheets[x.SheetNames[0]]
    let dataJson = xlsx.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '', rawNumbers: true })
    let startData = 0
    for (let i = 0; i < dataJson.length; i++) {
      if (startData === dataJson.length - 2) break
      const firstRow = dataJson[startData]
      const nextRow = dataJson[startData + 1]
      const overRow = dataJson[startData + 2]
      if (firstRow[0] && nextRow[0] && overRow[0] && firstRow[0] === nextRow[0] && nextRow[0] === overRow[0]) break
      startData += 1
    }
    dataJson = dataJson.slice(startData).map(el => el.map(fl => typeof fl === 'string' ? fl.trim() : fl))
    let startName = dataJson[0][1]
    let Inn = ''
    Inn = dataJson[0][3]
    let k = 0
    let DataArr = []
    console.log(k, NameFile(startName, Inn))
    let fn = NameFile(startName, Inn)
    for (let i = 0; i < dataJson.length; i++) {
      if (startName !== dataJson[i][1] && dataJson[i][0] !== '') {
        const data = { name: fn, period: PERIOD, data: DataArr }
        await MakeOutputFile(data)
        k = k + 1
        DataArr = []
        Inn = ''
        Inn = dataJson[i][3]
        startName = dataJson[i][1]
        fn = NameFile(startName, Inn)
        console.log(k, i, NameFile(startName, Inn))
      } else {
        DataArr.push(dataJson[i])
      }
    }
    const data = { name: fn, period: PERIOD, data: DataArr }
    await MakeOutputFile(data)
  } catch (err) {
    console.log(err)
  }
}

// async function next () {
console.log(JSON.stringify(main()))
// }
