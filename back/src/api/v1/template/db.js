'use strict'
import db from '@db'
import log from '@log'
import { parse, isValid } from 'date-fns'
import {
  SCHEMA,
  TEMPLATE_FILE_SCHEMA
} from './sql'

export const schemaDB = async ({ type_report: typeReport, period }) => {
  try {
    if (!typeReport) throw new Error('Отсутствует информация о выборе типа отчета')
    const validDate = isValid(parse(period, 'yyyy-MM-dd', new Date()))
    if (!validDate) throw new Error('Некорректно указан период в запросе.')
    if (!typeReport || isNaN(Number(typeReport))) throw new Error('Некорректно указан номер шаблона.')
    const { rowCount, rows } = await db.query(SCHEMA, [typeReport, period])
    return rowCount ? rows[0].schema_validation : {}
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}

export const templateFileSchemaDB = async ({ type_report: typeReport, period }) => {
  try {
    if (!typeReport) throw new Error('Отсутствует информация о выборе типа отчета')
    const validDate = isValid(parse(period, 'yyyy-MM-dd', new Date()))
    if (!validDate) throw new Error('Некорректно указан период в запросе.')
    if (!typeReport || isNaN(Number(typeReport))) throw new Error('Некорректно указан номер шаблона.')
    const { rowCount, rows } = await db.query(TEMPLATE_FILE_SCHEMA, [typeReport, period])
    return rowCount ? [rows[0].schema_validation, rows[0].template_file] : [{}, '']
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}
