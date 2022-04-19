import {
  addWorkday,
  deleteWorkday,
  editWorkday,
  getWorkdays
} from './controller'

export default {
  async add (req, res, next) {
    try {
      const workday = await addWorkday(req.body)
      res.json({ success: true, message: 'Смена успешно добавлена!', workdayId: workday.id })
    } catch (err) {
      next(err)
    }
  },
  async edit (req, res, next) {
    try {
      const workday = await editWorkday(req.body)
      res.json({ success: true, message: 'Смена успешно изменена!', workdayId: workday.id })
    } catch (err) {
      next(err)
    }
  },
  async delete (req, res, next) {
    try {
      const workday = await deleteWorkday(req.query)
      res.json({ success: true, message: 'Смена успешно удалена!', workdayId: workday.id })
    } catch (err) {
      next(err)
    }
  },
  async workdays (req, res, next) {
    try {
      const list = await getWorkdays(req.body)
      res.json({ success: true, message: 'Список смен успешно получен', list })
    } catch (err) {
      next(err)
    }
  }
}
