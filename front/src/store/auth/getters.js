export function isAuthenticated (state) { return !!state.token }
export function getToken (state) { return state.token }
export function getUserId (state) { return state.userId }
export function getProfile (state) { return state.profile }
export function isAdmin (state) { return state.is_admin }
export function getUsersList (state) { return state.users }
