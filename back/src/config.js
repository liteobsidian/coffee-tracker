export const PORT = process.env.PORT || 3000

// конфигурация для работы с БД
export const DB_NAME = process.env.DBNAME || 'coffee_tracker'
export const DB_HOST = process.env.DBHOST || 'localhost'
export const DB_PORT = process.env.DBPORT || 5432
export const DB_USER = process.env.DBUSER || 'coffee'
export const DB_PASSWORD = process.env.DBPASS || 'coffee'
export const DEBUG = process.env.DEBUG || false

// конфигурация для работы с авторизованными пользователями
export const SECRET_KEY = process.env.SECRET_KEY || 'lipetsk:super:secret'

export const API_PATH = '/api'
export const API_VERSION = '1'
