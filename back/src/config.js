export const PORT = process.env.PORT || 3000

// конфигурация для работы с БД
export const DB_NAME = process.env.DBNAME || 'd4atj6j94bbh63'
export const DB_HOST = process.env.DBHOST || 'ec2-176-34-211-0.eu-west-1.compute.amazonaws.com'
export const DB_PORT = process.env.DBPORT || 5432
export const DB_USER = process.env.DBUSER || 'sinoywbjcqzmbn'
export const DB_PASSWORD = process.env.DBPASS || '21a96b06a66ff20f36ccd864d05ee7aa565077a838d3ca382073eb35a0388794'
export const DEBUG = process.env.DEBUG || false

// конфигурация для работы с авторизованными пользователями
export const SECRET_KEY = process.env.SECRET_KEY || 'lipetsk:super:secret'

export const API_PATH = '/api'
export const API_VERSION = '1'
