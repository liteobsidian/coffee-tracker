'use strict'
const { v4 } = require('uuid')
const requestId = (req, res, next) => {
  try {
    req.uuid = v4()
    next()
  } catch (error) {
    next(error)
  }
}
module.exports = requestId
