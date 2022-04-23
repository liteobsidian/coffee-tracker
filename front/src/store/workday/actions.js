import axios from 'axios'
import { Notify } from 'quasar'

export async function addWorkday ({ dispatch, commit }, payload) {
  try {
    const { data } = await axios({
      url: '/api/v1/workday/add',
      method: 'post',
      data: { ...payload }
    })
    dispatch('listWorkdays', '')
    if (data) Notify.create({ message: 'Смена успешно добавлена', color: 'positive' })
  } catch (err) {
    console.error('Произошла ошибка при попытке добавить смену', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function editWorkday ({ dispatch, commit }, payload) {
  try {
    const { data } = await axios({
      url: '/api/v1/workday/edit',
      method: 'put',
      data: { ...payload }
    })
    dispatch('listWorkdays', '')
    if (data) Notify.create({ message: 'Смена успешно изменена', color: 'positive' })
  } catch (err) {
    console.error('Произошла ошибка при попытке изменить смену', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function deleteWorkday ({ dispatch, commit }, id) {
  try {
    const { data } = await axios({
      url: '/api/v1/workday/',
      method: 'delete',
      params: { id }
    })
    dispatch('listWorkdays', '')
    if (data) Notify.create({ message: 'Смена удалена', color: 'positive' })
  } catch (err) {
    console.error('Произошла ошибка при попытке удалить смену', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function listWorkdays ({ dispatch, commit }, query) {
  try {
    const { data } = await axios({
      url: '/api/v1/workday/list',
      method: 'post',
      data: { query }
    })
    console.log('workdays list', data)
    commit('setWorkdaysList', data.list)
  } catch (err) {
    console.error('Произошла ошибка при попытке загрузить список смен', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function loadWorkdayByUser ({ commit }) {
  try {
    const { data } = await axios({
      url: '/api/v1/workday/get-by-user',
      method: 'get'
    })
    return data.list
  } catch (err) {
    console.error('Произошла ошибка при попытке загрузить смену', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}
