'use strict'
import { listTypes } from './controller'

export const list = async (req, res, next) => {
  try {
    const result = await listTypes()
    res.json({ success: true, message: 'Успешная загрузка типов отчетности из БД.', result })
  } catch (err) {
    next(err)
  }
}
