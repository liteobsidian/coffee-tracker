'use strict'
import { list as listDB, findByWord as findByWordDB, listOid as listOidDB, updateDataDB } from './db'
import fs from 'fs'
import xlsx from 'xlsx'
import { promisify } from 'util'
import log from '@log'

export const list = data => listDB(data)
export const findByWord = data => findByWordDB(data)
export const listOid = data => listOidDB(data)

const readFile = promisify(fs.readFile)
const reducer = (acc, cur) => acc + cur

// Читать файл Список МО , записать в БД обновление наименований справочника организаций
const rwDictXLSX = async data => {
  const { messageOperation, userId, userName, fileName, filePath, period, uuid } = data
  try {
    const rawData = await readFile(filePath)
    const x = xlsx.read(rawData, { type: 'buffer' })
    const ws = x.Sheets[x.SheetNames[0]]
    /// Если диапазон данных подозрительно велик >500тыс - перепроверим его и установим фактический
    const r = ws['!ref'].split(':')
    console.log(`Исполнитель ${userName}; ${messageOperation} пользователь ${userId}; файл ${fileName}; Выявлено установленное на листе значение диапазона области данных !ref = ${ws['!ref']}`)
    let pZ = {} // указател на ячейку данных по циклу чтения
    if (/[\d]+/.exec(r[1]) > 500000) {
      console.log(`Исполнитель ${userName}; ${messageOperation} пользователь ${userId}; файл ${fileName}; ПРОВЕРКА ФАКТИЧЕСКОГО КОЛИЧЕСТВА СТРОК НА РАБОЧЕМ ЛИСТЕ (т.к. значение  > 500000 в области данных !ref = ${ws['!ref']} )`)
      for (const z in ws) {
        // Определим крайнюю ячейку
        pZ = (z[0] !== '!') ? z : pZ
      }
      // Установим выявленное значение диапазона данных
      ws['!ref'] = 'A1:' + pZ
      console.log(`Исполнитель ${userName}; ${messageOperation} пользователь ${userId}; файл ${fileName}; Исправлено значение области данных !ref = ${'A1:' + pZ}`)
    }
    // console.log('END', pZ, ws[pZ])
    // ////////////
    const dataJson = xlsx.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '', rawNumbers: true })
    // Индекс первого элемента массива с данными
    const startData = 1 // Данные должны быть начиная со второй строки файла, после строки заголовка полей
    let endData = 0
    endData = startData
    // Найти индекс последней не пустой строки массива с данными
    for (let i = startData; i < dataJson.length; i++) {
      endData = i
      if (i > 10 && dataJson[i].reduce(reducer) === '') break
    }
    // !!! ВАЖНО. Отрезать строки с шапкой таблици и хвост с пустыми значениями
    const dataJsonRows = dataJson.splice(startData, endData - startData)
    // Записать массив данных в БД
    if (dataJsonRows.length) {
      await updateDataDB(period, dataJsonRows)
    } else {
      throw new Error(`Неудачная попытка обновления справочника Организаций из файла с данными, получен пустой массив [] ;ОБРАТИТЕСЬ В СЛУЖБУ ПОДДЕРЖКИ РАБОТЫ СИСТЕМЫ С УКАЗАНИЕМ ПРОБЛЕМНОГО UUID файла=${uuid}; ПРОВЕРИТЬ ФАЙЛ В ХРОНИЛИЩЕ СИСТЕМЫ ${filePath} НА ЕГО НАЛИЧИЕ ИЛИ КОРРЕКТНОСТЬ ЕГО СТРУКТУРЫ`)
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
  const messageOperation = 'Загрузка справочника ОРГАНИЗАЦИИ'
  const { period, name: fileName, filePath, userId, userName, uuid } = data
  try {
    // Читаем XLSX, обновляем БД
    await rwDictXLSX({ messageOperation, userId, userName, fileName, filePath, period, uuid })
    return true
  } catch (err) {
    // Если при валидации чтото не заладилось - обязательно удаляем запись о файле в БД
    const msg = `Внимание - данные файла ${fileName} не записаны в справочник организаций в БД! ПРОВЕРЬТЕ СТРУКТУРУ ФАЙЛА ИЛИ НАЛИЧИЕ НЕ ПУСТЫХ ЗАПИСЕЙ В НЕМ !`
    log.error(err)
    log.error(msg)
    err.message = msg + ' ' + err.message
    return Promise.reject(err)
  }
}
