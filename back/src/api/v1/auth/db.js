import db from '@db'
import { GET, ADD, EDIT, DELETE, LIST } from './sql'

export const getUser = async ({ username = null }) => {
  try {
    if (!username) throw new Error(`Отсутствует информация о пользователе ${username}`)
    const { rowCount, rows } = await db.query(GET,
      [username]
    )
    if (!rowCount) throw new Error(`Ошибка при попытке авторизации пользователя ${username} . Пользователь не найден в БД`)
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const addUserDB = async ({ name, login, hash, is_admin = false }) => {
  try {
    if (!login) throw new Error(`Отсутствует информация о пользователе ${name}`)
    if (!hash) throw new Error(`Отсутствует информация о пользователе ${name}`)
    const { rowCount, rows } = await db.query(ADD,
      [name, login, hash, is_admin]
    )
    console.log(rows)
    if (!rowCount) throw new Error(`Ошибка при внесении пользователя ${name}.`)
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const editUserDB = async ({ id, name, login, hash, is_admin = false }) => {
  try {
    if (!login) throw new Error(`Отсутствует информация о пользователе ${name}`)
    if (!hash) throw new Error(`Отсутствует информация о пользователе ${name}`)
    const { rowCount, rows } = await db.query(EDIT,
      [id, name, login, hash, is_admin]
    )
    console.log(rows)
    if (!rowCount) throw new Error(`Ошибка при изменении пользователя ${name}.`)
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const deleteUserDB = async (id) => {
  try {
    if (!id) throw new Error('Отсутствует id пользователя')
    const { rowCount, rows } = await db.query(DELETE,
      [id]
    )
    console.log(rows)
    if (!rowCount) throw new Error('Ошибка при удалении пользователя')
    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}
export const getUsersDB = async ({ query = '' }) => {
  try {
    const { rowCount, rows } = await db.query(LIST,
      [query]
    )
    console.log(rows)
    if (!rowCount) throw new Error('Ошибка загрузки списка пользователей пользователей.')
    return rows
  } catch (error) {
    return Promise.reject(error)
  }
}
