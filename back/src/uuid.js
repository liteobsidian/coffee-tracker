'use strict'
import { v4 as uuidv4 } from 'uuid'
const requestId = (req, res, next) => {
  try {
    req.uuid = uuidv4()
    next()
  } catch (error) {
    next(error)
  }
}
export default requestId
