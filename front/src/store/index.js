import Vue from 'vue'
import Vuex from 'vuex'

// загрузка справочников
import auth from './auth'
import division from './division'
import nomenclature from './nomenclature'
import period from './period'
import loading from './loading'
import workday from './workday'

// import router from 'router'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      period,
      loading,
      division,
      nomenclature,
      workday
    },
    plugins: [],
    strict: process.env.DEV
  })

  return Store
}
