'use strict'
// конфигурация для работы с БД stat
const DB_NAME = process.env.DBNAME || 'stat'
const DB_HOST = process.env.DBHOST || '10.3.0.36' || 'localhost' || '10.3.3.12'
const DB_PORT = process.env.DBPORT || 5433 || 5432 || 5432
const DB_USER = process.env.DBUSER || 'stat'
const DB_PASSWORD = process.env.DBPASS || 'stat'
// конфигурация для работы с БД farm
const FARMDB_NAME = process.env.FARM_DBNAME || 'farm'
const FARMDB_HOST = process.env.FARM_DBHOST || '10.3.0.36'
const FARMDB_PORT = process.env.FARM_DBPORT || 5433
const FARMDB_USER = process.env.FARM_DBUSER || 'farm'
const FARMDB_PASSWORD = process.env.FARM_DBPASS || 'farm'

const DEBUG = process.env.DEBUG || false
const MAX_TIME_QUERY = process.env.DEBUG || 300
const PATH_UPLOADS = process.env.PATH_UPLOADS || '/var/log/uploads'

module.exports = {
  DB_NAME,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  FARMDB_NAME,
  FARMDB_HOST,
  FARMDB_PORT,
  FARMDB_USER,
  FARMDB_PASSWORD,
  DEBUG,
  MAX_TIME_QUERY,
  PATH_UPLOADS
}
