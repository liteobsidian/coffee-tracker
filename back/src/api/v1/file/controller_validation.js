'use strict'
// import log from '@log'
import { parse, isValid, differenceInYears, differenceInMonths } from 'date-fns'
import { listName as OrgListName, listOid as OrgListOid, listObj as OrglistObj, listObjPeriod as OrglistObjPeriod, listNamePeriod as OrgListNamePeriod } from '../organization/db'
import { listName as PositionListName } from '../position/db'
import { listName as DivListName, listOid as DivListOid, listObj as DivlistObj, listObjPeriod as DivlistObjPeriod, listNamePeriod as DivListNamePeriod } from '../division/db'
import { listActive as FinanceListName } from '../finance_source/db'
import { schemaDB as SchemaDB } from '../template/db'
import { SCHEMA_DEFAULT } from './schema_default.js'
import { SCHEMA_FORMAT_NAME as SFN } from './schema_format_name.js'
import { verifySnils } from '../../../utils'
import Ajv from 'ajv'
import localize_ru from 'ajv-i18n/localize/ru'

import MD5 from 'crypto-js/md5'

function rusMonth (datePeriod) {
  const monthes = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
  const d = parse(datePeriod, 'yyyy-MM-dd', new Date())
  return monthes[d.getMonth()]
}

const ajv = new Ajv({ strict: false, allErrors: true, useDefaults: 'empty', coerceTypes: true })

let orgObj = []
let divObj = []
let orgName = []
let orgOid = []
let divName = []
let divOid = []
let finName = []
let posName = []
let schema = {}
let PERIOD = ''

// Загрузка массивов эталонных справочников
const dict = async (data) => {
  try {
    const { period } = data
    orgObj = await OrglistObjPeriod(period)
    // Если справочник за отчетный период не загружен - используем последние актуальные значения
    if (orgObj.length === 0) {
      orgObj = await OrglistObj()
    }

    divObj = await DivlistObjPeriod(period)
    // Если справочник за отчетный период не загружен - используем последние актуальные значения
    if (orgObj.length === 0) {
      divObj = await DivlistObj()
    }

    orgName = await OrgListNamePeriod(period)
    // console.log(period, orgName)
    // Если справочник за отчетный период не загружен - используем последние актуальные значения
    if (orgName.length === 0) {
      orgName = await OrgListName()
    }

    orgOid = await OrgListOid()

    divName = await DivListNamePeriod(period)
    // console.log(period, divName)
    // Если справочник за отчетный период не загружен - используем последние актуальные значения
    if (divName.length === 0) {
      divName = await DivListName()
    }
    divOid = await DivListOid()
    finName = await FinanceListName(data)
    posName = await PositionListName()
    schema = await SchemaDB(data)
    // Если БД вернет пустую схему, использовать схему валидации определенную по умолчанию
    if (Object.keys(schema).length === 0 || schema === null) {
      schema = SCHEMA_DEFAULT
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

const isOrganizationName = x => orgName.includes(x)
ajv.addFormat(SFN.isOrganizationName, x => isOrganizationName(x))

const isOrganizationOid = x => orgOid.includes(x)
ajv.addFormat(SFN.isOrganizationOid, x => isOrganizationOid(x))

const isDivisionName = x => divName.includes(x)
ajv.addFormat(SFN.isDivisionName, x => isDivisionName(x))

const isDivisionOid = x => divOid.includes(x)
ajv.addFormat(SFN.isDivisionOid, x => isDivisionOid(x))

const isFinanceNameActive = x => finName.includes(x)
ajv.addFormat(SFN.isFinanceNameActive, x => isFinanceNameActive(x))

const isPositionName = x => posName.includes(x.toLowerCase())
ajv.addFormat(SFN.isPositionName, x => isPositionName(x))

ajv.addFormat('date', { validate: x => isValid(parse(x, 'dd.MM.yyyy', new Date())) })

const isYearData = x => PERIOD.substr(0, 4) === x
ajv.addFormat(SFN.isYearData, x => isYearData(x))

function checkNumber (x) {
  const n = parseFloat(x)
  return !Number.isNaN(n)
}
// Чтобы было
ajv.addFormat(SFN.checkNumber, { validate: x => checkNumber(x) })

// const chkSnils = x => verifySnils(x)
ajv.addFormat(SFN.checkSnils, x => verifySnils(x))

const getTitle = (SCHEMA, col) => SCHEMA.items.items[col].title || 'Отсутсвует заголовок'
const getDescription = (SCHEMA, col) => SCHEMA.items.items[col].description || 'Отсутсвует описание'

// Функция валидации данных
export const validationData = async ({ count_row_header: countRowHeader = 0, period, type_report, data_json: dataJson, organization, file_name, user_id }) => {
  try {
    const start = new Date().getTime()
    PERIOD = period
    const params = { period: period, type_report: type_report }
    // Загрузка необходимых справочников
    await dict(params)
    // Проверочный вывод справочников
    // console.log('!!!',finName)
    // console.log('!!!', posName)
    // console.log('!!!',posName)
    // console.log('!!!', JSON.stringify(schema))
    const validate = await ajv.compile(schema)
    const isValid = await validate(dataJson)

    // Костомная проверка именно для отчета по ЗП
    const dublicatePasportError = []
    const relatedOrgFieldError = []
    if (type_report === '1') {
    // Проверка на дубликат паспортной части
    // Паспортной части относятся следующие поля отчета Мониторинг ЗП:
    // 0 Регион
    // 1 Полное наименование МО
    // 2 OID медицинской организации
    // 3 ИНН
    // 4 КПП
    // 5 Подразделение
    // 6 OID структурного подразделения
    // 7 Месяц
    // 8 Год
    // 9 СНИЛС
    // 10 Занимаемая должность
    // 11 Занятая ставка
    // 12 Условия занятости
    // 13 Номер трудового договора
    // 14 Дата трудового договора
    // 15 Табельный номер
    // 16 Источники финансирования.
    // 19 Фактическое количество отработанного времени (часы)
    // 23 Должностной оклад
    // 63 Дополнительные выплаты медицинским и иным работникам за оказание помощи, участие в оказании помощи больным COVID-19
      const mapDublicatPasport = new Map()
      for (let i = 0; i < dataJson.length; i++) {
      // console.log( dataJson[i][0],dataJson[i][1])
        const strData = dataJson[i][0] + ';' + dataJson[i][1] + ';' + dataJson[i][2] + ';' + dataJson[i][3] + ';' + dataJson[i][4] + ';' +
                      dataJson[i][5] + ';' + dataJson[i][6] + ';' + dataJson[i][7] + ';' + dataJson[i][8] + ';' + dataJson[i][9] + ';' +
                      dataJson[i][10] + ';' + dataJson[i][11] + ';' + dataJson[i][12] + ';' + dataJson[i][13] + ';' + dataJson[i][14] + ';' +
                      dataJson[i][15] + ';' + dataJson[i][16]
        const key = MD5(strData).toString()
        if (!mapDublicatPasport.has(key)) {
          mapDublicatPasport.set(key, { cnt: 0, rows: [i + countRowHeader + 1], rw: strData })
        } else {
          const v = mapDublicatPasport.get(key)
          v.cnt = v.cnt + 1
          // console.log('Уже имеется строка v.rows',v.rows)
          const r = v.rows
          const dublicatRow = i + countRowHeader + 1
          r.push(dublicatRow)
          mapDublicatPasport.set(key, { cnt: v.cnt, rows: r, rw: strData })
        }
        // 1 Контроль на смежные ошибки полей по справочнику организаций собираем в массив relatedOrgFieldError
        const dataInn = dataJson[i][3]
        const elOrg = orgObj.find(x => x.inn === dataInn)
        if (elOrg !== undefined) {
          // Проверим соответствие смежного поля Наименование на равенство найденному из справочника
          if (elOrg.name !== dataJson[i][1]) {
            // console.log('elOrg.name',elOrg.name)
            // console.log('dataJson[i][1]', dataJson[i][1])
            relatedOrgFieldError.push({
              row: i + countRowHeader + 1,
              col: '',
              title: 'Полное наименование МО',
              description: 'Не соответствие справочнику',
              message: '',
              errorData: strData
            })
          }
          // Проверим соответствие смежного поля OID в списке соответствующей организации из справочника
          if (!elOrg.oid.includes(dataJson[i][2])) {
            relatedOrgFieldError.push({
              row: i + countRowHeader + 1,
              col: '',
              title: 'OID',
              description: 'Не соответствие справочнику',
              message: '',
              errorData: strData
            })
          }
          // Проверим соответствие смежного поля ИНН на равенство найденному из справочника
          if (elOrg.inn !== dataJson[i][3]) {
            relatedOrgFieldError.push({
              row: i + countRowHeader + 1,
              col: '',
              title: 'ИНН',
              description: 'Не соответствие справочнику',
              message: '',
              errorData: strData
            })
          }
          // Проверим соответствие смежного поля КПП на равенство найденному из справочника
          // Мое Личное замецание КПП должно принадледать подразделению если это филиал,а в эталонных справочников поле отсутствует
          if (elOrg.kpp !== dataJson[i][4]) {
            relatedOrgFieldError.push({
              row: i + countRowHeader + 1,
              col: '',
              title: 'КПП',
              description: 'Не соответствие справочнику',
              message: '',
              errorData: strData
            })
          }
        } else {
          relatedOrgFieldError.push({
            row: i + countRowHeader + 1,
            col: '',
            title: 'ИНН',
            description: 'Проверка ИНН по справочнику организаций',
            message: '',
            errorData: strData
          })
        } // End Контроль на смежные ошибки по справочнику организаций
        // 2 Контроль на смежные ошибки полей по справочнику подразделений собираем в массив relatedOrgFieldError
        const dataDivOid = dataJson[i][6]
        const elDiv = divObj.find(x => (x.org === elOrg.id && x.oid === dataDivOid))
        if (elDiv !== undefined) {
          // Проверим соответствие смежного поля Подразделение (имя) на равенство найденному из справочника
          if (elDiv.name !== dataJson[i][5]) {
            relatedOrgFieldError.push({
              row: i + countRowHeader + 1,
              col: '',
              title: 'Подразделение',
              description: 'Не соответствие справочнику',
              message: 'Наименование подразделения не соответствует OID подразделения',
              errorData: strData
            })
          }
        } else {
          relatedOrgFieldError.push({
            row: i + countRowHeader + 1,
            col: '',
            title: 'OID структурного подразделения',
            description: 'Не соответствие справочнику',
            message: '',
            errorData: strData
          })
        } // End Контроль на смежные ошибки по справочнику подразделений
        // 3 Контроль Фактическое количество отработанного времени (часы) - Должностному окладу собираем в массив relatedOrgFieldError
        if (dataJson[i][19] === 0 && dataJson[i][23] > 0) {
          relatedOrgFieldError.push({
            row: i + countRowHeader + 1,
            col: '',
            title: 'Должностной оклад',
            description: 'Указан ДО при отсутствии ФОВ',
            message: '',
            errorData: `Должностной оклад = ${dataJson[i][23]} ФОВ = ${dataJson[i][19]}`
          })
        }
        // 4 Контроль Дата трудового договора - из будущего
        const dateFromData = parse(dataJson[i][14], 'dd.MM.yyyy', new Date())
        const dateFromPERIOD = parse(PERIOD, 'yyyy-MM-dd', new Date())
        const difYear = differenceInYears(dateFromPERIOD, dateFromData)
        const diffMonth = differenceInMonths(dateFromPERIOD, dateFromData)
        if (isNaN(difYear) || isNaN(diffMonth)) {
          relatedOrgFieldError.push({
            row: i + countRowHeader + 1,
            col: '',
            title: 'Дата трудового договора',
            description: 'Неверный формат даты ТД',
            message: '',
            errorData: `${dataJson[i][14]}`
          })
        }
        if (diffMonth < 0) {
          relatedOrgFieldError.push({
            row: i + countRowHeader + 1,
            col: '',
            title: 'Дата трудового договора',
            description: 'Указана дата ТД из будущего',
            message: '',
            errorData: ` = ${dataJson[i][14]}`
          })
        }
        if (dateFromData.getFullYear() < 1954) {
          relatedOrgFieldError.push({
            row: i + countRowHeader + 1,
            col: '',
            title: 'Дата трудового договора',
            description: 'Указана дата ТД ранее 1954 года',
            message: '',
            errorData: ` = ${dataJson[i][14]}`
          })
        }
        // 5 Контроль соответствия Источника финансирования ..за работу с COVID-19 - установленному значению начисления
        const isCovid = dataJson[i][16].includes('COVID')
        const sumCovid = dataJson[i][63]
        if (!isCovid && sumCovid) {
          relatedOrgFieldError.push({
            row: i + countRowHeader + 1,
            col: '',
            title: 'Источники финансирования',
            description: 'Ошибочное указание источника финансирования СВ за работу с Covid-19',
            message: `Проверьте соответствие И.Ф. установленой сумме начислений ${sumCovid}`,
            errorData: `${dataJson[i][16]}`
          })
        }
        // 6 Контроль Месяца - периоду загрузки
        const isMonth = (rusMonth(PERIOD) === dataJson[i][7]) // 2021-03-01 Март
        if (!isMonth) {
          relatedOrgFieldError.push({
            row: i + countRowHeader + 1,
            col: '',
            title: 'Месяц',
            description: `Ошибочное соответствие выбранного периода в КВАЗАР.СТАТИСТИКА ${PERIOD} указанному значению месяца ${dataJson[i][7]}`,
            message: `Проверьте правильность указания Месяца в данных на загрузку ${dataJson[i][7]}`,
            errorData: `${dataJson[i][7]}`
          })
        }
        // 7 Контроль указанного ГОДА  String - не трогать!!!
        const isYr = (String(PERIOD).substring(0, 4) === String(dataJson[i][8])) // 2021-03-01 2021
        if (!isYr) {
          relatedOrgFieldError.push({
            row: i + countRowHeader + 1,
            col: '',
            title: 'Год',
            description: `Ошибочное соответствие выбранного периода в КВАЗАР.СТАТИСТИКА ${PERIOD} указанному значению Год ${dataJson[i][8]}`,
            message: `Проверьте правильность указания Года в данных на загрузку ${dataJson[i][8]}`,
            errorData: `${dataJson[i][8]}`
          })
        }
      } // for dataJson
      // Соберем ошибки по выявленным дубликатам в один массив
      mapDublicatPasport.forEach((v, _) => {
        if (v.cnt > 0) {
        // console.log(v.cnt, v.rows, v.rw)
          dublicatePasportError.push({
            row: v.rows.join(' ;'),
            col: '',
            title: 'Дубликат',
            description: 'Проверка на дубликат паспортной части',
            message: '',
            errorData: v.rw
          })
        }
      })
    }
    // Конец проверки на дубликат паспортной части
    let errors = []
    if (!isValid) {
      localize_ru(validate.errors)
      errors = validate.errors.map(el => {
        const [, row, col] = el.instancePath.split('/')
        return {
          row: String((parseInt(row) + countRowHeader + 1)),
          col,
          title: getTitle(schema, col),
          description: getDescription(schema, col),
          message: el.message,
          errorData: dataJson[row][col]
        }
      })
      // console.log('errors', errors)
    }
    const end = new Date().getTime()
    const duration = end - start
    console.log(`Пользователь ${user_id}; Организаця ${organization}; Загрузка файла ${file_name}; Время валидации данных ${duration} mc`)
    return [...errors, ...dublicatePasportError, ...relatedOrgFieldError]
  } catch (err) {
    // log.error(err)
    return Promise.reject(err)
  }
}
