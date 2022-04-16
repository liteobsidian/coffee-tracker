'use strict'

import path from 'path'
import {
  list as cList,
  deleteFile as cDeleteFile,
  upload as cUpload,
  loadProtocol as cloadProtocol,
  setStatusHandle as cSetStatusHandle,
  findByUuid as cFindByUuid,
  revalidation as cRevalidation
} from './controller'

const getExtension = filename => filename.substring(filename.lastIndexOf('.')).toLowerCase()

export default {
  async list (req, res, next) {
    try {
      const items = await cList({ ...req.query, ...req.params })
      res.json({ success: true, message: 'Успешная загрузка списка файлов из БД.', items })
    } catch (err) {
      next(err)
    }
  },
  async deleteFile (req, res, next) {
    try {
      const { uuid } = req.params
      const itemUuid = await cDeleteFile({ ...req.user, ...req.params })
      res.json({ success: true, message: `Успешное удаление файла с UUID:${uuid}.`, itemUuid })
    } catch (err) {
      next(err)
    }
  },
  upload: async function (req, res, next) {
    try {
      if (!req.file) throw new Error('Ошибка загрузки файла')
      const { period, type_report: type, division = null, name } = req.body
      const { id: userId, name: userName } = req.user
      const { organization } = req.body
      if (!type) throw new Error('Отсутствует информация о типе отчета')
      if (!organization) throw new Error('Отсутствует информация об организации')
      if (!userId) throw new Error('Отсутствует информация о пользователе')
      const itemId = await cUpload({
        period,
        type,
        division,
        name,
        userId,
        userName,
        organization,
        filePath: req.file.path,
        uuid: req.uuid
      })
      res.json(
        {
          success: true,
          message: `Файл с UUID ${req.uuid} загружен на проверку`,
          itemId
        })
    } catch (err) {
      next(err)
    }
  },
  loadProtocol: async function (req, res, next) {
    try {
      const link = await cloadProtocol({ ...req.user, ...req.params, ...req.headers })
      // Отдать сам файл в запросе
      res.type('.xlsx')
      res.setHeader('Content-disposition', 'attachment')
      res.setHeader('filename', `${link.headers.filename}`)
      res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      await res.send(link.data)
    } catch (error) {
      next(error)
    }
  },
  setStatusHandle: async function (req, res, next) {
    try {
      const { uuid } = req.params
      const itemId = await cSetStatusHandle({ ...req.params })
      res.json({
        success: true,
        message: `Изменен статус разрешения на отправку файла ${uuid} в вышестоящую систему`,
        itemId
      })
    } catch (error) {
      next(error)
    }
  },
  // Отдать файл по его /:uuid
  sendfile: async function (req, res, next) {
    try {
      const item = await cFindByUuid({ ...req.params })
      const exten = getExtension(item[0].path).trim()
      // res.type(exten)
      res.setHeader('Content-Disposition', 'attachment')
      res.setHeader('filename', `${path.basename(item[0].path)}`)
      // res.setHeader('filename', `${path.basename(item[0].name)}`)
      if (exten === '.xls') { res.setHeader('Content-type', 'application/vnd.ms-excel') }
      if (exten === '.xlsx') { res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') }
      res.download(item[0].path)
    } catch (err) {
      next(err)
    }
  },
  revalidation: async function (req, res, next) {
    try {
      const { type: roleUser } = req.user
      const { uuid } = req.params
      if (roleUser !== 'admin') throw new Error('Операция требует повышения полномочий, выполнение возможно от имени роли администратора предприятия.')
      const itemId = await cRevalidation({ ...req.user, ...req.params })
      // const itemId = uuid
      res.json({
        success: true,
        message: `Проведена повторная проверка данных файла ${uuid} на соответствие установленным правилам валидации отчета`,
        itemId
      })
    } catch (error) {
      next(error)
    }
  }
}
