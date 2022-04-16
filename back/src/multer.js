
'use strict'
import fs from 'fs'
import multer from 'multer'
import { parseISO, format, isValid, parse } from 'date-fns'
import path from 'path'

import { PATH_UPLOADS } from '@config'

const MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet'
]

const FILE_EXTENSION = ['.xlsx', '.xls']

const getExtension = filename => filename.substring(filename.lastIndexOf('.')).toLowerCase()

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { period } = req.body
    const { organization } = req.body // !!!
    if (!isValid(parse(period, 'yyyy-MM-dd', new Date()))) {
      return callback(new Error(`Не верно указана дата ${period}, ожидается значение по формату YYYY-MM-DD `), false)
    }
    let pathUpload = ''
    if (organization === null || organization === '0' || isNaN(organization)) {
      // ГРУЗИМ СПРАВОЧНИКИ а ранее выдавали ошибку
      // return callback(new Error('Не верное значение id организации загрузки файла'), false)
      pathUpload = path.join(PATH_UPLOADS, 'dict', format(parseISO(period), 'yyyy-MM'))
    } else {
      pathUpload = path.join(PATH_UPLOADS, format(parseISO(period), 'yyyy-MM'), String(organization))
    }
    fs.mkdirSync(pathUpload, { recursive: true })
    callback(null, pathUpload)
  },
  filename: (req, file, callback) => {
    const { organization } = req.body // !!!
    const { period } = req.body
    const extension = getExtension(file.originalname)
    const { name_dict = '' } = req.params
    let filename = ''
    if (organization === null || organization === '0' || isNaN(organization)) {
      if (name_dict.includes('organization')) {
        // Формируем имя для загрузки справочника организаций
        filename = `organization_${period}_${req.uuid}${extension}`
      } else if (name_dict.includes('division')) {
        // Формируем имя для загрузки справочника подразделений
        filename = `division_${period}_${req.uuid}${extension}`
      } else {
        return callback(new Error('Запрос на загрузку неизвестного системе СПРАВОЧНИКА'), false)
      }
    } else {
      // Формируем имя файла с данными статистики
      filename = `${organization}_${req.uuid}${extension}`
    }
    callback(null, filename)
  }
})

const upload = multer(
  {
    storage: storage,
    fileFilter: (req, file, callback) => {
      const extension = getExtension(file.originalname)
      file.extension = extension
      // console.log(file)
      // console.log(req.body)
      if (!MIME_TYPES.includes(file.mimetype) || !FILE_EXTENSION.includes(extension)) {
        return callback(new Error('Ошибка при загурзке файла. Неверный тип или расширение'), false)
      }
      callback(null, true)
    }
  })
export default upload
