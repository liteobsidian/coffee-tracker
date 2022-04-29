import { Router } from 'express'
import { authUser } from '../../../auth'
import api from './api'

const router = Router()

router.get('/:id', authUser, api.get)
router.post('/add', authUser, api.add)
router.post('/list', authUser, api.divisions)
router.put('/edit', authUser, api.edit)
router.delete('/', authUser, api.delete)

export default router
