import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import DateFilter from './filters/date'

import colors from 'vuetify/es5/util/colors'
// Format date to show
Vue.filter('date', DateFilter)

Vue.use(Vuetify, {
  theme: {
    primary: colors.purple.darken2,
    secondary: colors.grey.darken1,
    accent: colors.shades.black,
    error: colors.red.accent3
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
