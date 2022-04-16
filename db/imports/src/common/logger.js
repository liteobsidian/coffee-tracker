'use strict'
// // Модуль инициализации объекта log
// let log = { info: function () {}, error: function () {} }
// if (process.env.NODE_TEST !== 'test') { log = require('../log/index')(module) }
// module.exports = log
module.exports = {
  info: value => console.log(value),
  error: value => console.error(value),
  debug: value => console.log(value)
}
