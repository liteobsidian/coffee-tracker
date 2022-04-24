import { Router } from 'express'
import { authUser } from '../../../auth'
import api from './api'

const router = Router()

router.get('/get-by-user', authUser, api.get)
router.post('/add', authUser, api.add)
router.post('/list', authUser, api.workdays)
router.put('/edit', authUser, api.edit)
router.delete('/', authUser, api.delete)
router.post('/start-job', authUser, api.start)

export default router
