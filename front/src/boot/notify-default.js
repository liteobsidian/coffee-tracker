import { Notify } from 'quasar'

Notify.setDefaults({
  position: 'bottom-right',
  timeout: 1000,
  textColor: 'white',
  color: 'primary',
  actions: [{ icon: 'clear', color: 'white' }]
})
