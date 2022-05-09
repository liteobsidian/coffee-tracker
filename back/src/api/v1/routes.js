import { Router } from 'express'
import { authUser } from '../../auth'
import authRoutes from './auth/routes'
import divRoutes from './division/routes'
import nomRoutes from './nomenclature/routes'
import workRoutes from './workday/routes'
import inventoryRoutes from './inventory/routes'
import remainsRoutes from './remains/routes'
import requestRoutes from './request/routes'
import reportsRoutes from './reports/routes'

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
router.use('/remains', remainsRoutes)
router.use('/request', requestRoutes)
router.use('/reports', reportsRoutes)

export default router
