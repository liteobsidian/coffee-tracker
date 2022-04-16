'use strict'

import { Router } from 'express'
import { authUser } from '../../../auth'
import upload from '../../../multer'
import requestId from '../../../uuid.js'
const api = require('./api')

const router = Router()

// Загрузить в систему справочник организаций
router.post('/upload/:name_dict', authUser, requestId, upload.single('filename'), api.upload)
router.get('/oid', authUser, api.listOid)
router.get('/:wd', authUser, api.findByWord)
router.get('/', authUser, api.list)

export default router
