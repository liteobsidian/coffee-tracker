'use strict'
// Контроллер справочника finance_source
// справочных данных по источникам финансирования
//
const log = require('./common/logger')
const model = require('./model_finance_source')

/* eslint-disable */
/* eslint-enable */
// Функция создает новую запись или обновляет данные имеющейся МО
const insertFinanceSource = async (args) => {
  try {
    // console.log(args)
    const check = await model.findByName(args.name)
    // console.log('check =', check)
    if (check.length === 0) {
      // Получим ID новой записи
      const id = await model.add(args)
      if (id) {
        log.info(`Добавлена запись в справочник Финансовые источники finance_source ID=${args.id} ${args.name} ${args.b_date} ${args.e_date}`)
        return id
      } else {
        throw new Error(`Ошибка записи ${JSON.stringify(args)}`)
      }
    } else {
      args.id = check[0].id
      // Учетная запись уже существует - обновим данные
      const idUpdate = await model.update(args)
      // console.log(idUpdate)
      log.info(`Обновлена информация в справочнике Финансовые источники finance_source name = ${args.name} ${args.b_date} ${args.e_date}`)
      return idUpdate
    }
  } catch (err) {
    throw Error(err)
  }
}
const listActive = async ({ period }) => {
  try {
    const items = await model.listActive(period)
    const result = items.map(el => el.name)
    return result
  } catch (err) {
    throw new Error(err)
  }
}

// тест ok ////////////////////////////
// (async () => {
//   try {
//      const params = {
//        name: 'ОМС',
//        b_date: '2020-01-01',
//        e_date: null
//      }
//      await insertFinanceSource(params).catch(err => log.error(err.message))
//    } catch (err) { throw Error(err) }
//  })()

// (async () => {
//   try {
//     // тест ok ////////////////////////////
//     const params = { period: '2021-01-01'}
//     console.log(await listActive(params).catch(err => log.error(err.message)))
//     // /// /////////////////////////////////
//   } catch (err) { throw Error(err) }
// })()

module.exports.financeSource = insertFinanceSource
module.exports = { listActive }
