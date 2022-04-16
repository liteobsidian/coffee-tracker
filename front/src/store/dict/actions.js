import axios from 'axios'

export async function organizationUpload ({ rootGetters }, { file, period = '' }) {
  try {
    if (!period) throw new Error('Не задан период действия справочника организаций')
    const formData = new FormData()
    formData.append('period', period)
    formData.append('name', file.name)
    formData.append('filename', file)
    const { data } = await axios({
      url: '/api/v1/organization/upload/organization',
      method: 'post',
      data: formData
    })
    return data
  } catch (err) {
    console.error(err)
    throw new Error(err.response.data.message)
  }
}

export async function divisionUpload ({ rootGetters }, { file, period = '' }) {
  try {
    if (!period) throw new Error('Не задан период действия справочника подразделений')
    const formData = new FormData()
    formData.append('period', period)
    formData.append('name', file.name)
    formData.append('filename', file)
    const { data } = await axios({
      url: '/api/v1/division/upload/division',
      method: 'post',
      data: formData
    })
    return data
  } catch (err) {
    console.error(err)
    throw new Error(err.response.data.message)
  }
}
