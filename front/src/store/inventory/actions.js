import axios from 'axios'

export async function listInventory ({ commit }, query) {
  try {
    const { data } = await axios({
      url: '/api/v1/inventory/list',
      method: 'post',
      data: { query }
    })
    commit('setInventoryList', data.list)
  } catch (err) {
    console.error('Произошла ошибка при попытке загрузить список документов инвентаризации', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function addInventory ({ dispatch }, payload) {
  try {
    const { data } = await axios({
      url: '/api/v1/inventory/add',
      method: 'post',
      data: { ...payload }
    })
    await dispatch('listInventory')
    return data
  } catch (err) {
    console.error('Произошла ошибка при попытке добавить документ инвентаризации', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function updateInventory ({ dispatch }, payload) {
  try {
    const { data } = await axios({
      url: '/api/v1/inventory/edit',
      method: 'put',
      data: { ...payload }
    })
    await dispatch('listInventory')
    return data
  } catch (err) {
    console.error('Произошла ошибка при попытке изменить документ инвентаризации', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}

export async function deleteInventory ({ dispatch }, id) {
  try {
    const { data } = await axios({
      url: `/api/v1/inventory/${id}`,
      method: 'delete'
    })
    await dispatch('listInventory')
    return data
  } catch (err) {
    console.error('Произошла ошибка при попытке удалить документ инвентаризации', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}
