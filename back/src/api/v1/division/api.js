import {
  addDivision,
  deleteDivision,
  editDivision,
  getDivisions,
  getDivision
} from './controller'

export default {
  async get (req, res, next) {
    try {
      const division = await getDivision(req.params)
      res.json({ success: true, message: 'Подразделение получено!', division })
    } catch (err) {
      next(err)
    }
  },
  async add (req, res, next) {
    try {
      const division = await addDivision(req.body)
      res.json({ success: true, message: 'Подразделение успешно добавлено!', divisionId: division.id })
    } catch (err) {
      next(err)
    }
  },
  async edit (req, res, next) {
    try {
      const division = await editDivision(req.body)
      res.json({ success: true, message: 'Подразделение успешно изменено!', divisionId: division.id })
    } catch (err) {
      next(err)
    }
  },
  async delete (req, res, next) {
    try {
      const division = await deleteDivision(req.query)
      res.json({ success: true, message: 'Подразделение успешно удалено!', divisionId: division.id })
    } catch (err) {
      next(err)
    }
  },
  async divisions (req, res, next) {
    try {
      const list = await getDivisions(req.body)
      res.json({ success: true, message: 'Список подразделений успешно получен', list })
    } catch (err) {
      next(err)
    }
  }
}
