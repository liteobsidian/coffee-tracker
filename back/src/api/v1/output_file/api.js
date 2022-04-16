'use strict'

import { MakeOutputFile as cMakeOutputFile } from './controller'

export default {
  makeOutputFile: async function (req, res, next) {
    try {
      // const [link, filename, filePath] = await cMakeOutputFile({ ...{ uuid: req.uuid }, ...req.body, ...req.headers })
      const [filename, filePath] = await cMakeOutputFile({ ...{ uuid: req.uuid }, ...req.body, ...req.headers })
      // Отдать ссылку на файл
      // res.json({
      //   success: true,
      //   message: 'Сформирован сводный файл для отправки информации в вышестоящую организациюи',
      //   link: link
      // })
      // Отдать сам файл в запросе
      // res.type('.xlsx')
      // res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      // res.setHeader('Content-Disposition', 'attachment; filename=' + filename)
      // await res.send(link.data)
      console.log('filename', filename)
      console.log('filePath', filePath)
      res.download(filePath, filename)
    } catch (err) {
      next(err)
    }
  }
}
