const routes = []

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    meta: { requiresAuth: true },
    component: () => import('@pages/Error404')
  })
}

export default routes
