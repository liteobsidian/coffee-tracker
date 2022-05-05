import { getListDB } from './db'

export const getList = async (data) => {
  try {
    return await getListDB(data)
  } catch (error) {
    return Promise.reject(error)
  }
}
