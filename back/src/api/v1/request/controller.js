import { addRequestDB, editRequestDB, deleteRequestDB, getRequestListDB, acceptRequestDB, getNeedCountNomenclatureDB } from './db'

export const addRequest = async ({ date_create, division_id, userId, nomenclature }) => {
  try {
    const request = await addRequestDB({ date_create, division_id, userId, nomenclature })
    if (!request) throw new Error(`Ошибка при попытке внесения заявки ${date_create}.`)
    console.log(request)
    return request
  } catch (error) {
    return Promise.reject(error)
  }
}
export const editRequest = async ({ id, date_create, division_id, userId, is_accept, date_accept, nomenclature }) => {
  try {
    const request = await editRequestDB({ id, date_create, division_id, userId, is_accept, date_accept, nomenclature })
    if (!request) throw new Error(`Ошибка при попытке изменения заявки ${date_create}`)
    return request
  } catch (error) {
    return Promise.reject(error)
  }
}
export const acceptRequest = async ({ id }) => {
  try {
    const request = await acceptRequestDB({ id })
    if (!request) throw new Error(`Ошибка при попытке подтверждения заявки заявки ${id}`)
    return request
  } catch (error) {
    return Promise.reject(error)
  }
}
export const deleteRequest = async ({ id }) => {
  try {
    const request = await deleteRequestDB(id)
    if (!request) throw new Error('Ошибка при попытке удаления заявки.')
    return request
  } catch (error) {
    return Promise.reject(error)
  }
}
export const getRequestList = async (data) => {
  try {
    return await getRequestListDB(data)
  } catch (error) {
    return Promise.reject(error)
  }
}
export const getNeedCountNomenclature = async (data) => {
  try {
    return await getNeedCountNomenclatureDB(data)
  } catch (error) {
    return Promise.reject(error)
  }
}
