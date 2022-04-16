'use strict'
// Модуль controller справочных должностей
//
const log = require('./common/logger')
const model = require('./model_auth_position')

/* eslint-disable */
/* eslint-enable */
// Функция создает новую запись должности или обновляет данные имеющейся МО - для переноса из системы farm
// На поле id в таблице auth_position предварительно отключить increment для id
const insertOnce = async (args) => {
  try {
    // console.log(args)
    const check = await model.findById(args)
    // console.log('check =', check)
    if (check.length === 0) {
      // Получим ID новой записи
      const id = await model.addOnce(args)
      if (id) {
        log.info(`Добавленая запись auth_position ID=${args.id} ${args.name} parent_id= ${args.parent_id}`)
        return id
      } else {
        throw new Error(`Ошибка записи ${JSON.stringify(args)}`)
      }
    } else {
      // Учетная запись уже существует - обновим данные
      const idUpdate = await model.updateOnce(args)
      log.info(`Обновлена информация в БД о Должности auth_position с ID = ${args.id} ${args.name} parent_id= ${args.parent_id}`)
      return idUpdate
    }
  } catch (err) {
    throw Error(err)
  }
}
const insertOnce100000 = async (args) => {
  try {
    // console.log(args)
    const check = await model.findByName(args)
    console.log('check =', check)
    let id = 0
    if (check.length === 0) {
      // Получим ID новой записи
      id = await model.addOnce100000(args)
      if (id) {
        log.info(`Добавленая запись auth_position ID=${id} ${args.name}`)
        return id
      } else {
        throw new Error(`Ошибка записи ${JSON.stringify(args)}`)
      }
    } else {
      // Должность уже существует возвращаем ее id
      log.info(`Должность ${args.name} существует в ID = ${check[0].id} ${args.name}`)
      return id
    }
  } catch (err) {
    throw Error(err)
  }
}
const listName = async () => {
  try {
    const items = await model.listName()
    const result = items.map(el => el.name.toLowerCase())
    return result
  } catch (err) {
    throw new Error(err)
  }
}

// (async () => {
//   try {
//     //     // // // // // тест ok ////////////////////////////
//     const params = {
//       // 1;Должности работников медицинских организаций;;1;;;;t;"";t;
//       id: 1,
//       name: 'Должности работников медицинских организаций',
//       parent_id: null,
//       sort: 1,
//       normative: null,
//       sert: null,
//       actual: true,
//       comment: '',
//       p_group: true,
//       data_end: null
//     }
//     await insertOnce(params).catch(err => log.error(err.message))
//     // /// /////////////////////////////////
//   } catch (err) { throw Error(err) }
// })()

// (async () => {
//   try {
//     // // // // // тест ok ////////////////////////////
//     console.log(await listName().catch(err => log.error(err.message)))
//   } catch (err) { throw Error(err) }
// })()

// (async () => {
//   try {
//     //     // // // // // тест ok ////////////////////////////
//     let params = {
//       // 1;Должности работников медицинских организаций;;1;;;;t;"";t;
//       name: 'Авербандщик'
//     }
//     await insertOnce100000(params).catch(err => log.error(err.message))
//     params = {
//       name: 'Оператор ЭВМ'
//     }
//     await insertOnce100000(params).catch(err => log.error(err.message))
//     // /// /////////////////////////////////
//   } catch (err) { throw Error(err) }
// })()

module.exports.position = insertOnce
module.exports = { listName, insertOnce100000 }
