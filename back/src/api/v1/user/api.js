import { profileUser } from './controllers'

export default {
  async profile (req, res, next) {
    try {
      const profile = await profileUser(req.user)
      res.json({ sucess: true, message: 'Профиль пользователя успешно загружен', profile })
    } catch (err) {
      next(err)
    }
  }
}
