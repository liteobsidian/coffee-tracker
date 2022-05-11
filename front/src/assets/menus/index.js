export const MAIN_MENU = [
  {
    title: 'Пользователи',
    label: 'Внесение/изменение пользователей',
    path: 'users',
    icon: 'people',
    page: 'UsersWorkPlace',
    roles: ['admin']
  },
  {
    title: 'Кофейни',
    label: 'Список торговых точек',
    path: 'divisions',
    icon: 'other_houses',
    page: 'DivisionsWorkPlace',
    roles: ['admin']
  },
  {
    title: 'Номенклатура',
    label: 'Список номенклатуры',
    path: 'nomenclature',
    icon: 'category',
    page: 'NomenclatureWorkPlace',
    roles: ['admin']
  },
  {
    title: 'График',
    label: 'Назначение смен сотрудникам',
    path: 'workdays',
    icon: 'edit_calendar',
    page: 'WorkdaysWorkPlace',
    roles: ['admin']
  },
  {
    title: 'Смена',
    label: 'Открытие/закрытие смены',
    path: 'job',
    icon: 'badge',
    page: 'JobWorkPlace',
    roles: ['user']
  },
  {
    title: 'Учет',
    label: 'Ведение складского учёта',
    path: 'storage',
    icon: 'storefront',
    page: 'StorageWorkPlace',
    roles: ['user', 'admin']
  },
  {
    title: 'Отчёты',
    label: 'Загрузка отчётов',
    path: 'report',
    icon: 'description',
    page: 'ReportsWorkPlace',
    roles: ['admin']
  }
  // ,
  // {
  //   title: 'Отчёт по ЗП',
  //   type_report: 1,
  //   label: 'Просмотр и загрузка отчётов по заработной плате',
  //   path: 'salary_report',
  //   icon: 'wallet',
  //   page: 'MainWorkPlace'
  // },
  // {
  //   title: 'Отчёт по чему-нибудь',
  //   type_report: 2,
  //   label: 'SOMEBODY WAS TOLD ME',
  //   path: 'somebody',
  //   icon: 'rocket',
  //   page: 'MainWorkPlace'
  // }
]
