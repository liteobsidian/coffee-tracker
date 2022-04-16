import { Router } from 'express'
import { authUser } from '../../../auth'
import api from './api'

const router = Router()

router.post('/', api.login)
router.post('/add', authUser, api.add)
router.put('/edit', authUser, api.edit)
router.delete('/', authUser, api.delete)
router.post('/list', authUser, api.list)

export default router
