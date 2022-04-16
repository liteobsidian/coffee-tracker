import axios from 'axios'
import { Notify } from 'quasar'

export async function addDivision ({ dispatch, commit }, payload) {
  try {
    const { data } = await axios({
      url: '/api/v1/division/add',
      method: 'post',
      data: { ...payload }
    })
    dispatch('listDivisions', '')
    if (data) Notify.create({ message: 'Подразделение успешно добавлено', color: 'positive' })
  } catch (err) {
    console.error('Произошла ошибка при попытке добавить подразделение', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function editDivision ({ dispatch, commit }, payload) {
  try {
    const { data } = await axios({
      url: '/api/v1/division/edit',
      method: 'put',
      data: { ...payload }
    })
    dispatch('listDivisions', '')
    if (data) Notify.create({ message: `Подразделение ${payload.name} успешно изменено`, color: 'positive' })
  } catch (err) {
    console.error('Произошла ошибка при попытке изменить подразделение', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function deleteDivision ({ dispatch, commit }, id) {
  try {
    const { data } = await axios({
      url: '/api/v1/division/',
      method: 'delete',
      params: { id }
    })
    dispatch('listDivisions', '')
    if (data) Notify.create({ message: 'Подразделение удалено', color: 'positive' })
  } catch (err) {
    console.error('Произошла ошибка при попытке удалить подразделение', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function listDivisions ({ dispatch, commit }, query) {
  try {
    const { data } = await axios({
      url: '/api/v1/division/list',
      method: 'post',
      data: { query }
    })
    console.log('divisions list', data)
    commit('setDivisionsList', data.list)
    // console.debug(`Пользователь ${data.division.name} успешно вошел в программу`)
    // await dispatch('divisionProfile')
  } catch (err) {
    console.error('Произошла ошибка при попытке загрузить список подразделений', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}
