import { Router } from 'express'
import { authUser } from '../../auth'
import authRoutes from './auth/routes'
import typeRoutes from './type/routes'
import fileRoutes from './file/routes'
import userRoutes from './user/routes'
import orgRoutes from './organization/routes'
import divRoutes from './division/routes'
import templateRoutes from './template/routes'
import outputFileRoutes from './output_file/routes'

const router = Router()

router.get('/', (req, res) => {
  res.status(200).send('Тест /api/v1')
})

router.get('/test', authUser, (req, res) => {
  res.status(200).send('Тест /api/v1/auth')
})

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/type', typeRoutes)
router.use('/file', fileRoutes)
router.use('/organization', orgRoutes)
router.use('/division', divRoutes)
router.use('/template', templateRoutes)
router.use('/output_file', outputFileRoutes)

export default router
