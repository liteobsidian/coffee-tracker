import { addWorkdayDB, editWorkdayDB, deleteWorkdayDB, getWorkdaysDB, getUserWorkdayDB } from './db'

export const getUserWorkday = async (data) => {
  try {
    const item = await getUserWorkdayDB(data)
    return item
  } catch (error) {
    return Promise.reject(error)
  }
}
export const addWorkday = async ({ date, user_id, division_id, uncash_sum, cash_sum, date_open, date_close }) => {
  try {
    const workday = await addWorkdayDB({ date, user_id, division_id, uncash_sum, cash_sum, date_open, date_close })
    if (!workday) throw new Error(`Ошибка при попытке внесения смены ${date}.`)
    return workday
  } catch (error) {
    return Promise.reject(error)
  }
}
export const editWorkday = async ({ id, date, user_id, division_id, uncash_sum, cash_sum, date_open, date_close }) => {
  try {
    const workday = await editWorkdayDB({ id, date, user_id, division_id, uncash_sum, cash_sum, date_open, date_close })
    if (!workday) throw new Error(`Ошибка при попытке изменения смены ${date}.`)
    return workday
  } catch (error) {
    return Promise.reject(error)
  }
}
export const deleteWorkday = async ({ id }) => {
  try {
    const workday = await deleteWorkdayDB(id)
    if (!workday) throw new Error('Ошибка при попытке удаления смены.')
    return workday
  } catch (error) {
    return Promise.reject(error)
  }
}
export const getWorkdays = async (data) => {
  try {
    const list = await getWorkdaysDB(data)
    return list
  } catch (error) {
    return Promise.reject(error)
  }
}

