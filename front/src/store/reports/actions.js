import axios from 'axios'

export async function getReport ({ commit }, { method, dateStart, dateEnd, description, head }) {
  try {
    const { data } = await axios({
      url: '/api/v1/reports',
      method: 'post',
      data: {
        method,
        dateStart,
        dateEnd,
        description,
        head
      },
      responseType: 'blob'
    })
    const url = URL.createObjectURL(data)
    console.log(url)
    window.open(url, '_blank')
    return data
  } catch (err) {
    console.error('Произошла ошибка при попытке загрузить отчёт', err.message || err)
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}
