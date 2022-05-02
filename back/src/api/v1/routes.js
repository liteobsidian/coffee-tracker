import { Router } from 'express'
import { authUser } from '../../auth'
import authRoutes from './auth/routes'
import divRoutes from './division/routes'
import nomRoutes from './nomenclature/routes'
import workRoutes from './workday/routes'
import inventoryRoutes from './inventory/routes'

const router = Router()

router.get('/', (req, res) => {
  res.status(200).send('Тест /api/v1')
})

router.get('/test', authUser, (req, res) => {
  res.status(200).send('Тест /api/v1/auth')
})

router.use('/auth', authRoutes)
router.use('/division', divRoutes)
router.use('/nomenclature', nomRoutes)
router.use('/workday', workRoutes)
router.use('/inventory', inventoryRoutes)

export default router
