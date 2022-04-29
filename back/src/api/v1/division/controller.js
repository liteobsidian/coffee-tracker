import { addDivisionDB, editDivisionDB, deleteDivisionDB, getDivisionsDB } from './db'

export const addDivision = async ({ name, address, city, factor, nomenclature }) => {
  try {
    const division = await addDivisionDB({ name, address, city, factor, nomenclature })
    if (!division) throw new Error(`Ошибка при попытке внесения подразделения ${name}.`)
    return division
  } catch (error) {
    return Promise.reject(error)
  }
}
export const editDivision = async ({ id, name, address, city, factor, nomenclature }) => {
  try {
    const division = await editDivisionDB({ id, name, address, city, factor, nomenclature })
    if (!division) throw new Error(`Ошибка при попытке изменения подразделения ${name}.`)
    return division
  } catch (error) {
    return Promise.reject(error)
  }
}
export const deleteDivision = async ({ id }) => {
  try {
    const division = await deleteDivisionDB(id)
    if (!division) throw new Error('Ошибка при попытке удаления подразделения.')
    return division
  } catch (error) {
    return Promise.reject(error)
  }
}
export const getDivisions = async (data) => {
  try {
    const list = await getDivisionsDB(data)
    return list
  } catch (error) {
    return Promise.reject(error)
  }
}
