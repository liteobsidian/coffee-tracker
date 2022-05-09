import { Router } from 'express'
import { authUser } from '../../../auth'
import api from './api'

const router = Router()

router.post('/', authUser, api.list)

export default router
