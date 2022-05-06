import { Router } from 'express'
import { authUser } from '../../../auth'
import api from './api'

const router = Router()

router.delete('/:id', authUser, api.delete)
router.get('/:id', authUser, api.get)
router.post('/add', authUser, api.add)
router.post('/list', authUser, api.inventoryList)
router.put('/edit', authUser, api.edit)

export default router
