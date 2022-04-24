import {
  addWorkday,
  deleteWorkday,
  editWorkday,
  getWorkdays,
  getUserWorkday,
  startDay,
  endDay,
  nextDay
} from './controller'

export default {
  async get (req, res, next) {
    try {
      const list = await getUserWorkday(req.user)
      res.json({ success: true, message: 'Смена успешно получена', list })
    } catch (err) {
      next(err)
    }
  },
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
  },
  async start (req, res, next) {
    try {
      const id = await startDay(req.user)
      res.json({ success: true, message: `Смена с id: ${id} открыта` })
    } catch (err) {
      next(err)
    }
  },
  async end (req, res, next) {
    try {
      const id = await endDay({ userId: req.user.id, ...req.body })
      res.json({ success: true, message: `Смена с id: ${id} закрыта` })
    } catch (err) {
      next(err)
    }
  },
  async next (req, res, next) {
    try {
      const item = await nextDay(req.user)
      res.json({ success: true, message: 'Следующая смена успешно загружена', item })
    } catch (err) {
      next(err)
    }
  }
}
