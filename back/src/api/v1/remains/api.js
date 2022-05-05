import { getList } from './controller'

export default {
  async list (req, res, next) {
    try {
      const list = await getList(req.params, req.userId)
      res.json({ success: true, message: 'Список остатков успешно получен', list })
    } catch (err) {
      next(err)
    }
  }
}
