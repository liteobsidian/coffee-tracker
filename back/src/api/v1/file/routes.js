'use strict'
import { authUser } from '../../../auth'
import { Router } from 'express'
import upload from '../../../multer'
import api from './api'
import requestId from '../../../uuid.js'

const router = Router()

// Отдать ранее загруженный файл пользователю
router.get('/getfile/:uuid', authUser, api.sendfile)

// Получение протокола ошибок валидации данных по файлу
router.get('/protocol/:uuid', authUser, api.loadProtocol)

// Изменение статуса файла, ручное разрешение/запрет на отправку информации в вышестоящую систему
router.put('/status/:uuid', authUser, api.setStatusHandle)

// Перевалидировать ранее загруженные данные из файла (условие поле input_file.data != [] )
router.put('/revalidation/:uuid', authUser, api.revalidation)

// Загрузить в систему файл для проверки
router.post('/upload', authUser, requestId, upload.single('filename'), api.upload)

// Получить по организации список файлов для типа отчетности
// http://localhost:3000/api/v1/file/0/1?period_s=2021-04-01&period_e=2021-04-01
router.get('/:organization/:type_report/', authUser, api.list)

// Удалить ранее загруженный файл по его uuid
router.delete('/:uuid', authUser, api.deleteFile)

export default router
