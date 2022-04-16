import axios from 'axios'
import { Notify } from 'quasar'

export async function authRequest ({ dispatch, commit }, user) {
  try {
    const { data } = await axios({
      url: '/api/v1/auth',
      method: 'post',
      data: user
    })
    commit('authRequestSuccess', data)
    console.debug(`Пользователь ${data.user.name} успешно вошел в программу`)
    // await dispatch('authProfile')
  } catch (err) {
    console.error(`Произошла ошибка при попытке авторизоваться пользователю ${user.username} с паролем ${user.password}`, err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}
export async function addUser ({ dispatch, commit }, payload) {
  try {
    const { data } = await axios({
      url: '/api/v1/auth/add',
      method: 'post',
      data: { ...payload }
    })
    dispatch('listUsers', '')
    if (data) Notify.create({ message: 'Пользоватеь успешно добавлен', color: 'positive' })
    // console.debug(`Пользователь ${data.user.name} успешно вошел в программу`)
    // await dispatch('authProfile')
  } catch (err) {
    console.error('Произошла ошибка при попытке добавить пользователя', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function editUser ({ dispatch, commit }, payload) {
  try {
    const { data } = await axios({
      url: '/api/v1/auth/edit',
      method: 'put',
      data: { ...payload }
    })
    dispatch('listUsers', '')
    if (data) Notify.create({ message: `Пользователь ${payload.name} успешно изменён`, color: 'positive' })
    // console.debug(`Пользователь ${data.user.name} успешно вошел в программу`)
    // await dispatch('authProfile')
  } catch (err) {
    console.error('Произошла ошибка при попытке изменить пользователя', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function deleteUser ({ dispatch, commit }, id) {
  try {
    const { data } = await axios({
      url: '/api/v1/auth/',
      method: 'delete',
      params: { id }
    })
    dispatch('listUsers', '')
    if (data) Notify.create({ message: 'Пользователь удалён', color: 'positive' })
  } catch (err) {
    console.error('Произошла ошибка при попытке удалить пользователя', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function listUsers ({ dispatch, commit }, query) {
  try {
    const { data } = await axios({
      url: '/api/v1/auth/list',
      method: 'post',
      data: { query }
    })
    console.log('users list', data)
    commit('setUsersList', data.list)
    // console.debug(`Пользователь ${data.user.name} успешно вошел в программу`)
    // await dispatch('authProfile')
  } catch (err) {
    console.error('Произошла ошибка при попытке загрузить список пользователей', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}
export function authLogout ({ commit }) {
  commit('authLogout')
}
