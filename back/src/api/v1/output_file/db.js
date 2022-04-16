'use strict'
import db from '@db'
import log from '@log'
// import { parse, isValid } from 'date-fns'
import {
  ADD_OUTPUT_FILE
} from './sql'
// Временно не используется , основа для ведения отдельного журнала учета сформированных сводных отчетов
export const makeOutputFileDB = async ({ type, period, uuid, userId, data }) => {
  try {
    if (!type) throw new Error('Отсутствует информация о типе отчета')
    if (!period) throw new Error('Отсутствует информация о периоде формирования отчета для выгрузки')
    if (!userId) throw new Error('Отсутствует информация о пользователе')
    const { rows } = await db.query(ADD_OUTPUT_FILE, [type, period, uuid, data])
    return rows[0].id
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}
