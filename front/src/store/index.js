import Vue from 'vue'
import Vuex from 'vuex'

// загрузка справочников
import auth from './auth'
import division from './division'
import nomenclature from './nomenclature'
import organization from './organization'
import reports from './reports'
import period from './period'
import loading from './loading'
import dict from './dict'

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
      organization,
      reports,
      period,
      loading,
      dict,
      division,
      nomenclature
    },
    plugins: [],
    strict: process.env.DEV
  })

  return Store
}
