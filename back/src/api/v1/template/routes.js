'use strict'
import { authUser } from '../../../auth'
import { Router } from 'express'
import api from './api'

const router = Router()

// http://localhost:3000/api/v1/template/schema/1/2021-04-01
router.get('/schema/:type_report/:period', authUser, api.schema)

export default router
