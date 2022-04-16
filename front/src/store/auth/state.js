import { LocalStorage } from 'quasar'

export default function () {
  return {
    token: LocalStorage.getItem('quasar-stat-user-token') || '',
    is_admin: LocalStorage.getItem('quasar-stat-is_admin') || false,
    userId: LocalStorage.getItem('quasar-stat-user-id') || 0,
    profile: LocalStorage.getItem('quasar-stat-profile') || {},
    users: []
  }
}
