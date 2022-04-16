import { MAIN_MENU } from '@assets/menus'

const children = MAIN_MENU.map(el => {
  const props = {}
  if (el.type_report) props.typeReport = el.type_report
  console.log(el.page)
  return {
    name: el.title,
    path: el.path,
    component: () => {
      if (el.page === 'MainWorkPlace') return import('@pages/MainWorkPlace')
      if (el.page === 'UsersWorkPlace') return import('@pages/UsersWorkPlace')
      if (el.page === 'DivisionsWorkPlace') return import('@pages/DivisionsWorkPlace')
    },
    props
  }
})

const routes = [
  {
    path: '/',
    name: 'Index',
    meta: { requiresAuth: true },
    redirect: '/users'
  },
  {
    path: '/',
    meta: { requiresAuth: true },
    component: () => import('@layouts/MainLayout'),
    children: [
      ...children,
      {
        name: 'Панель администратора',
        path: 'dashboard',
        component: () => import('@pages/DashboardWorkPlace')
      }
    ]
  }
]

export default routes
