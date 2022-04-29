import { addDivisionDB, addDivisionNomenclatureDB, editDivisionDB, deleteDivisionDB, getDivisionsDB, getDivisionDB } from './db'

export const getDivision = async ({ id }) => {
  try {
    const division = await getDivisionDB({ id })
    if (!division) throw new Error(`Ошибка загрузки подразделения с id: ${id}`)
    return division
  } catch (error) {
    return Promise.reject(error)
  }
}
export const addDivision = async ({ name, address, city, factor, nomenclature }) => {
  try {
    const division = await addDivisionDB({ name, address, city, factor })
    if (!division) throw new Error(`Ошибка при попытке внесения подразделения ${name}.`)
    console.log(division)
    const nomenclatureAdd = await addDivisionNomenclatureDB(division.id, nomenclature)
    if (!division) throw new Error(`Ошибка при попытке внесения номенклатуры подразделения ${name}.`)
    console.log(nomenclatureAdd)
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
