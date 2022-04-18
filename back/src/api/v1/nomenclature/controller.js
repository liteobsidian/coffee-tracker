import { addNomenclatureDB, editNomenclatureDB, deleteNomenclatureDB, getNomenclatureDB } from './db'

export const addNomenclature = async ({ name, unit, lot_value, min_count, max_count, cost, is_perishable }) => {
  try {
    const nomenclature = await addNomenclatureDB({ name, unit, lot_value, min_count, max_count, cost, is_perishable })
    if (!nomenclature) throw new Error(`Ошибка при попытке внесения номенклатуры ${name}.`)
    return nomenclature
  } catch (error) {
    return Promise.reject(error)
  }
}
export const editNomenclature = async ({ id, name, unit, lot_value, min_count, max_count, cost, is_perishable }) => {
  try {
    const nomenclature = await editNomenclatureDB({ id, name, unit, lot_value, min_count, max_count, cost, is_perishable })
    if (!nomenclature) throw new Error(`Ошибка при попытке изменения номенклатуры ${name}.`)
    return nomenclature
  } catch (error) {
    return Promise.reject(error)
  }
}
export const deleteNomenclature = async ({ id }) => {
  try {
    const nomenclature = await deleteNomenclatureDB(id)
    if (!nomenclature) throw new Error('Ошибка при попытке удаления номенклатуры.')
    return nomenclature
  } catch (error) {
    return Promise.reject(error)
  }
}
export const getNomenclature = async (data) => {
  try {
    const list = await getNomenclatureDB(data)
    return list
  } catch (error) {
    return Promise.reject(error)
  }
}
