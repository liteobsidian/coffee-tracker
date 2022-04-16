'use strict'

import { Router } from 'express'

const router = Router()
const api = require('./api')
router.get('/', api.list)

export default router
