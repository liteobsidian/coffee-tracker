import axios from 'axios'

export async function reportsList ({ commit }, { organization, typeReport, periodStart, periodEnd }) {
  try {
    const params = {}
    if (periodStart) params.period_s = periodStart
    if (periodEnd) params.period_e = periodEnd
    const { data } = await axios({
      url: `/api/v1/file/${organization || 0}/${typeReport}`,
      method: 'get',
      params
    })
    commit('setReportsList', data)
    return data.items
  } catch (err) {
    console.error('Ошибка загрузки списка отчётов', err.message || err)
    commit('clearReportsList')
    return Promise.reject(err.response.data.message ? err : err.message)
  }
}
export async function uploadFile ({ rootGetters }, { file, typeReport, period = '' }) {
  try {
    const formData = new FormData()
    const organization = rootGetters['organization/getSelected'].id
    formData.append('organization', organization)
    formData.append('division', '')
    formData.append('type_report', typeReport)
    formData.append('period', period)
    formData.append('name', file.name)
    formData.append('filename', file)
    const { data } = await axios({
      url: '/api/v1/file/upload',
      method: 'post',
      data: formData
    })
    return data
  } catch (err) {
    console.error(err)
    throw new Error(err.response.data.message)
  }
}

export async function deleteFile (store, uuid) {
  try {
    const { data } = await axios({
      url: `/api/v1/file/${uuid}`,
      method: 'delete'
    })
    return data
  } catch (err) {
    console.error(err)
    throw new Error(err.response.data.message)
  }
}

export async function getOriginalFile (store, uuid) {
  try {
    const { data } = await axios({
      url: `/api/v1/file/getfile/${uuid}`,
      method: 'get',
      responseType: 'blob'
    })
    return data
  } catch (err) {
    console.error(err)
    throw new Error(err.response.data.message)
  }
}

export async function getProtocolFile (store, uuid) {
  try {
    const { data } = await axios({
      url: `/api/v1/file/protocol/${uuid}`,
      method: 'get',
      responseType: 'blob'
    })
    return data
  } catch (err) {
    console.error(err)
    throw new Error(err.response.data.message)
  }
}

export async function changeStatus (store, uuid) {
  try {
    const { data } = await axios({
      url: `/api/v1/file/status/${uuid}`,
      method: 'put'
    })
    return data
  } catch (err) {
    console.error(err)
    throw new Error(err.response.data.message)
  }
}

export async function getFullReportFile (store, { typeReport = 0, period = null }) {
  try {
    const data = await axios({
      url: '/api/v1/output_file',
      method: 'post',
      data: { type_report: typeReport, period },
      responseType: 'blob'
    })
    return data
  } catch (err) {
    console.error(err)
    throw new Error(err.response.data.message)
  }
}

export async function revalidationFile (store, uuid) {
  try {
    const { data } = await axios({
      url: `/api/v1/file/revalidation/${uuid}`,
      method: 'put'
    })
    return data
  } catch (err) {
    console.error(err)
    throw new Error(err.response.data.message)
  }
}
