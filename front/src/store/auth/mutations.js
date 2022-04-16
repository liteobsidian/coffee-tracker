import axios from 'axios'
import { LocalStorage } from 'quasar'

export function authRequestSuccess (state, data) {
  const { token, userid, user } = data
  LocalStorage.set('quasar-stat-user-token', token)
  LocalStorage.set('quasar-stat-user-id', userid)
  LocalStorage.set('quasar-stat-profile', user)
  LocalStorage.set('quasar-stat-is_admin', user.is_admin)
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
  state.token = token
  state.userId = userid
  state.is_admin = user.is_admin
  state.profile = user
}
export function authRequestError (state) {
  state.token = ''
  state.is_admin = false
  LocalStorage.remove('quasar-stat-user-token')
  LocalStorage.remove('quasar-stat-user-type')
}
export function authLogout (state) {
  LocalStorage.remove('quasar-stat-user-token')
  LocalStorage.remove('quasar-stat-user-is_admin')
  LocalStorage.remove('quasar-stat-user-id')
  LocalStorage.remove('quasar-stat-profile')
  delete axios.defaults.headers.common.Authorization
  state.profile = {}
  state.token = ''
  state.is_admin = false
}
export function setUsersList (state, list) {
  state.users = list
}
