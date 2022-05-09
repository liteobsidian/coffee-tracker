import {
  addRequest,
  deleteRequest,
  editRequest,
  acceptRequest,
  getRequestList,
  getNeedCountNomenclature
} from './controller'

export default {
  async add (req, res, next) {
    try {
      const request = await addRequest({ ...req.body, userId: req.user.id })
      res.json({ success: true, message: 'Заявка успешно добавлена!', requestId: request.id })
    } catch (err) {
      next(err)
    }
  },
  async edit (req, res, next) {
    try {
      const request = await editRequest({ ...req.body, userId: req.user.id })
      res.json({ success: true, message: 'Заявка успешно изменена!', requestId: request.id })
    } catch (err) {
      next(err)
    }
  },
  async accept (req, res, next) {
    try {
      const request = await acceptRequest({ ...req.body })
      res.json({ success: true, message: 'Заявка успешно подтверждена!', requestId: request.id })
    } catch (err) {
      next(err)
    }
  },
  async delete (req, res, next) {
    try {
      const request = await deleteRequest(req.params)
      res.json({ success: true, message: 'Заявка успешно удалена!', requestId: request.id })
    } catch (err) {
      next(err)
    }
  },
  async requestList (req, res, next) {
    try {
      const list = await getRequestList(req.user)
      res.json({ success: true, message: 'Список заявок успешно получен', list })
    } catch (err) {
      next(err)
    }
  },
  async needCountNomenclature (req, res, next) {
    try {
      const list = await getNeedCountNomenclature(req.user)
      res.json({ success: true, message: 'Список заявок успешно получен', list })
    } catch (err) {
      next(err)
    }
  }
}
