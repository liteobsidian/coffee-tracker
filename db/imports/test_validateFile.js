const xlsx = require('xlsx')
const { promisify } = require('util')
const fs = require('fs')
const readFile = promisify(fs.readFile)
const Ajv = require('ajv')
const ajv = new Ajv({ strict: false, allErrors: true, useDefault: 'empty' })

// const writeFIle = promisify(fs.writeFile)
const FILE_XLS = './test.xlsx'
// const FILE_JSON = './test.json'
const SCHEMA = {
  type: 'array',
  items: {
    type: 'array',
    items: [
      { // 1
        title: 'Область',
        description: 'наименование области к которой относится медицинская организация',
        examples: ['Липецкая область'],
        type: 'string',
        const: 'Липецкая область'
      },
      { // 2
        title: 'Наименование медицинской организации',
        description: 'Полное официальное наименование медицинской органиазции',
        type: 'string'
      },
      { // 3
        title: 'OID медорганизации',
        description: 'OID медицинской организациии в системе ЕГИСЗ',
        examples: ['1.2.643.5.1.13.13.12.2.48.4512'],
        type: 'string',
        pattern: '^1.2.643.5.1.13.13.12.2.48.[0-9]{4}$'
      },
      { // 4
        title: 'ИНН',
        description: 'ИНН медицинской организации',
        examples: ['4821011419'],
        type: 'string',
        pattern: '[0-9]{10}'
      },
      { // 5
        title: 'КПП',
        description: 'КПП медицинской организации',
        examples: ['482101001'],
        type: 'string',
        pattern: '[0-9]{9}'
      },
      { // 6
        title: 'Подразделение',
        description: 'Наименование подразделения (отделения) медицинской организации',
        examples: ['СТАЦИОНАР'],
        type: 'string'
      },
      { // 7
        title: 'OID подразделения',
        description: 'OID подразделения (отделения) медицинской организации',
        examples: ['1.2.643.5.1.13.13.12.2.48.4512.0.359473'],
        type: 'string'
      },
      { // 8
        title: 'Месяц',
        description: 'Месяц формирования отчета',
        examples: ['Январь'],
        type: 'string',
        enum: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
      },
      { // 9
        title: 'Год',
        description: 'Год формирования отчета',
        examples: ['2020'],
        type: 'string',
        enum: ['2020', '2021', '2022']
      },
      { // 10
        title: 'СНИЛС',
        description: 'СНИЛС сотрудника',
        examples: ['04286703865'],
        type: 'string',
        pattern: '[0-9]{11}'
      },
      { // 11
        title: 'Должность',
        description: 'Должность сотрудника',
        examples: ['медицинская сестра диетическая'],
        type: 'string'
      },
      { // 12
        title: 'Ставка',
        description: 'Размер ставки сотрудника',
        examples: [0.5, 1],
        type: 'string',
        pattern: '^[0-9]+(.[0-9]{1,3})?$'
      },
      { // 13
        title: 'Занятость',
        description: 'Условия занятости сотрудника',
        examples: ['Основное', 'Внутреннее совместительство'],
        type: 'string',
        enum: ['Основное', 'Внутреннее совместительство', 'Внешнее совместительство']
      },
      { // 14
        title: 'Номер договора',
        description: 'Номер трудового договора',
        type: 'string',
        pattern: '^.+$'
      },
      { // 15
        title: 'Дата договора',
        description: 'Дата трудового договора',
        type: 'string',
        pattern: '^[0-3][0-9]\\.[0-1][0-9]\\.[12][09][789012][0-9]'
      },
      { // 16
        title: 'Табельный номер',
        description: 'Табельный номер сотрудника',
        type: 'string',
        pattern: '^.+$'
      },
      { // 17
        title: 'Источник финасирования',
        description: 'Источник финансирования сотрудника',
        type: 'string',
        enum: ['ОМС', 'Средства от платных мед услуг', 'Иные средства от приносящих доход деятельности']
      },
      { // 18
        title: 'Продолжительность рабочего времени',
        description: 'Продолжительность рабочего времени в неделю (часы)',
        type: 'string',
        pattern: '^\\d{1,2}\\.\\d{2}$'
      },
      { // 19
        title: 'Норма рабочего времени',
        description: 'Норма рабочего времени (часы)',
        type: 'string',
        pattern: '^\\d{1,3}\\.\\d{2}$'
      },
      { // 20
        title: 'Фактическое отработанное время',
        description: 'Фактическое количество отработанного времени (часы)',
        type: 'string',
        pattern: '^\\d{1,3}\\.\\d{2}$'
      },
      { // 21
        title: 'Фактическое отработанное время по COVID-19',
        description: 'Фактическое количество отработанного времени  для начисления выплат за оказание помощи, участвующим в оказании помощи больным Covid-19 ( часы )',
        type: 'string',
        pattern: '^\\d{1,3}\\.\\d{2}$',
        default: '0.00'
      },
      { // 22
        title: 'Фактическое отработанное время по ПП РФ 415',
        description: 'Фактическое количество отработанного времени  для начисления выплат по ПП РФ 415 (часы)',
        type: 'string',
        pattern: '^\\d{1,3}\\.\\d{2}$',
        default: '0.00'
      },
      { // 23
        title: 'Фактическое отработанное время по ПП РФ 484',
        description: 'Фактическое количество отработанного времени для начисления выплат по ПП РФ 484 (часы)',
        type: 'string',
        pattern: '^\\d{1,3}\\.\\d{2}$',
        default: '0.00'
      },
      { // 24
        title: 'Должностной оклад',
        description: 'Должностной оклад',
        type: 'string',
        pattern: '^\\d{3,6}\\.\\d{2}',
        default: '0.00'
      },
      { // 25
        type: 'string'
      },
      { // 26
        type: 'string'
      },
      { // 27
        type: 'string'
      },
      { // 28
        type: 'string'
      },
      { // 29
        type: 'string'
      },
      { // 30
        type: 'string'
      },
      { // 31
        type: 'string'
      },
      { // 32
        type: 'string'
      },
      { // 33
        type: 'string'
      },
      { // 34
        type: 'string'
      },
      { // 35
        type: 'string'
      },
      { // 36
        type: 'string'
      },
      { // 37
        type: 'string'
      },
      { // 38
        type: 'string'
      },
      { // 39
        type: 'string'
      },
      { // 40
        type: 'string'
      },
      { // 41
        type: 'string'
      },
      { // 42
        type: 'string'
      },
      { // 43
        type: 'string'
      },
      { // 44
        type: 'string'
      },
      { // 45
        type: 'string'
      },
      { // 46
        type: 'string'
      },
      { // 47
        type: 'string'
      },
      { // 48
        type: 'string'
      },
      { // 49
        type: 'string'
      },
      { // 50
        type: 'string'
      },
      { // 51
        type: 'string'
      },
      { // 52
        type: 'string'
      },
      { // 53
        type: 'string'
      },
      { // 54
        type: 'string'
      },
      { // 55
        type: 'string'
      },
      { // 56
        type: 'string'
      },
      { // 57
        type: 'string'
      },
      { // 58
        type: 'string'
      },
      { // 59
        type: 'string'
      },
      { // 60
        type: 'string'
      },
      { // 61
        type: 'string'
      },
      { // 62
        type: 'string'
      },
      { // 63
        type: 'string'
      },
      { // 64
        type: 'string'
      },
      { // 65
        type: 'string'
      }
    ]
  }
}

async function main () {
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
  const validate = ajv.compile(SCHEMA)
  const isValid = validate(dataJson)
  if (!isValid) {
    const errors = validate.errors.map(el => {
      const [_, row, col] = el.instancePath.split('/')
      return { row, col, message: el.message, errorData: dataJson[row][col] }
    })
    console.log(errors)
  }
}

async function next () {
  try{

  }catch(err)
 console.log(JSON.stringify(main()))
}
