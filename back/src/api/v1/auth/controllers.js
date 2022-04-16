import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../../../config'
const { getUser, addUserDB, editUserDB, deleteUserDB, getUsersDB } = require('./db')

export const loginUser = async data => {
  try {
    const user = await getUser(data)
    const checkPwd = await bcrypt.compare(data.password, user.password)
    if (!checkPwd) throw new Error(`Ошибка при попытке авторизации пользователя ${data.username}. Неверный пароль`)
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        organization: user.organization
      },
      SECRET_KEY,
      {
        expiresIn: '100h'
      }
    )
    return { user, token }
  } catch (error) {
    return Promise.reject(error)
  }
}
export const addUser = async ({ name, login, password, is_admin }) => {
  try {
    const salt = bcrypt.genSaltSync(10)
    const hash = await bcrypt.hashSync(password, salt)
    const user = await addUserDB({ name, login, hash, is_admin })
    if (!user) throw new Error(`Ошибка при попытке внесения пользователя ${name}.`)
    return user
  } catch (error) {
    return Promise.reject(error)
  }
}
export const editUser = async ({ id, name, login, password, is_admin }) => {
  try {
    const salt = bcrypt.genSaltSync(10)
    const hash = await bcrypt.hashSync(password, salt)
    const user = await editUserDB({ id, name, login, hash, is_admin })
    if (!user) throw new Error(`Ошибка при попытке изменения пользователя ${name}.`)
    return user
  } catch (error) {
    return Promise.reject(error)
  }
}
export const deleteUser = async ({ id }) => {
  try {
    const user = await deleteUserDB(id)
    if (!user) throw new Error('Ошибка при попытке удаления пользователя.')
    return user
  } catch (error) {
    return Promise.reject(error)
  }
}
export const getUsers = async (data) => {
  try {
    const list = await getUsersDB(data)
    return list
  } catch (error) {
    return Promise.reject(error)
  }
}
