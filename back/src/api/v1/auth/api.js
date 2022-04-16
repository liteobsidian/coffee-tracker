import { loginUser, addUser, editUser, deleteUser, getUsers } from './controllers'

export default {
  async login (req, res, next) {
    try {
      const { user, token } = await loginUser(req.body)
      res.json({ success: true, message: 'Успешная авторизация!', token, type: user.type, userid: user.id, user })
    } catch (err) {
      next(err)
    }
  },
  async add (req, res, next) {
    try {
      const user = await addUser(req.body)
      res.json({ success: true, message: 'Пользователь успешно добавлен!', userid: user.id })
    } catch (err) {
      next(err)
    }
  },
  async edit (req, res, next) {
    try {
      const user = await editUser(req.body)
      res.json({ success: true, message: 'Пользователь успешно изменён!', userid: user.id })
    } catch (err) {
      next(err)
    }
  },
  async delete (req, res, next) {
    try {
      const user = await deleteUser(req.query)
      res.json({ success: true, message: 'Пользователь успешно удалён!', userid: user.id })
    } catch (err) {
      next(err)
    }
  },
  async list (req, res, next) {
    try {
      const list = await getUsers(req.body)
      res.json({ success: true, message: 'Список пользователей успешно получен', list })
    } catch (err) {
      next(err)
    }
  }
}
