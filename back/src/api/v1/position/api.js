'use strict'
import { list as cList } from './controller'

export const list = async (req, res, next) => {
  try {
    const items = await cList()
    res.json({ success: true, message: 'Успешная загрузка списка должностей из БД.', items })
  } catch (err) {
    next(err)
  }
}
