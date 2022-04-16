'use strict'
import log from '@log'
// import fs from 'fs'
import path from 'path'
// import { promisify } from 'util'
import axios from 'axios'
import { listForReportDB } from '../file/db'
import { templateFileSchemaDB } from '../template/db'
import { REPORT_URL, REPORT_API, PATH_UPLOADS } from '../../../config'
import { createXlsxFile } from '../../../local_excel_report'

const MAXBODY = 200000000

// const readFile = promisify(fs.readFile)

export const MakeOutputFile = async data => {
  const { uuid } = data
  let json = {}
  const outputFileName = `Svod_${data.period + '_' + uuid}.xlsx`
  const PATH_OUTPUT_FILE_NAME = path.join(PATH_UPLOADS, outputFileName)
  // const localLink = { headers: { filename: path.basename(PATH_OUTPUT_FILE_NAME) }, data: null }
  try {
    // templateFileSchemaDB - возвращает массив,
    // Первый параметр - schemaValidation - схема валидации,
    // Второй - templateFile - наименование файла шаблона xlsx
    const [, templateFile] = await templateFileSchemaDB(data)
    // получим список файлов для вкючения в сводную выгрузку
    const itemsFile = await listForReportDB(data)
    let newItems = []
    for (let i = 0; i < itemsFile.length; i++) {
      newItems = newItems.concat(itemsFile[i].data)
    }
    // console.log(newItems.length)
    const params = [
      // {
      //   key: 'UUID',
      //   value: data.uuid,
      //   valueType: 'string'
      // },
      // {
      //   key: 'CURRENT_TIME',
      //   value: format(new Date(), 'dd.MM.yyyy HH:mm'),
      //   valueType: 'string'
      // }
    ]
    json = {
      name: templateFile,
      tableName: 'Таблица 1',
      params: params,
      tableTag: '<TABLE_NOT_BORDER>',
      data: newItems.map((el, i) => {
        const l = []
        for (let j = 0; j < el.length; j++) {
          l.push({ value: el[j], valueType: typeof el[j] })
        }
        return l
      }
      )
    }

    // Посмотреть что содержит первый элемент массива (первая строка отчета)
    // console.log('json',json.data[0])
    try {
      /* eslint-disable */
      throw 'Локальное формирование отчета'
    const { data: { data: { link } } } =
        await axios({
          method: 'post',
          baseURL: `http://${REPORT_URL}${REPORT_API}`,
          url: 'xls',
          data: json,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
    // return link
    // скачать из системы отчетности и отдать сам файл
    const config = {
      method: 'GET',
      url: `http://${REPORT_URL}/${link}`,
      responseType: 'arraybuffer', // 'blob'
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        Authorization: data.authorization
      },
      maxContentLength: MAXBODY,
      maxBodyLength: MAXBODY
    }
    const linkFileBody = await axios(config)
    // console.log(linkFileBody)
    return [linkFileBody, link]
     /* eslint-enable */
    } catch (err) {
      // !!! Сервис node-excel-report не доступен !!!
      // Формируем локально протокол с ошибками и отдаем файл  xlsx
      const resultCreateFile = await createXlsxFile({ outputFileName, json })
      if (!resultCreateFile) throw new Error('Ошибка формирования xlsx файла!')
      // const rawDataProtocol = await readFile(PATH_OUTPUT_FILE_NAME)
      // localLink.data = rawDataProtocol
      // return [localLink, outputFileName, PATH_OUTPUT_FILE_NAME]
      return [outputFileName, PATH_OUTPUT_FILE_NAME]
    } // end catch в случе не доступности сервиса node-excel-report
  } catch (err) {
    log.error(err)
    return Promise.reject(err)
  }
}
