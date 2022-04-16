export function show ({ dispatch }) {
  dispatch('setLoading', true)
}
export function hide ({ dispatch }) {
  dispatch('setLoading', false)
}

export function setLoading ({ commit }, payload = true) {
  commit('setLoading', !!payload)
}
