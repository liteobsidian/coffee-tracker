import { getList } from './controller'

export default {
  async list (req, res, next) {
    try {
      const list = await getList(req.body)
      res.json({ success: true, message: 'Данные для отчёта успшно получены', list })
    } catch (err) {
      next(err)
    }
  }
}
