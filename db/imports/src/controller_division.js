'use strict'
// Контроллер справочника division
// справочных данных по подразделениям в медицинских организациях Липецкой области
//
const log = require('./common/logger')
const model = require('./model_division')

/* eslint-disable */
/* eslint-enable */
// Функция создает новую запись или обновляет данные имеющегося подразделения
const insertDivision = async (args) => {
  try {
    console.log(args)
    const checkOrg = await model.findByOid(args.oid)

    console.log('checkOrg =', checkOrg)
    if (checkOrg.length === 0) {
      const elObj = { period: args.period, name: args.name }
      const newList = []
      newList.push(elObj)
      args.list_name = JSON.stringify(newList) // первичное добавление list_name
      // Получим ID новой записи
      const id = await model.add(args)
      if (id) {
        log.info(`Добавлена запись о подразделении division OID=${args.oid} ${args.name} ${args.oidMo}id= ${id}`)
        return id
      } else {
        throw new Error(`Ошибка записи ${JSON.stringify(args)}`)
      }
    } else {
      // Учетная запись уже существует - обновим данные
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
      const idUpdate = await model.update(args)
      log.info(`Обновлена информация в БД о подразделении с OID = ${args.oid} OIDMO = ${args.oidMo}`)
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
    // console.log('items division name =', result)
    return result
  } catch (err) {
    throw new Error(err)
  }
}

const listOid = async () => {
  try {
    const items = await model.listOid()
    const result = items.map(el => el.oid)
    // console.log('items division oid =', result)
    return result
  } catch (err) {
    throw Error(err)
  }
}

// (async () => {
//   try {
//     // // // // // тест ok ////////////////////////////
//     const params = {
//       name: 'Администрация',
//       oid: '1.2.643.5.1.13.13.12.2.48.9447.0.122789',
//       oidMo: '1.2.643.5.1.13.13.12.2.48.9447',
//       period: '2021-03-01'
//     }
//     await insertDivision(params).catch(err => log.error(err.message))
//     //     // /// /////////////////////////////////
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


module.exports = { insertDivision, listName, listOid }
