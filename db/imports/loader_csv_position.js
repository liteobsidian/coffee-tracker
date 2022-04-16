'use strict'
// Скрипт первичной загрузки auth_position
// по завершению загрузки включить ограничение на поле ID
const { insertOnce100000 } = require('./src/controller_auth_position')
const log = require('./src/common/logger')
const fs = require('fs')

const FILE_CSV = './file_for_loading/position_08.02.2020.csv'
async function loadFile (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

// Заголовок CSV
// 0 Занимаемая должность;
// 1 Тип должности

const runNext = async function () {
  try {
    const rawdata = await loadFile(FILE_CSV)
    const arrRowsCsv = rawdata.toString().split('\n')
    const arrSort = arrRowsCsv.sort()
    for (let i = 1; i < arrSort.length; i++) {
      const fileds = arrRowsCsv[i].trim().split(';')
      if (fileds[0] !== '') {
        // Добавляем в БД
        const params = {
          name: fileds[0]
        }
        // console.log(params)
        await insertOnce100000(params).catch(err => log.error(err.message))
      }
    }
  } catch (err) {
    log.error(err.message)
  }
}

runNext()
