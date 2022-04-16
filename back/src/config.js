export const PORT = process.env.PORT || 3000

// конфигурация для работы с БД
export const DB_NAME = process.env.DBNAME || 'coffee_tracker'
export const DB_HOST = process.env.DBHOST || 'localhost'
export const DB_PORT = process.env.DBPORT || 5432
export const DB_USER = process.env.DBUSER || 'coffee'
export const DB_PASSWORD = process.env.DBPASS || 'coffee'
export const DEBUG = process.env.DEBUG || false
// export const MAX_TIME_QUERY = process.env.DEBUG || 200

// конфигурация для работы с авторизованными пользователями
export const SECRET_KEY = process.env.SECRET_KEY || 'lipetsk:super:secret'

export const API_PATH = '/api'
export const API_VERSION = '1'
// Каталог хранения принятых на загрузку файлов
export const PATH_UPLOADS = process.env.PATH_UPLOADS || 'uploads'
// Каталог хранения шаблонов (для локальной генерации файлов xlsx)
export const PATH_TEMPLATE = process.env.PATH_TEMPLATE || 'template'

// Настройки доступа к сервису формирования отчетов
export const REPORT_URL = process.env.REPORT_URL || '10.11.148.22:14000' || 'localhost:14000'
export const REPORT_API = process.env.REPORT_API || '/api/v1/template'
