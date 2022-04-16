'use strict'
import fs from 'fs'
import path from 'path'
import xlsx from 'xlsx'
import { createXlsxFile } from '../../../local_excel_report'
import { format } from 'date-fns'
import { promisify } from 'util'
import { validationData } from './controller_validation'
import { findById as findTypeReportById } from '../type/db'
import log from '@log'
import axios from 'axios'
import {
  uploadDB,
  listDB,
  deleteFileDB,
  addDataDB,
  protocolDB,
  setStatusHandleDB,
  findByUuidDB,
  findByUuidAndShemaDB
} from './db'
import { REPORT_URL, REPORT_API, PATH_UPLOADS } from '../../../config' // PATH_TEMPLATE

const MAXBODY = 200000000

const reducer = (acc, cur) => acc + cur

const readFile = promisify(fs.readFile)

export const list = async data => listDB(data)

export const deleteFile = async data => deleteFileDB(data)

export const setStatusHandle = async data => setStatusHandleDB(data)

export const findByUuid = async data => findByUuidDB(data)

const validationXLSX = async data => {
  const { messageOperation, userId, userName, organization, fileId, fileName, filePath, period, type_report, uuid } = data
  try {
    const rawData = await readFile(filePath)
    const x = xlsx.read(rawData, { type: 'buffer' })
    const ws = x.SheetNames.includes('Таблица 1') ? x.Sheets['Таблица 1'] : x.Sheets[x.SheetNames[0]]
    /// Если диапазон данных подозрительно велик >500тыс - перепроверим его и установим фактический
    const r = ws['!ref'].split(':')
    console.log(`Исполнитель ${userName}; ${messageOperation} данных файла от пользователя ${userId}; Организаця ${organization}; Загрузка файла ${fileName}; Выявлено установленное на листе значение диапазона области данных !ref = ${ws['!ref']}`)
    let pZ = {} // указател на ячейку данных по циклу чтения
    if (/[\d]+/.exec(r[1]) > 500000) {
      console.log(`Исполнитель ${userName}; ${messageOperation} данных файла от пользователя ${userId}; Организаця ${organization}; Загрузка файла ${fileName}; ПРОВЕРКА ФАКТИЧЕСКОГО КОЛИЧЕСТВА СТРОК НА РАБОЧЕМ ЛИСТЕ (т.к. значение  > 500000 в области данных !ref = ${ws['!ref']} )`)
      for (const z in ws) {
      // Определим крайнюю ячейку
        pZ = (z[0] !== '!') ? z : pZ
      }
      // Установим выявленное значение диапазона данных
      ws['!ref'] = 'A1:' + pZ
      console.log(`Исполнитель ${userName}; ${messageOperation} данных файла от пользователя ${userId}; Организаця ${organization}; Загрузка файла ${fileName}; Исправлено значение области данных !ref = ${'A1:' + pZ}`)
    }
    // console.log('END', pZ, ws[pZ])
    // ////////////
    const dataJson = xlsx.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '', rawNumbers: true })
    // Индекс первого элемента массива с данными
    let startData = 0
    let endData = 0
    // Найти индекс первого элемента массива с данными
    for (let i = 0; i < dataJson.length; i++) {
      if (startData === dataJson.length - 2) break
      const firstRow = dataJson[startData]
      const nextRow = dataJson[startData + 1]
      const overRow = dataJson[startData + 2]
      if (firstRow[0] && nextRow[0] && overRow[0] && firstRow[0] === nextRow[0] && nextRow[0] === overRow[0]) break
      startData += 1
    }
    endData = startData
    // Найти индекс последней не пустой строки массива с данными
    for (let i = startData; i < dataJson.length; i++) {
      endData = i
      if (i > 10 && dataJson[i].reduce(reducer) === '') break
    }
    // !!! ВАЖНО. Отрезать строки с шапкой таблици и хвост с пустыми значениями
    let dataJsonRows = dataJson.splice(startData, endData - startData)
    // console.log('dataJsonRows',dataJsonRows[dataJsonRows.length - 1])
    // почистить пробелы у строковых полей
    dataJsonRows = await dataJsonRows.map(el => el.map(fl => typeof fl === 'string' ? fl.trim() : fl))
    // расчет валидации
    const protocolErrorsJson = await validationData({ count_row_header: startData, period: period, type_report: type_report, data_json: dataJsonRows, organization: data.organization, file_name: fileName, user_id: userId })
    // Записать массив данных и протокол валидации в БД
    if (dataJsonRows.length) {
      await addDataDB(fileId, dataJsonRows, protocolErrorsJson)
    } else {
      throw new Error(`Неудачная попытка чтениия/валидация файла с данными, получен пустой массив [] ;ОБРАТИТЕСЬ В СЛУЖБУ ПОДДЕРЖКИ РАБОТЫ СИСТЕМЫ С УКАЗАНИЕМ ПРОБЛЕМНОГО UUID файла=${uuid}; ПРОВЕРИТЬ ФАЙЛ В ХРОНИЛИЩЕ СИСТЕМЫ ${filePath} НА ЕГО НАЛИЧИЕ ИЛИ КОРРЕКТНОСТЬ ЕГО СТРУКТУРЫ`)
    }
  } catch (err) {
    const msg = `Внимание - файла ${uuid} не сохранен в системе`
    log.error(err)
    log.error(msg)
    err.message = msg + ' ' + err.message
    return Promise.reject(err)
  }
}

export const upload = async data => {
  const messageOperation = 'Загрузка'
  const { period, type: type_report, name: fileName, filePath, userId, userName, organization, uuid } = data
  try {
    // Получить подтверждение о наличии записи о типе отчетности в type_report
    const itemsType = await findTypeReportById({ type_report })
    // console.log(itemsType) //[ { id: '1', name: 'Мониторинг_ЗП' } ]
    if (itemsType.length === 0) { throw new Error('Не верно указано значение id type_report (тип отчетности)') }
    // Создать запись в БД о загруженном файле
    const fileId = await uploadDB(data)
    // throw 'Эмитируем исключение, для отладки'
    await validationXLSX({ messageOperation, userId, userName, organization, fileId, fileName, filePath, period, type_report, uuid })
    return fileId
  } catch (err) {
    // Если при валидации чтото не заладилось - обязательно удаляем запись о файле в БД
    await deleteFile({ uuid })
    const msg = `Внимание - данные файла ${fileName} не записаны в БД, текущая запись о файле УДАЛЕНА ! ПРОВЕРЬТЕ СТРУКТУРУ ФАЙЛА ИЛИ НАЛИЧИЕ НЕ ПУСТЫХ ЗАПИСЕЙ В НЕМ !`
    log.error(err)
    log.error(msg)
    err.message = msg + ' ' + err.message
    return Promise.reject(err)
  }
}

export const loadProtocol = async data => {
  let json = {}
  let jsonData = {}
  const outputFileName = `protocol_${data.uuid}.xlsx`
  const PATH_OUTPUT_FILE_NAME = `${PATH_UPLOADS}/${outputFileName}`
  const localLink = { headers: { filename: path.basename(PATH_OUTPUT_FILE_NAME) }, data: null }
  try {
    let [organization, dataProtocol, createdAt] = await protocolDB(data)
    if (organization === null) throw new Error('Отсутствует информация в БД')
    if (dataProtocol === null) { dataProtocol = [] }
    jsonData = {
      params: [
        {
          key: 'ORGANIZATION',
          value: organization,
          valueType: 'string'
        },
        {
          key: 'DATA_CREATED',
          value: format(new Date(createdAt), 'dd.MM.yyyy HH:mm'),
          valueType: 'string'
        },
        {
          key: 'UUID',
          value: data.uuid,
          valueType: 'string'
        },
        {
          key: 'CURRENT_TIME',
          value: format(new Date(), 'dd.MM.yyyy HH:mm'),
          valueType: 'string'
        }
      ],
      data: dataProtocol
    }
    json = {
      name: 'stat-1_protocol.xlsx',
      tableTag: '<TABLE_NOT_BORDER>',
      tableName: 'PROTOCOL_ERRORS',
      params: jsonData.params,
      data: dataProtocol.map((el, i) => ([
        { value: i + 1, valueType: 'integer' },
        { value: el.row, valueType: 'string' },
        { value: el.col, valueType: 'string' },
        { value: el.title, valueType: 'string' },
        { value: el.description, valueType: 'string' },
        { value: el.message, valueType: 'string' },
        { value: el.errorData, valueType: 'string' }
      ]))
    }
    try {
      /* eslint-disable */
      throw 'Локальное формирование отчета'
      // Запрос на формирование файла сервисом node-excel-reports
      const { data: { data: { link } } } =
       await axios({
         method: 'post',
         baseURL: `http://${REPORT_URL}${REPORT_API}`,
         url: 'xls',
         data: json,
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json'
         }
       })
      const config = {
        method: 'GET',
        url: `http://${REPORT_URL}/${link}`,
        responseType: 'arraybuffer', // не 'blob'
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          Authorization: data.authorization
        },
        maxContentLength: MAXBODY,
        maxBodyLength: MAXBODY
      }
      const linkFileBody = await axios(config)
      return linkFileBody
      /* eslint-enable */
    } catch (err) {
    // !!! Сервис node-excel-report не доступен !!!
    // Формируем локально протокол с ошибками и отдаем файл  xlsx
      const resultCreateFile = await createXlsxFile({ outputFileName, json })
      if (!resultCreateFile) throw new Error('Ошибка формирования xlsx файла!')
      const rawDataProtocol = await readFile(PATH_OUTPUT_FILE_NAME)
      localLink.data = rawDataProtocol
      return localLink
    } // end catch в случе не доступности сервиса node-excel-report
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}

export const revalidation = async data => {
  const messageOperation = 'Перезагрузка'
  const { name: userName, uuid } = data // type: userRole
  try {
    // Получить подтверждение о наличии записи о типе отчетности в type_report
    const itemsfindByUuid = await findByUuidAndShemaDB({ uuid })
    const { id: fileId, path: filePath, name: fileName, period, type_report_id: type_report, organization_id: organization, auth_user_id: userId } = itemsfindByUuid[0]
    // console.log(itemsfindByUuid)
    // [
    //  {
    //   id: '335',
    //   path: 'uploads\\2021-02\\2\\2_60c0fac8-e7a6-4913-9107-6ffbf13d592d.xls',
    //   name: 'Данковская ЦРБ _февраль_2021 (2).xls',
    //   period: '2021-02-01',
    //   type_report_id: '1',
    //   template_file: 'template_v2021_v7.xlsx',
    //   schema_validation: { type: 'array', items: [Object] },
    //   created_at: 2021-05-18T08:24:24.251Z
    // }
    // ]
    if (itemsfindByUuid.length === 0) { throw new Error(`Для uuid=${uuid} не найдена запись в БД`) }
    // throw 'Эмитируем исключение, для отладки'
    await validationXLSX({ messageOperation, userId, userName, organization, fileId, fileName, filePath, period, type_report, uuid })
    return fileId
  } catch (err) {
    return Promise.reject(err)
  }
}
