import { Router } from 'express'
import { authUser } from '../../../auth'
import api from './api'

const router = Router()

router.get('/list', authUser, api.requestList)
router.post('/add', authUser, api.add)
router.put('/edit', authUser, api.edit)
router.put('/accept', authUser, api.accept)
router.delete('/:id', authUser, api.delete)

export default router
