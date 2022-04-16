import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ({ store /* ssrContext */ }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,
    mode: 'hash'

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
  })

  Router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth) && !store.getters['auth/isAuthenticated']) {
      next('/login')
    } else if (to.matched.some(record => record.meta.logout) && store.getters['auth/isAuthenticated']) {
      store.dispatch('auth/authLogout')
      next('/login')
    } else {
      next()
    }
  })

  return Router
}
// export default new VueRouter({
//   scrollBehavior: () => ({ x: 0, y: 0 }),
//   mode: 'hash',
//   routes
//
//   // Leave these as is and change from quasar.conf.js instead!
//   // quasar.conf.js -> build -> vueRouterMode
//   // quasar.conf.js -> build -> publicPath
//   // mode: process.env.VUE_ROUTER_MODE,
//   // base: process.env.VUE_ROUTER_BASE
// })
