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
import EditMeetupDetailsDialog from './components/Meetup/Edit/EditMeetupDetailsDialog'
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog'
import RegisterDialog from './components/Meetup/Registration/RegisterDialog'

// Format date to show
Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertComponent)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-meetup-register-dialog', RegisterDialog)

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
      storageBucket: 'gs://meetupapp-4acd1.appspot.com',
      messagingSenderId: '48333877459'
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) { // Kiem tra trang thai
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
    })
    this.$store.dispatch('loadMeetups')
  }
})
