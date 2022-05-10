import { getList } from './controller'
import fs from 'fs'

export default {
  async list (req, res, next) {
    try {
      // const list =
      await getList(req.body)
      await res.setHeader('Content-Disposition', 'attachment')
      await res.setHeader('filename', `${req.body.method}.xlsx`)
      await res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      // await res.download('./template', `${req.body.method}.xlsx`)
      await fs.createReadStream(`template/${req.body.method}.xlsx`).pipe(res)
      // res.json({ success: true, message: 'Данные для отчёта успешно получены', list })
    } catch (err) {
      next(err)
    }
  }
}
