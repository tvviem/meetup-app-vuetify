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
      imageUrl: 'https://wiki-travel.com.vn/Uploads/Picture/thanhhuong-160118040117-Halong-Bay.jpg',
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
              location: obj[key].location,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              date: obj[key].date,
              creatorId: obj[key].creatorId
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
    createMeetup ({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      let imageUrl, key
      firebase.database().ref('meetups').push(meetup)
      .then(
        data => {
          key = data.key
          return key
        })
      .then(key => { // Save image into Firebase Storage
        const filename = payload.image.name
        const ext = filename.slice(filename.lastIndexOf('.')) // include . character
        return firebase.storage().ref('meetups/' + key + ext).put(payload.image)
      })
      .then(fileData => { // Update downloadURL image as attribute of a meetup
        fileData.ref.getDownloadURL().then(imageUrl => {
          return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
        })
      })
      .then(() => {
        commit('createMeetup', {
          ...meetup,
          imageUrl: imageUrl,
          id: key
        })
      })
      .catch(
        error => {
          console.log(error)
        }
      )
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
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {id: payload.uid, registeredMeetups: []})
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
