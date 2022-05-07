import axios from 'axios'

export async function listRequest ({ commit }) {
  try {
    const { data } = await axios({
      url: '/api/v1/request/list',
      method: 'get'
    })
    commit('setRequestList', data.list)
  } catch (err) {
    console.error('Произошла ошибка при попытке загрузить список заявок', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function addRequest ({ dispatch }, payload) {
  try {
    const { data } = await axios({
      url: '/api/v1/request/add',
      method: 'post',
      data: { ...payload }
    })
    await dispatch('listRequest')
    return data
  } catch (err) {
    console.error('Произошла ошибка при попытке добавить заявку', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function updateRequest ({ dispatch }, payload) {
  try {
    const { data } = await axios({
      url: '/api/v1/request/edit',
      method: 'put',
      data: { ...payload }
    })
    await dispatch('listRequest')
    return data
  } catch (err) {
    console.error('Произошла ошибка при попытке изменить заявку', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function deleteRequest ({ dispatch }, id) {
  try {
    const { data } = await axios({
      url: `/api/v1/request/${id}`,
      method: 'delete'
    })
    await dispatch('listRequest')
    return data
  } catch (err) {
    console.error('Произошла ошибка при попытке удалить заявку', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function acceptRequest ({ dispatch }, id) {
  try {
    const { data } = await axios({
      url: '/api/v1/request/accept',
      method: 'put',
      data: { id }
    })
    await dispatch('listRequest')
    return data
  } catch (err) {
    console.error('Произошла ошибка при попытке подтвердить заявку', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}
