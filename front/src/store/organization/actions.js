import axios from 'axios'

export async function organizationList ({ commit }, query) {
  try {
    const { data } = await axios({
      url: `/api/v1/organization/${query || ''}`,
      method: 'get'
    })
    commit('organizationListSuccess', data)
    return data
  } catch (err) {
    console.error('Произошла ошибка при попытке загрузить список организаций', err)
  }
}

export function setOrganization ({ commit }, organization = { id: '0', name: '', full_name: '', short_name: '' }) {
  commit('setOrganization', organization)
}
