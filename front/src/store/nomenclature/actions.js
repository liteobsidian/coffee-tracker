import axios from 'axios'
import { Notify } from 'quasar'

export async function addNomenclature ({ dispatch, commit }, payload) {
  try {
    const { data } = await axios({
      url: '/api/v1/nomenclature/add',
      method: 'post',
      data: { ...payload }
    })
    dispatch('listNomenclature', '')
    if (data) Notify.create({ message: 'Подразделение успешно добавлено', color: 'positive' })
  } catch (err) {
    console.error('Произошла ошибка при попытке добавить номенклатура', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function editNomenclature ({ dispatch, commit }, payload) {
  try {
    const { data } = await axios({
      url: '/api/v1/nomenclature/edit',
      method: 'put',
      data: { ...payload }
    })
    dispatch('listNomenclature', '')
    if (data) Notify.create({ message: `Подразделение ${payload.name} успешно изменено`, color: 'positive' })
  } catch (err) {
    console.error('Произошла ошибка при попытке изменить номенклатура', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function deleteNomenclature ({ dispatch, commit }, id) {
  try {
    const { data } = await axios({
      url: '/api/v1/nomenclature/',
      method: 'delete',
      params: { id }
    })
    dispatch('listNomenclature', '')
    if (data) Notify.create({ message: 'Подразделение удалено', color: 'positive' })
  } catch (err) {
    console.error('Произошла ошибка при попытке удалить номенклатура', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function listNomenclature ({ dispatch, commit }, query) {
  try {
    const { data } = await axios({
      url: '/api/v1/nomenclature/list',
      method: 'post',
      data: { query }
    })
    console.log('nomenclature list', data)
    commit('setNomenclatureList', data.list)
    // console.debug(`Пользователь ${data.nomenclature.name} успешно вошел в программу`)
    // await dispatch('nomenclatureProfile')
  } catch (err) {
    console.error('Произошла ошибка при попытке загрузить список нноменклатур', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}
