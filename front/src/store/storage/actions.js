import axios from 'axios'

export async function listRemains ({ commit }) {
  try {
    const { data } = await axios({
      url: '/api/v1/remains/list',
      method: 'get'
    })
    commit('setRemainsList', data.list)
  } catch (err) {
    console.error('Произошла ошибка при попытке загрузить список остатков', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}
