import { Router } from 'express'
import { authUser } from '../../../auth'
import api from './api'

const router = Router()

router.get('/list', authUser, api.list)

export default router
