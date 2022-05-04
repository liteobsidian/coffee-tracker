import {
  addInventory,
  deleteInventory,
  editInventory,
  getInventoryList,
  getInventory
} from './controller'

export default {
  async get (req, res, next) {
    try {
      const division = await getInventory(req.params)
      res.json({ success: true, message: 'Инвентаризация получена!', division })
    } catch (err) {
      next(err)
    }
  },
  async add (req, res, next) {
    try {
      const division = await addInventory(req.body)
      res.json({ success: true, message: 'Инвентаризация успешно добавлена!', divisionId: division.id })
    } catch (err) {
      next(err)
    }
  },
  async edit (req, res, next) {
    try {
      const division = await editInventory(req.body)
      res.json({ success: true, message: 'Инвентаризация успешно изменена!', divisionId: division.id })
    } catch (err) {
      next(err)
    }
  },
  async delete (req, res, next) {
    try {
      const division = await deleteInventory(req.query)
      res.json({ success: true, message: 'Инвентаризация успешно удалена!', divisionId: division.id })
    } catch (err) {
      next(err)
    }
  },
  async inventoryList (req, res, next) {
    try {
      const list = await getInventoryList(req.body)
      res.json({ success: true, message: 'Список документов инвентаризации успешно получен', list })
    } catch (err) {
      next(err)
    }
  }
}
