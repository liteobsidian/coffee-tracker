'use strict'
import { authUser } from '../../../auth'
import { Router } from 'express'
import api from './api'
import requestId from '../../../uuid.js'

const router = Router()

// Формирование и отправка сводного файла xlsx пользователю по всем организациям по типу отчета.
router.post('/', authUser, requestId, api.makeOutputFile)

export default router
