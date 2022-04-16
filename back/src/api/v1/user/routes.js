'use strict'
import { Router } from 'express'
import { authUser } from '../../../auth'
import api from './api'

const router = Router()
router.post('/profile', authUser, api.profile)

export default router
