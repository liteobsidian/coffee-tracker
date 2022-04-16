'use strict'
// Скрипт loader_finance_source.js выполняет загрузку/обновление справочника источники финансирования

const insertFinanceSource = require('./src/controller_finance_source').financeSource
const log = require('./src/common/logger')
const fs = require('fs')

const FILE_CSV = './file_for_loading/finance_source.csv'

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
// 0 name;
// 1 b_date;
// 2 e_date;
const runNext = async function () {
  try {
    const rawdata = await loadFile(FILE_CSV)
    const arrRowsCsv = rawdata.toString().split('\n')
    for (let i = 1; i < arrRowsCsv.length; i++) {
      const fileds = arrRowsCsv[i].trim().split(';')
 	    const params = { name: fileds[0], b_date: fileds[1], e_date: fileds[2] !== 'null' ? fileds[2] : null }
      // console.log(params)
 	     if (fileds[0] !== '') {
 	       await insertFinanceSource(params).catch(err => log.error(err.message))
 	     }
    }
  } catch (err) {
    log.error(err.message)
  }
}

runNext()
