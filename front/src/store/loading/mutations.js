import { Loading, QSpinnerBars } from 'quasar'

export function setLoading (state, payload) {
  state.isLoading = payload
  if (payload) {
    Loading.show({
      delay: 100,
      spinner: QSpinnerBars,
      spinnerColor: 'primary',
      backgroundColor: 'white'
    })
  } else {
    Loading.hide()
  }
}
