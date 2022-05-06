export const PORT = process.env.PORT || 3000

// конфигурация для работы с БД
export const DB_NAME = process.env.DBNAME || 'dbc3tc5e3v7hsl'
export const DB_HOST = process.env.DBHOST || 'ec2-34-248-169-69.eu-west-1.compute.amazonaws.com'
export const DB_PORT = process.env.DBPORT || 5432
export const DB_USER = process.env.DBUSER || 'nyufcpframonwl'
export const DB_PASSWORD = process.env.DBPASS || 'dbb571c187812484cb51c69dcc2689144bcbf4df4dcfbbf84f4e63bae718d9e4'
export const DEBUG = process.env.DEBUG || false

// конфигурация для работы с авторизованными пользователями
export const SECRET_KEY = process.env.SECRET_KEY || 'lipetsk:super:secret'

export const API_PATH = '/api'
export const API_VERSION = '1'
