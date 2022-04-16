export function setReportsList (state, { items }) {
  state.list = items.sort((a, b) => { return new Date(b.created_at) - new Date(a.created_at) })
}

export function clearReportsList (state) {
  state.list = []
}
