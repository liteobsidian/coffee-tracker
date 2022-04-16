'use strict'

import {
  schema as cSchema
} from './controller'

export default {
  async schema (req, res, next) {
    try {
      // req.params { organization: '0', type_report: '1' }
      // req.query { period_s: '2021-04-01', period_e: '2021-04-01' }
      const items = await cSchema({ ...req.query, ...req.params })
      res.json({ success: true, message: 'Получена схема валидации данных из шаблона в БД.', items })
    } catch (err) {
      next(err)
    }
  }
}
