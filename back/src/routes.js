import { Router } from 'express'
import { API_PATH, API_VERSION } from './config'
import api from './api/v1/routes'

const router = Router()

router.use(`${API_PATH}/v${API_VERSION}`, api)

export default router
