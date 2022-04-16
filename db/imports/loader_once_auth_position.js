'use strict'
// Скрипт первичной загрузки auth_position
// по завершению загрузки включить ограничение на поле ID
const insertOnce = require('./src/controller_auth_position').position
const log = require('./src/common/logger')
const fs = require('fs')

const FILE_CSV = './file_for_loading/farm_auth_position.csv'

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
// 0 id;
// 1 name;
// 2 parent_id;
// 3 sort;
// 4 normative;
// 5 form_30;
// 6 sert;
// 7 actual;
// 8 comment;
// 9 p_group;
// 10 data_end
// 131;Должности специалистов с высшим профессиональным (немедицинским) образованием ;2;160;1;;;t;"";t;

const runNext = async function () {
  try {
    const rawdata = await loadFile(FILE_CSV)
    const arrRowsCsv = rawdata.toString().split('\n')
    const mapRecord = new Map()
    // сформируем словарь для будущей его сортировки по id
    for (let i = 1; i < arrRowsCsv.length; i++) {
      const fileds = arrRowsCsv[i].trim().split('|')
      if (fileds[0] !== '') {
        // Добавляем ранее не добавленные по id значения в карту
        if (!mapRecord.has(fileds[0])) {
          mapRecord.set(fileds[0], arrRowsCsv[i])
        }
      }
    }

    // Сортируем и запишем в новую карту
    const mapRecordSort = new Map([...mapRecord].sort(([k, v], [k2, v2]) => {
      if (Number(k) > Number(k2)) {
        return 1
      }
      if (Number(k) < Number(k2)) {
        return -1
      }
      return 0
    }))

    console.log(mapRecordSort)

    for (const [key, arrRowsCsv] of mapRecordSort) {
      const fileds = String(arrRowsCsv).trim().split('|')
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

      /* eslint-disable */
      const params = {
        id: fileds[0],
        name: fileds[1],
        parent_id: fileds[2] || null,
        sort: fileds[3] || null,
        normative: fileds[4] || null,
        sert: fileds[6] || null,
        actual: fileds[7] == 't' ? true: false,
        comment: fileds[8] == '""' ? '': fileds[8],
        p_group: fileds[9] == 't' ? true: false ,
        data_end: fileds[10] == '' ? null: fileds[10]
      }
      /* eslint-enable */
 	    if (fileds[0] !== '') {
 	      await insertOnce(params).catch(err => log.error(err.message))
 	    }
    }
  } catch (err) {
    log.error(err.message)
  }
}

runNext()
