import {
  addNomenclature,
  deleteNomenclature,
  editNomenclature,
  getNomenclature
} from './controller'

export default {
  async add (req, res, next) {
    try {
      const nomenclature = await addNomenclature(req.body)
      res.json({ success: true, message: 'Номенклатура успешно добавлена!', nomenclatureId: nomenclature.id })
    } catch (err) {
      next(err)
    }
  },
  async edit (req, res, next) {
    try {
      const nomenclature = await editNomenclature(req.body)
      res.json({ success: true, message: 'Номенклатура успешно изменена!', nomenclatureId: nomenclature.id })
    } catch (err) {
      next(err)
    }
  },
  async delete (req, res, next) {
    try {
      const nomenclature = await deleteNomenclature(req.query)
      res.json({ success: true, message: 'Номенклатура успешно удалена!', nomenclatureId: nomenclature.id })
    } catch (err) {
      next(err)
    }
  },
  async nomenclature (req, res, next) {
    try {
      const list = await getNomenclature(req.body)
      res.json({ success: true, message: 'Список номенклатур успешно получен', list })
    } catch (err) {
      next(err)
    }
  }
}
