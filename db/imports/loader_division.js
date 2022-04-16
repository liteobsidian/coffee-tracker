'use strict'
// Скрипт loader_division.js выполняет загрузку/обновление
// эталонного справочника подразделений медицинских организаций
// https://cloud.cniioiz.ru/owncloud/index.php/s/oNf7b1eCsvVKgRe

const log = require('./src/common/logger')
const fs = require('fs')
const { insertDivision } = require('./src/controller_division')

const FILE_DIVISION = './file_for_loading/division.csv'
const PERIOD = '2021-04-01'

// const FILE_DIVISION = './file_for_loading/Январь2021/division_2021-01-01.csv'
// const PERIOD = '2021-01-01'

//  const FILE_DIVISION = './file_for_loading/Февраль2021/division_2021-02-01.csv'
//  const PERIOD = '2021-02-01'

// const FILE_DIVISION = './file_for_loading/Март2021/division_2021-03-01.csv'
// const PERIOD = '2021-03-01'

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
// 0 OID медицинской организации;
// 1 Полное наименование медицинской организации;
// 2 Наименование субъекта системы здравоохранения;
// 3 Наименование региона РФ;
// 4 OID структурного подразделения;
// 5 Наименование структурного подразделения

const runNext = async function () {
  try {
    const rawdata = await loadFile(FILE_DIVISION)
    const arrRowsCsv = rawdata.toString().split('\n')
    for (let i = 1; i < arrRowsCsv.length; i++) {
      const fileds = arrRowsCsv[i].trim().split(';')
      const params = { oid: fileds[4], name: fileds[5], oidMo: fileds[0], period: PERIOD }
      if (fileds[0] !== '') {
        await insertDivision(params).catch(err => log.error(err.message))
      }
    }
  } catch (err) {
    log.error(err.message)
  }
}

runNext()
