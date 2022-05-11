import { MAIN_MENU } from '@assets/menus'

const children = MAIN_MENU.map(el => {
  const props = {}
  if (el.type_report) props.typeReport = el.type_report
  console.log(el.page)
  return {
    name: el.title,
    label: el.label,
    path: el.path,
    component: () => {
      if (el.page === 'NomenclatureWorkPlace') return import('@pages/NomenclatureWorkPlace')
      if (el.page === 'UsersWorkPlace') return import('@pages/UsersWorkPlace')
      if (el.page === 'DivisionsWorkPlace') return import('@pages/DivisionsWorkPlace')
      if (el.page === 'WorkdaysWorkPlace') return import('@pages/WorkdaysWorkPlace')
      if (el.page === 'JobWorkPlace') return import('@pages/JobWorkPlace')
      if (el.page === 'StorageWorkPlace') return import('@pages/StorageWorkPlace')
      if (el.page === 'ReportsWorkPlace') return import('@pages/ReportsWorkPlace')
    },
    props
  }
})

const routes = [
  // {
  //   path: '/',
  //   name: 'Index',
  //   meta: { requiresAuth: true },
  //   redirect: '/users'
  // },
  {
    path: '/',
    meta: { requiresAuth: true },
    redirect: '/storage',
    component: () => import('@layouts/MainLayout'),
    children
  }
]

export default routes
