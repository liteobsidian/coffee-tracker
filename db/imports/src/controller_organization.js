'use strict'
// Модуль controller справочных данных по медицинским организациям Липецкой области
//
const log = require('./common/logger')
const model = require('./model_organization')

/* eslint-disable */
/* eslint-enable */
// Функция создает новую запись или обновляет данные имеющейся МО
const insertOrganization = async (args) => {
  try {
    console.log(args)
    const checkOrg = await model.findByOid(args.oid)
    console.log('checkOrg =', checkOrg)
    if (checkOrg.length === 0) {
      // Получим ID новой записи
      const id = await model.add(args)
      if (id) {
        log.info(`Добавленая запись о МО OID=${args.oid} ${args.name} id= ${id}`)
        return id
      } else {
        throw new Error(`Ошибка записи ${JSON.stringify(args)}`)
      }
    } else {
      // Учетная запись уже существует - обновим данные
      const idUpdate = await model.update(args)
      log.info(`Обновлена информация в БД о МО с OID = ${args.oid}`)
      return idUpdate
    }
  } catch (err) {
    throw Error(err)
  }
}
// Функция создает новую запись или обновляет данные имеющейся МО на основании справочника НСИ
// https://nsi.rosminzdrav.ru/#!/refbook/1.2.643.5.1.13.13.11.1461/version/6.320
const insertMoFromNsiByOid = async (args) => {
  try {
    console.log(args)
    const checkOrg = await model.findByOid(args.oid)
    console.log('checkOrg =', checkOrg)
    if (checkOrg.length === 0) {
      // Получим ID новой записи
      const id = await model.insertFromNsi(args)
      if (id) {
        log.info(`Добавленая запись о МО OID=${args.oid} ${args.name} id= ${id}`)
        return id
      } else {
        throw new Error(`Ошибка записи ${JSON.stringify(args)}`)
      }
    } else {
      // Учетная запись уже существует - обновим данные
      const idUpdate = await model.updateFromNsi(args)
      log.info(`Обновлена информация в БД о МО с OID = ${args.oid}`)
      return idUpdate
    }
  } catch (err) {
    throw Error(err)
  }
}
// Параметры расширены значен6ием периода актуализации данных ...period: '2021-04-01'
const insertMoFromNsiByInn = async (args) => {
  try {
    // console.log(args)
    const checkOrg = await model.findByInn(args.inn)
    console.log('checkOrg =', JSON.stringify(checkOrg[0]))
    console.log(typeof checkOrg[0].list_name)
    if (checkOrg.length === 0) {
      // Сформируем массив oid
      args.list_oid = [args.oid]
      // Получим ID новой записи
      const elObj = { period: args.period, name: args.name }
      const newList = []
      newList.push(elObj)
      args.list_name = JSON.stringify(newList) // первичное добавление заныения list_name
      const id = await model.insertFromNsiByInn(args)
      if (id) {
        log.info(`Добавленая запись за период ${args.period} МО OID=${args.oid} ${args.name} id= ${id}`)
        return id
      } else {
        throw new Error(`Ошибка записи ${JSON.stringify(args)}`)
      }
    } else {
      // Учетная запись уже существует - обновим данные
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
      const idUpdate = await model.updateFromNsiByInn(args)
      log.info(`Обновлена информация в БД о МО с Inn = ${args.inn}`)
      return idUpdate
    }
  } catch (err) {
    throw Error(err)
  }
}

const listName = async () => {
  try {
    const items = await model.listName()
    const result = items.map(el => el.name)
    return result
  } catch (err) {
    throw new Error(err)
  }
}

const listOid = async () => {
  try {
    const items = await model.listOid()
    const result = items.map(el => el.oid)
    return result
  } catch (err) {
    throw Error(err)
  }
}

// (async () => {
//   try {
//     // // // // // тест ok ////////////////////////////
//     const params = {
//       oid: '1.2.643.5.1.13.13.12.2.48.4484',
//       name: 'Государственное учреждение здравоохранения "Липецкий областной перинатальный центр"',
//       name_subject_mo: 'Медицинская организация',
//       federal_id: '48'
//     }
//     await insertOrganization(params).catch(err => log.error(err.message))
//     // /// /////////////////////////////////
//   } catch (err) { throw Error(err) }
// })()
// (async () => {
//   try {
//     // // // // // тест ok ////////////////////////////
//     console.log(await listName().catch(err => log.error(err.message)))
//     console.log(await listOid().catch(err => log.error(err.message)))
//     // /// /////////////////////////////////
//   } catch (err) { throw Error(err) }
// })()

// (async () => {
//   try {
//     // // // // // тест ok ////////////////////////////
//      const params = {
//        oid: '1.2.643.5.1.13.13.12.2.48.4484',
//        name: 'Государственное учреждение здравоохранения "Липецкий областной перинатальный центр"',
//        short_name: 'ГУЗ "ЛОПЦ"',
//        name_subject_mo: 'Медицинская организация',
//        federal_id: '48',
//        inn: '4825053843',
//        kpp: '482501001',
//        ogrn: '1074823017609',
//        period: '2021-04-01'
//      }
//      await insertMoFromNsi(params).catch(err => log.error(err.message))
// //     // /// /////////////////////////////////
//    } catch (err) { throw Error(err) }
//  })()

// (async () => {
//   try {
//     // // // // // тест ok ////////////////////////////
//     const params = {
//       oid: '1.2.643.5.1.13.13.12.2.48.448y2',
//       name: 'Государственное учреждение здравоохранения "Липецкий областной Тест44"',
//       short_name: 'ГУЗ "ТЕСТ"',
//       name_subject_mo: 'Медицинская организация',
//       federal_id: '48',
//       inn: '1234567891',
//       kpp: '482501001',
//       ogrn: '1074823017609',
//       list_oid: ['1.2.643.5.1.13.13.12.2.48.448y'],
//       period: '2021-04-01'
//     }
//     await insertMoFromNsiByInn(params)
//     //     params = {
//     //       oid: '1.2.643.5.1.13.13.12.2.48.448x',
//     //       name: 'Test name',
//     //       short_name: 'test short_name',
//     //       name_subject_mo: 'Медицинская организация',
//     //       federal_id: '48',
//     //       inn: '1234567890',
//     //       kpp: '482501001',
//     //       ogrn: '1074823017609'
//     //       // list_oid: ['1.2.643.5.1.13.13.12.2.48.448x']
//     //     }
//     //     await insertMoFromNsiByInn(params).catch(err => log.error(err.message))
//     //     // /// /////////////////////////////////
//   } catch (err) { throw Error(err) }
// })()

module.exports.organization = insertOrganization
module.exports = { listName, listOid, insertMoFromNsiByOid, insertMoFromNsiByInn }
