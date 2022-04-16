import { Notify } from 'quasar'

export function organizationListSuccess (state, data) {
  state.list = data.result
  if (!data.result.length) {
    Notify.create('Поиск в справочнике "Организации" не дал результатов!')
  }
}

export function setOrganization (state, organization) {
  state.selected = organization
}
