const routes = [
  {
    path: '/login',
    name: 'Авторизация',
    component: () => import('@pages/Authentication')
  },
  {
    path: '/logout',
    name: 'Выход',
    meta: { logout: true }
  }
]

export default routes
