'use strict'
import { list as cList, findByWord as cFindeByWord, listOid as cListOid, upload as cUpload } from './controller'

export const list = async (req, res, next) => {
  try {
    const result = await cList({ ...req.user })
    res.json({ success: true, message: 'Успешная загрузка данных БД.', result })
  } catch (err) {
    next(err)
  }
}
export const findByWord = async (req, res, next) => {
  try {
    const result = await cFindeByWord({ ...req.params })
    res.json({ success: true, message: 'Успешная загрузка данных БД.', result })
  } catch (err) {
    next(err)
  }
}
export const listOid = async (req, res, next) => {
  try {
    const result = await cListOid({ ...req.user })
    res.json({ success: true, message: 'Успешная загрузка данных БД.', result })
  } catch (err) {
    next(err)
  }
}
export const upload = async (req, res, next) => {
  try {
    if (!req.file) throw new Error('Ошибка загрузки файла')
    const {
      period, type_report:
      // type, division = null,
      name
    } = req.body
    const { id: userId, name: userName } = req.user
    // const { organization } = req.body
    // if (!type) throw new Error('Отсутствует информация о типе отчета')
    if (!userId) throw new Error('Отсутствует информация о пользователе')
    const itemId = await cUpload({ period, name, userName, filePath: req.file.path, uuid: req.uuid })
    res.json(
      {
        success: true,
        message: `СПРАВОЧНИК ОРГАНИЗАЦИЙ УСПЕШНО ЗАГРУЖЕН ЗА ПЕРИОД ${period}`,
        itemId
      })
  } catch (err) {
    next(err)
  }
}
