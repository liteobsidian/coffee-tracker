'use strict'
// Скрипт loader_mo_organization.js выполняет загрузку/обновление
// https://nsi.rosminzdrav.ru/#!/refbook/1.2.643.5.1.13.13.11.1461/version/6.356
// Скачать эталонный справочник медицинских организаций за необходимый период
// Выбрать при скачивании xlsx формат

// выбрать Автофильтром из полученного справочника данные:
// 1) Код региона РФ = 48,
// 2) Наимеованиесубъекта системы сздавоохранения = Медицинская организация
// 3) Ведомственная принадлежность = Органы исполнительной власти субъектов Российской Федерации, осуществляющие функции в области здравоохранения
// 4) deleteReason - причина удаления - Пусто
// Полученные таким образом данные - сохранить в файл в формате csv вместе с строкой заголовком, установить при сохранении CSV разделтель полей  = ';'
// Ниже в скрипте используем путь к файлу в переменной FILE_MO_ORGANIZATION, 
// переменной PERIOD обязательно ставим актуальное для загрузки значение


const { insertMoFromNsiByInn, insertMoFromNsiByOid } = require('./src/controller_organization')
const log = require('./src/common/logger')
const fs = require('fs')

// const FILE_MO_ORGANIZATION = './file_for_loading/mo_from_nsi_new.csv'
// const PERIOD = '2021-04-01'

//  const FILE_MO_ORGANIZATION = './file_for_loading/Январь2021/mo_from_nsi_2021-01-31.csv'
//  const PERIOD = '2021-01-01'

// const FILE_MO_ORGANIZATION = './file_for_loading/Февраль2021/mo_from_nsi_2021-02-28.csv'
// const PERIOD = '2021-02-01'

// const FILE_MO_ORGANIZATION = './file_for_loading/Март2021/mo_from_nsi_2021-03-31.csv'
// const PERIOD = '2021-03-01'

// const FILE_MO_ORGANIZATION = './file_for_loading/Май2021/mo_from_nsi_2021-05-30.csv'
// const PERIOD = '2021-05-01'


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
// Заголовок CSV файла
// 0 id;
// 1 oid;
// 2 oldOid;
// 3 nameFull;
// 4 nameShort;
// 5 parentId;
// 6 medicalSubjectId;
// 7 medicalSubjectName;
// 8 inn;
// 9 kpp;
// 10 ogrn;
// 11 regionId;
// 12 regionName;
// 13 organizationType;
// 14... moDeptId;moDeptName;founder;deleteDate;deleteReason;createDate;modifyDate;moLevel;moAgencyKindId;moAgencyKind;profileAgencyKindId;profileAgencyKind;postIndex;cadastralNumber;latitude;longtitude;fiasVersion;aoidArea;aoidStreet;houseid;addrRegionId;addrRegionName;territoryCode;isFederalCity;areaName;prefixArea;streetName;prefixStreet;house

const runNext = async function () {
  try {
    const rawdata = await loadFile(FILE_MO_ORGANIZATION)
    const arrRowsCsv = rawdata.toString().split('\n')
    for (let i = 1; i < arrRowsCsv.length; i++) {
      const fileds = arrRowsCsv[i].trim().split(';')
      const params = {
        oid: fileds[1],
        name: fileds[3],
        short_name: fileds[4],
        name_subject_mo: fileds[7],
        federal_id: '48',
        inn: fileds[8],
        kpp: fileds[9],
        ogrn: fileds[10],
        period: PERIOD
      }
      if (fileds[1] !== '') {
        // await insertMoFromNsiByOid(params).catch(err => log.error(err.message))
        await insertMoFromNsiByInn(params).catch(err => log.error(err.message))
      }
    }
  } catch (err) {
    log.error(err.message)
  }
}

runNext()
