import { addInventoryDB, editInventoryDB, deleteInventoryDB, getInventoryListDB, getInventoryDB } from './db'

export const getInventory = async ({ id }) => {
  try {
    const inventory = await getInventoryDB({ id })
    if (!inventory) throw new Error(`Ошибка загрузки инвентаризации с id: ${id}`)
    return inventory
  } catch (error) {
    return Promise.reject(error)
  }
}
export const addInventory = async ({ date, division_id, userId, nomenclature }) => {
  try {
    const inventory = await addInventoryDB({ date, division_id, userId, nomenclature })
    if (!inventory) throw new Error(`Ошибка при попытке внесения инвентаризации ${date}.`)
    console.log(inventory)
    return inventory
  } catch (error) {
    return Promise.reject(error)
  }
}
export const editInventory = async ({ id, date, division_id, userId, nomenclature }) => {
  try {
    const inventory = await editInventoryDB({ id, date, division_id, userId, nomenclature })
    if (!inventory) throw new Error(`Ошибка при попытке изменения инвентаризации ${date}.`)
    return inventory
  } catch (error) {
    return Promise.reject(error)
  }
}
export const deleteInventory = async ({ id }) => {
  try {
    const inventory = await deleteInventoryDB(id)
    if (!inventory) throw new Error('Ошибка при попытке удаления инвентаризации.')
    return inventory
  } catch (error) {
    return Promise.reject(error)
  }
}
export const getInventoryList = async (data) => {
  try {
    return await getInventoryListDB(data)
  } catch (error) {
    return Promise.reject(error)
  }
}
