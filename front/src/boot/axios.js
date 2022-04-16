import axios from 'axios'
import { LocalStorage } from 'quasar'

const token = LocalStorage.getItem('quasar-stat-user-token')

export default async () => {
  axios.defaults.headers.common.Accept = 'application/json'
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }
}
