import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [{
      imageUrl: require('@/assets/images/City_New_York.jpg'),
      id: 'saskdhkr126jhjasdah',
      title: 'Meetup in New York',
      date: new Date(),
      location: 'New York',
      description: 'New York is beautify city'
    },
    {
      imageUrl: require('@/assets/images/ParisOpera.jpg'),
      id: '37i64hdsmfsajdksfhd',
      title: 'Meetup in Paris',
      date: new Date(),
      location: 'Paris',
      description: 'Paris luxury'
    },
    {
      imageUrl: require('@/assets/images/PhoCoHoiAn.jpg'),
      id: 'teshg6546236w6347',
      title: 'Meetup in Quang Nam',
      date: new Date(),
      location: 'Quãng Nam - Đà Nẵng',
      description: 'Phố cỗ Hội An'
    }
    ],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setLoadedMeetups (state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    loadMeetups ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('meetups').once('value')
      .then(
        data => {
          const meetups = []
          const obj = data.val()
          for (const key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              date: obj[key].date
            })
          }
          commit('setLoadedMeetups', meetups)
          commit('setLoading', false)
        }
      )
      .catch(
        err => {
          console.log(err)
          commit('setLoading', true)
        }
      )
    },
    createMeetup ({commit}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date.toISOString()
      }
      firebase.database().ref('meetups').push(meetup)
      .then(
        data => {
          const key = data.key
          commit('createMeetup', {
            ...meetup,
            id: key
          })
        })
      .catch(
        error => {
          console.log(error)
        }
      )
      // reach out to firebase and store it, maybe later
      // commit('createMeetup', meetup)
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(
        (userFromFireBase) => {
          commit('setLoading', false)
          const newUser = {
            id: userFromFireBase.user.uid,
            registeredMeetups: []
          }
          console.log('debug uid: ' + newUser.id)
          commit('setUser', newUser)
        })
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        }
      )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        (user) => {
          commit('setLoading', false)
          const userInfo = {
            id: user.user.uid,
            registeredMeetups: []
          }
          commit('setUser', userInfo)
        }
      )
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        }
      )
    },
    clearError ({commit}) {
      commit('clearError')
    }
  },
  getters: {
    loadedMeetups (state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    loadedMeetup (state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    },
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
})
