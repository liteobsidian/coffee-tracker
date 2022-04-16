'use strict'
// Скрипт loader_mo_organization.js выполняет загрузку/обновление
// эталонного справочника медицинских организаций

const insertOrganization = require('./src/controller_organization').organization
const log = require('./src/common/logger')
const fs = require('fs')

const FILE_MO_ORGANIZATION = './file_for_loading/mo_organization.csv'
// Заголовок CSV файла
// 0 OID медицинской организации;
// 1 Полное наименование медицинской организации;
// 2 Наименование субъекта системы здравоохранения;
// 3 Наименование региона РФ
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

const runNext = async function () {
  try {
    const rawdata = await loadFile(FILE_MO_ORGANIZATION)
    const arrRowsCsv = rawdata.toString().split('\n')
    for (let i = 1; i < arrRowsCsv.length; i++) {
      const fileds = arrRowsCsv[i].trim().split(';')
 	  const params = { oid: fileds[0], name: fileds[1], name_subject_mo: fileds[2], federal_id: '48' }
 	  if (fileds[0] !== '') {
 	     await insertOrganization(params).catch(err => log.error(err.message))
 	  }
    }
  } catch (err) {
    log.error(err.message)
  }
}

runNext()
