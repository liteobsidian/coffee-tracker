'use strict'
import db from '@db'
import log from '@log'
import { LIST, GET, GET_BY_WORD, LIST_NAME, LIST_OID_LIST, LIST_ORG, LIST_ORG_PERIOD, LIST_NAME_PERIOD, FIND_BY_OID, UPDATE_NAME_BY_OID } from './sql'

export const list = async ({ organization = null }) => {
  try {
    if (!organization) {
      const { rowCount, rows } = await db.query(LIST, [])
      return rowCount ? rows : []
    }
    const { rowCount, rows } = await db.query(GET, [organization])
    return rowCount ? rows : []
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}

export const findByWord = async ({ wd = '' }) => {
  try {
    const { rowCount, rows } = await db.query(GET_BY_WORD, [wd.toLowerCase()])
    return rowCount ? rows : []
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}

export const listName = async () => {
  try {
    const { rowCount, rows } = await db.query(LIST_NAME, [])
    const items = rowCount ? rows.map(el => el.name) : []
    return items
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}

// Получить список oid from list_oid
export const listOid = async () => {
  try {
    const { rowCount, rows } = await db.query(LIST_OID_LIST, [])
    const items = rowCount ? rows.map(el => el.oid) : []
    const newItems = []
    items.forEach(el => {
      for (let j = 0; j < el.length; j++) {
        newItems.push(el[j])
      }
    })
    return newItems
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}

// Получить список [{inn,kpp,name,oid}...] справочника организаций
export const listObj = async () => {
  try {
    const { rowCount, rows } = await db.query(LIST_ORG, [])
    return rowCount ? rows : []
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}

// Получить список [{inn,kpp,name,oid}...] справочника организаций
export const listObjPeriod = async (period) => {
  try {
    const { rowCount, rows } = await db.query(LIST_ORG_PERIOD, [period])
    return rowCount ? rows : []
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}

export const listNamePeriod = async (period) => {
  try {
    const { rowCount, rows } = await db.query(LIST_NAME_PERIOD, [period])
    const items = rowCount ? rows.map(el => el.name) : []
    return items
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}

// Функция обновления справочника организаций ...period: '2021-04-01'
// Входной параметр params = {period,oid,name}
const insertOrgByOid = async (args) => {
  try {
    // console.log(args)
    const { rows: checkOrg } = await db.query(FIND_BY_OID, [args.oid])
    if (checkOrg.length === 0) {
      // ЕСЛИ ЗАПИСЬ В БД ОТСУТСТВУЕ СООБЩАЕМ ПОЛЬЗОВАТЕЛЮ
      log.info(`Справочник ОРГАНИЗАЦИЙ, НЕ НАЙДЕНА ЗАПИСЬ при обновлении информация в БД за период=${args.period} OID = ${args.oid} Имя = ${args.name}`)
    } else {
      // Запись уже существует - обновим данные
      // Проверим OID присутствует в списке list_oid
      // console.log(checkOrg[0].list_oid)
      // Соберем список OID
      if (checkOrg[0].list_oid === null) {
        args.list_oid = [args.oid]
      } else if (!checkOrg[0].list_oid.includes(args.oid)) {
        args.list_oid = checkOrg[0].list_oid
        args.list_oid.push(args.oid)
        // console.log(args.list_oid)
      } else {
        args.list_oid = checkOrg[0].list_oid
      }
      // Соберем список list_name
      const elObj = { period: args.period, name: args.name }
      let newListName = []
      if (checkOrg[0].list_name === null || typeof checkOrg[0].list_name !== 'object') {
        newListName.push(elObj)
        args.list_name = JSON.stringify(newListName) // первичное добавление заныения list_name
      } else if (!checkOrg[0].list_name.find((org) => org.period === args.period)) {
        // Если объект за указанный период не найден в списке, добавим в список
        newListName = checkOrg[0].list_name
        newListName.push(elObj)
        args.list_name = JSON.stringify(newListName)
      } else {
        // Если объект за указанный период найден в списке, - его наименование требуется изменить на новое
        // отфильтруем
        const listName = checkOrg[0].list_name
        const result = listName.filter((item) => item.period !== args.period)
        result.push(elObj)
        // обновим массив с новым обновленным объектом
        args.list_name = JSON.stringify(result)
      }
      const idUpdate = await db.query(UPDATE_NAME_BY_OID, [args.oid, args.name, args.list_name])
      log.info(`Справочник ОРГАНИЗАЦИЙ, Обновлена информация в БД за период=${args.period} OID = ${args.oid} Имя = ${args.name}`)
      return idUpdate
    }
  } catch (err) {
    throw Error(err)
  }
}

export const updateDataDB = async (period, dataJson) => {
  try {
    console.log(period)
    // console.log(dataJson)
    // const { rows } = await db.query(ADD_DATA, [inputFileId, JSON.stringify(dataJson), JSON.stringify(protocolErrors), status])
    for (let i = 0; i < dataJson.length; i++) {
      const params = {
        period: period,
        oid: dataJson[i][0],
        name: dataJson[i][1]
      }
      await insertOrgByOid(params)
    }
    return true
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}
