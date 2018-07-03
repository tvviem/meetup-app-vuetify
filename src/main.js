import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import DateFilter from './filters/date'
import AlertComponent from './components/Shared/Alert'
import colors from 'vuetify/es5/util/colors'
import firebase from 'firebase'
// Format date to show
Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertComponent)

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
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyBwn6TLNn9txasDgegWYJFLwVWdeFVCpvQ',
      authDomain: 'meetupapp-4acd1.firebaseapp.com',
      databaseURL: 'https://meetupapp-4acd1.firebaseio.com',
      projectId: 'meetupapp-4acd1',
      storageBucket: 'meetupapp-4acd1.appspot.com',
      messagingSenderId: '48333877459'
    })
    this.$store.dispatch('loadMeetups')
  }
})
