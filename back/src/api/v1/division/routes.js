'use strict'
import { Router } from 'express'
import { authUser } from '../../../auth'
import upload from '../../../multer'
import requestId from '../../../uuid.js'

const router = Router()
const api = require('./api')

router.post('/add', authUser, api.add)
router.put('/edit', authUser, api.edit)
router.delete('/', authUser, api.delete)
router.post('/list', authUser, api.list)

export default router
