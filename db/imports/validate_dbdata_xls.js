
const { parse, isValid } = require('date-fns')
const { listName: PositionListName } = require('./src/controller_auth_position')
const { listName: OrgListName, listOid: OrgListOid } = require('./src/controller_organization')
const { listName: DivListName, listOid: DivListOid } = require('./src/controller_division')
const { listActive: FinanceListName } = require('./src/controller_finance_source')

const xlsx = require('xlsx')
const { promisify } = require('util')
const fs = require('fs')
const readFile = promisify(fs.readFile)
const Ajv = require('ajv')
const { throws } = require('assert')
const ajv = new Ajv({ strict: false, allErrors: true, useDefaults: 'empty', coerceTypes: true })

const PERIOD = '2021-02-01'
// const writeFIle = promisify(fs.writeFile)

 const FILE_XLS = './test.xlsx'
// const FILE_XLS = './ЛГБ4-Липецк-мед_ERROR.xlsx'

// const FILE_XLS = './Липецкая_02_2021.xlsx'
// const FILE_XLS = './Липецкая_01_2021.xlsx'
// const FILE_XLS = './Липецкая_01_2021_17_number.xlsx'

let orgName = []
let orgOid = []
let divName = []
let divOid = []
let finName = []
let posName = []

// Загрузка массивов эталонных справочников
const dict = async (data) => {
  try {
    orgName = await OrgListName().catch(err => { throw Error(err) })
    orgOid = await OrgListOid().catch(err => { throw Error(err) })
    divName = await DivListName().catch(err => { throw Error(err) })
    divOid = await DivListOid().catch(err => { throw Error(err) })
    finName = await FinanceListName(data).catch(err => { throw Error(err) })
    posName = await PositionListName().catch(err => { throw Error(err) })
  } catch (err) { throw Error(err) }
}

// const orgName = [
//   'Государственное учреждение здравоохранения"Елецкая городская больница №2"',
// ]

const isOrganizationName = (x) => { return orgName.includes(x) }
ajv.addFormat('СООТВЕТСТВИЕ НАИМЕНОВАНИЯ СПРАВОЧНИКУ МЕДИЦИНСКИХ ОРГАНИЗАЦИЙ', (x) => { return isOrganizationName(x) })

// const orgOid = [
//   '1.2.643.5.1.13.13.12.2.48.4512',
// ]
const isOrganizationOid = (x) => { return orgOid.includes(x) }
ajv.addFormat('СООТВЕТСТВИЕ OID СПРАВОЧНИКУ МЕДИЦИНСКИХ ОРГАНИЗАЦИЙ', (x) => { return isOrganizationOid(x) })

// const divisionNmae = [
//   'СТАЦИОНАР',
//   'Хирургическое отделение',
//   'ПОЛИКЛИНИКА',
//   'Отделение анестезиологии и реанимации',
//   'Дневной стационар',
//   'Женская консультация',
//   'Центр здоровья',
//   'Отделение функциональной диагностики',
//   'Бактериологическая лаборатория',
//   'Клинико-диагностическая лаборатория',
//   'Центр амбулаторной онкологической помощи',
//   'Лучевая диагностика',
//   'Терапевтическое отделение',
//   'Оториноларингологическое отделение',
//   'Неврологическое отделение',
//   'Кардиологическое отделение'
// ]
const isDivisionName = (x) => { return divName.includes(x) }
ajv.addFormat('СООТВЕТСТВИЕ НАИМЕНОВАНИЯ СПРАВОЧНИКУ ПОДРАЗДЕЛЕНИЯ М.О.', (x) => { return isDivisionName(x) })

// const divisionOid = [
//   '1.2.643.5.1.13.13.12.2.48.4512.0.361124',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.361157',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.361118',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.361154',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.355416',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.359970',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.356759',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.360729',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.360728',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.410218',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.410222',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.359473',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.410216',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.410221',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.368902',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.361142',
//   '1.2.643.5.1.13.13.12.2.48.4512.0.361104'
// ]

const isDivisionOid = (x) => { return divOid.includes(x) }
ajv.addFormat('СООТВЕТСТВИЕ OID СПРАВОЧНИКУ ПОДРАЗДЕЛЕНИЯ М.О.', (x) => { return isDivisionOid(x) })

const isFinanceNameActive = (x) => { return finName.includes(x) }
ajv.addFormat('СООТВЕТСТВИЕ НАИМЕНОВАНИЯ ИСТОЧНИКА ФИНАНСИРОВАНИЯ НА ОТЧЕТНЫЙ ПЕРИОД', (x) => { return isFinanceNameActive(x) })

const isPositionName = (x) => { return posName.includes((x).toLowerCase()) }
ajv.addFormat('СООТВЕТСТВИЕ НАИМЕНОВАНИЯ ДОЛЖНОСТИ СПРАВОЧНОМУ НАИМЕНОВАНИЮ', (x) => { return isPositionName(x) })

ajv.addFormat('date', { validate: (x) => isValid(parse(x, 'dd.MM.yyyy', new Date())) })

const isYearData = (x) => { return PERIOD.substr(0, 4) === x }
ajv.addFormat('ГОД ПРЕДОСТАВЛЕНИЯ ДАННЫХ', (x) => { return isYearData(x) })

function checkNumber (x) {
  const n = parseFloat(x)
  if (!isNaN(n)) {
    return true
  } else {
    return false
  }
}
ajv.addFormat('ЧИСЛО', { validate: (x) => checkNumber(x) })

const SCHEMA = {
  type: 'array',
  items: {
    type: 'array',
    items: [
      { // 0
        title: 'Область',
        description: 'наименование области к которой относится медицинская организация',
        examples: ['Липецкая область'],
        type: 'string',
        const: 'Липецкая область'
      },
      { // 1
        title: 'Наименование медицинской организации',
        description: 'Полное официальное наименование медицинской органиазции',
        type: 'string',
        format: 'СООТВЕТСТВИЕ НАИМЕНОВАНИЯ СПРАВОЧНИКУ МЕДИЦИНСКИХ ОРГАНИЗАЦИЙ'
      },
      { // 2
        title: 'OID медорганизации',
        description: 'OID медицинской организациии в системе ЕГИСЗ',
        type: 'string',
        format: 'СООТВЕТСТВИЕ OID СПРАВОЧНИКУ МЕДИЦИНСКИХ ОРГАНИЗАЦИЙ'
      },
      { // 3
        title: 'ИНН',
        description: 'ИНН медицинской организации',
        examples: ['4821011419'],
        type: 'string',
        pattern: '[0-9]{10}'
      },
      { // 4
        title: 'КПП',
        description: 'КПП медицинской организации',
        examples: ['482101001'],
        type: 'string',
        pattern: '[0-9]{9}'
      },
      { // 5
        title: 'Подразделение',
        description: 'Наименование подразделения (отделения) медицинской организации',
        format: 'СООТВЕТСТВИЕ НАИМЕНОВАНИЯ СПРАВОЧНИКУ ПОДРАЗДЕЛЕНИЯ М.О.',
        type: 'string'
      },
      { // 6
        title: 'OID подразделения',
        description: 'OID подразделения (отделения) медицинской организации',
        format: 'СООТВЕТСТВИЕ OID СПРАВОЧНИКУ ПОДРАЗДЕЛЕНИЯ М.О.',
        type: 'string'
      },
      { // 7
        title: 'Месяц',
        description: 'Месяц формирования отчета',
        examples: ['Январь'],
        type: 'string',
        enum: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
      },
      { // 8
        title: '8 Год',
        description: 'Год формирования отчета',
        format: 'ГОД ПРЕДОСТАВЛЕНИЯ ДАННЫХ'
      },
      { // 9
        title: 'СНИЛС',
        description: 'СНИЛС сотрудника',
        examples: ['04286703865'],
        type: 'string',
        pattern: '[0-9]{11}'
      },
      { // 10
        title: 'Должность',
        description: 'Должность сотрудника',
        type: 'string',
        format: 'СООТВЕТСТВИЕ НАИМЕНОВАНИЯ ДОЛЖНОСТИ СПРАВОЧНОМУ НАИМЕНОВАНИЮ'
      },
      { // 11
        title: 'Ставка',
        description: 'Размер ставки сотрудника',
        examples: [0.5, 1],
        type: 'number'
      },
      { // 12
        title: 'Занятость',
        description: 'Условия занятости сотрудника',
        examples: ['Основное', 'Внутреннее совместительство'],
        type: 'string',
        enum: ['Основное', 'Внутреннее совместительство', 'Внешнее совместительство']
      },
      { // 13
        title: 'Номер договора',
        description: 'Номер трудового договора',
        type: 'string',
        pattern: '^.+$'
      },
      { // 14
        title: 'Дата договора',
        description: 'Дата трудового договора',
        format: 'date'
      },
      { // 15
        title: 'Табельный номер',
        description: 'Табельный номер сотрудника',
        type: 'string',
        pattern: '^.+$'
      },
      { // 16
        title: 'Источник финасирования',
        description: 'Источник финансирования сотрудника',
        type: 'string',
        format: 'СООТВЕТСТВИЕ НАИМЕНОВАНИЯ ИСТОЧНИКА ФИНАНСИРОВАНИЯ НА ОТЧЕТНЫЙ ПЕРИОД'
      },
      { // 17
        title: 'Продолжительность рабочего времени',
        description: 'Продолжительность рабочего времени в неделю (часы)',
        format: 'ЧИСЛО'
      },
      { // 18
        title: 'Норма рабочего времени',
        description: 'Норма рабочего времени (часы)',
        type: 'number',
        default: 0
      },
      { // 19
        title: 'Фактическое отработанное время',
        description: 'Фактическое количество отработанного времени (часы)',
        type: 'number',
        default: 0
      },
      { // 20
        title: 'Фактическое отработанное время по COVID-19',
        description: 'Фактическое количество отработанного времени  для начисления выплат за оказание помощи, участвующим в оказании помощи больным Covid-19 ( часы )',
        type: 'number',
        default: 0
      },
      { // 21
        title: 'Фактическое отработанное время по ПП РФ 415',
        description: 'Фактическое количество отработанного времени  для начисления выплат по ПП РФ 415 (часы)',
        type: 'number',
        default: 0
      },
      { // 22
        title: 'Фактическое отработанное время по ПП РФ 484',
        description: 'Фактическое количество отработанного времени для начисления выплат по ПП РФ 484 (часы)',
        type: 'number',
        default: 0
      },
      { // 23
        title: 'Должностной оклад',
        description: 'Должностной оклад',
        type: 'number',
        default: 0
      },
      { // 24
        type: 'number',
        default: 0
      },
      { // 25
        type: 'number',
        default: 0
      },
      { // 26
        type: 'number',
        default: 0
      },
      { // 27
        type: 'number',
        default: 0
      },
      { // 28
        type: 'number',
        default: 0
      },
      { // 29
        type: 'number',
        default: 0
      },
      { // 30
        type: 'number',
        default: 0
      },
      { // 31
        type: 'number',
        default: 0
      },
      { // 32
        type: 'number',
        default: 0
      },
      { // 33
        type: 'number',
        default: 0
      },
      { // 34
        type: 'number',
        default: 0
      },
      { // 35
        type: 'number',
        default: 0
      },
      { // 36
        type: 'number',
        default: 0
      },
      { // 37
        type: 'number',
        default: 0
      },
      { // 38
        type: 'number',
        default: 0
      },
      { // 39
        type: 'number',
        default: 0
      },
      { // 40
        type: 'number',
        default: 0
      },
      { // 41
        type: 'number',
        default: 0
      },
      { // 42
        type: 'number',
        default: 0
      },
      { // 43
        type: 'number',
        default: 0
      },
      { // 44
        type: 'number',
        default: 0
      },
      { // 45
        type: 'number',
        default: 0
      },
      { // 46
        type: 'number',
        default: 0
      },
      { // 47
        type: 'number',
        default: 0
      },
      { // 48
        type: 'number',
        default: 0
      },
      { // 49
        type: 'number',
        default: 0
      },
      { // 50
        type: 'number',
        default: 0
      },
      { // 51
        type: 'number',
        default: 0
      },
      { // 52
        type: 'number',
        default: 0
      },
      { // 53
        type: 'number',
        default: 0
      },
      { // 54
        type: 'number',
        default: 0
      },
      { // 55
        type: 'number',
        default: 0
      },
      { // 56
        type: 'number',
        default: 0
      },
      { // 57
        type: 'number',
        default: 0
      },
      { // 58
        type: 'number',
        default: 0
      },
      { // 59
        type: 'number',
        default: 0
      },
      { // 60
        type: 'number',
        default: 0
      },
      { // 61
        type: 'number',
        default: 0
      },
      { // 62
        type: 'number',
        default: 0
      },
      { // 63
        type: 'number',
        default: 0
      },
      { // 64
        type: 'number',
        default: 0
      }
    ]
  }
}
const getTitle = col => SCHEMA.items.items[col].title || 'Отсутсвует заголовок'
const getDescription = col => SCHEMA.items.items[col].description || 'Отсутсвует описание'

async function main () {
  const start = new Date().getTime()
  const params = { period: PERIOD }
  await dict(params)
  // Проверка загрузки справочника источники финансирования
  // console.log('!!!',finName)
  // console.log('!!!', posName)

  const rawData = await readFile(FILE_XLS)
  const x = xlsx.read(rawData, { type: 'buffer' })
  // console.log(x)
  
  // Проверим наличие в файле Листа = Таблица 1
  if (typeof x.Sheets['Таблица 1'] === 'undefined' ){
    throw new Error('Наименование Лист="Таблица 1" - отсутствует в загружаемом файле')
  }

  const ws = x.SheetNames.includes('Таблица 1') ? x.Sheets['Таблица 1'] : x.Sheets[x.SheetNames[0]]

  console.log(ws['!ref'])
  let r = ws['!ref'].split(':')
  // Если диапазон данных подорительно велик - перепроверим его и установим полученный при расчете
  let iRow = 0; 
  let pZ = {}; 
  let mCell ='A'
  if( /[\d]+/.exec(r[1]) > 500000) {
    for( let z in ws) {
      // console.log(z,ws[z])
      // Анализ первых 10 строк для выяснения max значения Cell
      if( z[0] === 'A' && !isNaN(z[1]) && iRow < 10) {
        // console.log('Новая строка =',z.slice(1))
        let aCell = /[^\d]+/.exec(pZ) // BM17 -> BM Пребыдущая ячейка
        // console.log('Пребыдущая ячейка =',aCell[0])
        // Определим МАХ значение заполненной колонки на основании первых 10 строк
        if( aCell[0].slice(0,1) !== '!' ) {
          mCell = (mCell < aCell[0]) ? aCell[0] : mCell
          iRow++
        }
      }
      // Определим крайнюю ячейку (перед выходом из цикла)
      pZ = (z[0] !== '!') ? z : pZ 
    }
    // Установим значение диапазона данных
    ws['!ref'] = 'A1:' + pZ 
  }
  console.log('END',pZ,ws[pZ])
  
  let dataJson = xlsx.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '', rawNumbers: true })
  let startData = 0
  console.log('dataJson.length',dataJson.length)
  for (let i = 0; i < dataJson.length; i++) {
    if (startData === dataJson.length - 2) break
    const firstRow = dataJson[startData]
    const nextRow = dataJson[startData + 1]
    const overRow = dataJson[startData + 2]
    if (firstRow[0] && nextRow[0] && overRow[0] && firstRow[0] === nextRow[0] && nextRow[0] === overRow[0]) break
    startData += 1
  }
  dataJson = dataJson.slice(startData).map(el => el.map(fl => typeof fl === 'string' ? fl.trim() : fl))
  const validate = ajv.compile(SCHEMA)
  const isValid = validate(dataJson)
  if (!isValid) {
    const errors = validate.errors.map(el => {
      const [_, row, col] = el.instancePath.split('/')
      return {
        row,
        col,
        title: getTitle(col),
        description: getDescription(col),
        message: el.message,
        errorData: dataJson[row][col]
      }
    })
    console.log('errors', errors)
  }
  const end = new Date().getTime()
  const duration = end - start
  console.log('Время валидации данных из файла xlsx = ', duration, 'mc')
}
main()
