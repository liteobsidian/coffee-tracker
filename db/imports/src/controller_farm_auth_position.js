'use strict'
// Контроллер справочника farm.auth_position
// справочных должностей
//
const log = require('./common/logger')
const model = require('./model_farm_auth_position')

/* eslint-disable */
/* eslint-enable */
// Функция создает новую запись или обновляет данные имеющейся МО
const cfindByNamePosition = async (args) => {
  try {
    // console.log('args ',args)
    let res = []
    res = await model.findByName(args.name)
    // console.log('res =', res.length)
    if (res.length === 0) {
      // НЕ найдена запись
      // log.info('НЕ найдена запись')
      return false
    } else {
      // найдено соответствие
      // log.info('найдено соответствие')
      return true
    }
  } catch (err) {
    throw Error(err)
  }
}

// (async () => {
//   try {
//     // // // // // тест ok ////////////////////////////
//     let params = {
//       name: 'Должности работников медицинских организаций'
//     }
//     await cfindByNamePosition(params).catch(err => log.error(err.message))
//     params = {
//       name: 'биолог'
//     }
//     await cfindByNamePosition(params).catch(err => log.error(err.message))
//     // /// /////////////////////////////////
//   } catch (err) { throw Error(err) }
// })()

module.exports.position = cfindByNamePosition
