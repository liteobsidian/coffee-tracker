const xlsx = require('xlsx')
const { promisify } = require('util')
const fs = require('fs')
const readFile = promisify(fs.readFile)
const Ajv = require('ajv')
const ajv = new Ajv({ strict: false, allErrors: true, useDefaults: 'empty', coerceTypes: true })

const organization = [
  'Государственное учреждение здравоохранения"Елецкая городская больница №2"'
]
const isOrganizationName = (x) => { return organization.includes(x) }
ajv.addFormat('СООТВЕТСТВИЕ НАИМЕНОВАНИЯ СПРАВОЧНИКУ МЕДИЦИНСКИХ ОРГАНИЗАЦИЙ', (x) => { return isOrganizationName(x) })

const oidMo = [
  '1.2.643.5.1.13.13.12.2.48.4512'
]
const isOrganizationOid = (x) => { return oidMo.includes(x) }
ajv.addFormat('СООТВЕТСТВИЕ OID СПРАВОЧНИКУ МЕДИЦИНСКИХ ОРГАНИЗАЦИЙ', (x) => { return isOrganizationOid(x) })

const divisionNmae = [
  'СТАЦИОНАР',
  'Хирургическое отделение',
  'ПОЛИКЛИНИКА',
  'Отделение анестезиологии и реанимации',
  'Дневной стационар',
  'Женская консультация',
  'Центр здоровья',
  'Отделение функциональной диагностики',
  'Бактериологическая лаборатория',
  'Клинико-диагностическая лаборатория',
  'Центр амбулаторной онкологической помощи',
  'Лучевая диагностика',
  'Терапевтическое отделение',
  'Оториноларингологическое отделение',
  'Неврологическое отделение',
  'Кардиологическое отделение'
]
const isDivisionName = (x) => { return divisionNmae.includes(x) }
ajv.addFormat('СООТВЕТСТВИЕ НАИМЕНОВАНИЯ СПРАВОЧНИКУ ПОДРАЗДЕЛЕНИЯ М.О.', (x) => { return isDivisionName(x) })

const divisionOid = [
  '1.2.643.5.1.13.13.12.2.48.4512.0.361124',
  '1.2.643.5.1.13.13.12.2.48.4512.0.361157',
  '1.2.643.5.1.13.13.12.2.48.4512.0.361118',
  '1.2.643.5.1.13.13.12.2.48.4512.0.361154',
  '1.2.643.5.1.13.13.12.2.48.4512.0.355416',
  '1.2.643.5.1.13.13.12.2.48.4512.0.359970',
  '1.2.643.5.1.13.13.12.2.48.4512.0.356759',
  '1.2.643.5.1.13.13.12.2.48.4512.0.360729',
  '1.2.643.5.1.13.13.12.2.48.4512.0.360728',
  '1.2.643.5.1.13.13.12.2.48.4512.0.410218',
  '1.2.643.5.1.13.13.12.2.48.4512.0.410222',
  '1.2.643.5.1.13.13.12.2.48.4512.0.359473',
  '1.2.643.5.1.13.13.12.2.48.4512.0.410216',
  '1.2.643.5.1.13.13.12.2.48.4512.0.410221',
  '1.2.643.5.1.13.13.12.2.48.4512.0.368902',
  '1.2.643.5.1.13.13.12.2.48.4512.0.361142',
  '1.2.643.5.1.13.13.12.2.48.4512.0.361104'

]
const isDivisionOid = (x) => { return divisionOid.includes(x) }
ajv.addFormat('СООТВЕТСТВИЕ OID СПРАВОЧНИКУ ПОДРАЗДЕЛЕНИЯ М.О.', (x) => { return isDivisionOid(x) })

// const writeFIle = promisify(fs.writeFile)
const FILE_XLS = './test.xlsx'
// const FILE_JSON = './test.json'

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
        title: 'Год',
        description: 'Год формирования отчета',
        examples: ['2020'],
        type: 'string',
        enum: ['2020', '2021', '2022']
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
        examples: ['медицинская сестра диетическая'],
        type: 'string'
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
        type: 'string',
        pattern: '^[0-3][0-9]\\.[0-1][0-9]\\.[12][09][789012][0-9]'
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
        enum: ['ОМС', 'Средства от платных мед услуг', 'Иные средства от приносящих доход деятельности']
      },
      { // 17
        title: 'Продолжительность рабочего времени',
        description: 'Продолжительность рабочего времени в неделю (часы)',
        type: 'number',
        default: 0
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
}

// async function next() {
//   try{

//   }catch(err){
//     console.log(err)
//   }
// }
main()
