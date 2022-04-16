'use strict'
import db from '@db'
import log from '@log'
import { parse, isValid } from 'date-fns'
import {
  ADD,
  ADD_DATA,
  LIST_BY_PERIOD_devel as LIST_BY_PERIOD,
  LIST_BY_PERIOD_ALL_ORG_devel as LIST_BY_PERIOD_ALL_ORG,
  LIST_BY_TYPE_devel as LIST_BY_TYPE,
  LIST_BY_TYPE_ALL_devel as LIST_BY_TYPE_ALL,
  DELETE,
  PROTOCOL_ERRORS,
  SET_HANDLED,
  LIST_FOR_REPORT,
  FIND_BY_UUID,
  FIND_BY_UUID_AND_SHEMA
} from './sql'

// req.params { organization: '0', type_report: '1' }
// req.query { period_s: '2021-04-01', period_e: '2021-04-01' }
// GET /api/v1/file/0/1?period_s=2021-04-01&period_e=2021-04-01 200 26.535 ms - 76
export const listDB = async ({ organization = null, type_report: typeReport, period_s: periodStart = '', period_e: periodEnd = '' }) => {
  try {
    if (!typeReport) throw new Error('Отсутствует информация о выборе типа отчета')
    let TEXT_REQUEST
    let params
    const validDateStart = isValid(parse(periodStart, 'yyyy-MM-dd', new Date()))
    const validDateEnd = isValid(parse(periodEnd, 'yyyy-MM-dd', new Date()))
    if (!periodStart && !periodEnd) {
      TEXT_REQUEST = (!organization || organization === '0') ? LIST_BY_TYPE_ALL : LIST_BY_TYPE
      params = (!organization || organization === '0') ? [typeReport] : [organization, typeReport]
    } else if (!validDateStart || !validDateEnd) {
      throw new Error('Некорректно указан период в запросе.')
    } else {
      TEXT_REQUEST = (!organization || organization === '0') ? LIST_BY_PERIOD_ALL_ORG : LIST_BY_PERIOD
      params = (!organization || organization === '0') ? [typeReport, periodStart, periodEnd] : [organization, typeReport, periodStart, periodEnd]
    }
    const { rowCount, rows } = await db.query(TEXT_REQUEST, params)
    return rowCount ? rows : []
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}

export const uploadDB = async ({ type, organization, division = null, uuid, name = '', filePath, period, userId }) => {
  try {
    if (!type) throw new Error('Отсутствует информация о типе отчета')
    if (!organization) throw new Error('Отсутствует информация об организации.')
    if (!userId) throw new Error('Отсутствует информация о пользователе')
    if (!period) throw new Error('Отсутствует информация о периоде предоставленного отчета на загрузку')
    const { rows } = await db.query(ADD, [type, organization, division || null, uuid, name, filePath, period, userId])
    return rows[0].id
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}
// export const addRow = async (inputFileId, dataJson) => {
//   try {
//    const { rows } = await db.query(ADDROW, [inputFileId, JSON.stringify(dataJson)])
//    return rows[0].id
//  } catch (error) {
//    return Promise.reject(error)
//  }
// }
export const deleteFileDB = async ({ id: userId, name: userName, uuid }) => {
  try {
    await db.query(DELETE, [uuid])
    console.log(`Исполнитель ${userName}; auth_user_id=${userId}; Удаление записи о файле uuid = ${uuid}`)
    return uuid
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}
export const addDataDB = async (inputFileId, dataJson, protocolErrors) => {
  try {
    const status = JSON.stringify(protocolErrors) === '[]'
    // console.log(status)
    const { rows } = await db.query(ADD_DATA, [inputFileId, JSON.stringify(dataJson), JSON.stringify(protocolErrors), status])
    return rows[0].id
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}
export const protocolDB = async ({ uuid }) => {
  try {
    const { rows } = await db.query(PROTOCOL_ERRORS, [uuid])
    // console.log(rows.length)
    // console.log(rows)
    return rows.length ? [rows[0].organization, rows[0].protocol_errors, rows[0].created_at] : [null, null, null]
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}
export const setStatusHandleDB = async ({ uuid }) => {
  try {
    const { rows } = await db.query(SET_HANDLED, [uuid])
    return rows[0].id
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}

export const listForReportDB = async ({ type_report, period }) => {
  try {
    const { rowCount, rows } = await db.query(LIST_FOR_REPORT, [type_report, period])
    return rowCount ? rows : []
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}

export const findByUuidDB = async ({ uuid }) => {
  try {
    const { rowCount, rows } = await db.query(FIND_BY_UUID, [uuid])
    return rowCount ? rows : []
  } catch (err) {
    log.error(err)
    const msg = `Внимание - файла ${uuid} не найден, требуется участие службы поддержки системы в оценке доступности файлов папки upload !!!`
    log.error(err)
    log.error(msg)
    err.message = msg + ' ' + err.message
    return Promise.reject(err)
  }
}

export const findByUuidAndShemaDB = async ({ uuid }) => {
  try {
    const { rowCount, rows } = await db.query(FIND_BY_UUID_AND_SHEMA, [uuid])
    return rowCount ? rows : []
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}
