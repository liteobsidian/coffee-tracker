'use strict'
import { Router } from 'express'
import { authUser } from '../../../auth'

const router = Router()
const api = require('./api')

router.get('/', authUser, api.list)

export default router
