import firebase from 'firebase/app'
import 'firebase/auth'
import router from '../../router'

export default {
  state: {
    user: null,
    createdMeetups: []
  },
  mutations: {
    registerUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromMeetup (state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setUser (state, payload) {
      state.user = payload
    },
    setCreatedMeetups (state, payload) {
      state.createdMeetups = payload
    }
  },
  actions: {
    registerUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      firebase.database().ref('/users/' + user.id).child('/registrations/')
      .push(payload)
      .then(data => {
        commit('setLoading', false)
        commit('registerUserForMeetup', {id: payload, fbKey: data.key})
      })
      .catch(err => {
        console.log(err)
        commit('setLoading', false)
      })
    },
    unregisterUserFromMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
      .remove()
      .then(() => {
        commit('setLoading', false)
        commit('unregisterUserFromMeetup', payload)
      })
      .catch(err => {
        console.log(err)
        commit('setLoading', false)
      })
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
            registeredMeetups: [],
            fbKeys: {}
          }
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
            registeredMeetups: [],
            fbKeys: {}
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
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
      router.push('/')
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {
        id: payload.uid,
        registeredMeetups: [],
        fbKeys: {}
      })
    },
    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
      .then(data => {
        const dataPairs = data.val()
        let registeredMeetups = []
        let swappedPairs = {}
        for (let key in dataPairs) {
          registeredMeetups.push(dataPairs[key])
          swappedPairs[dataPairs[key]] = key
        }
        const updatedUser = {
          id: getters.user.id,
          registeredMeetups: registeredMeetups,
          fbKeys: swappedPairs
        }
        commit('setLoading', false)
        commit('setUser', updatedUser)
      })
      .catch(err => {
        console.log(err)
        commit('setLoading', false)
      })
    },
    fetchMeetupsCreatedByUser ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('meetups').once('value')
      .then(
        data => {
          const meetups = []
          const obj = data.val()
          for (const key in obj) {
            if (getters.user.id === obj[key].creatorId) {
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
          }
          commit('setCreatedMeetups', meetups)
          commit('setLoading', false)
        }
      )
      .catch(
        err => {
          console.log(err)
          commit('setLoading', true)
        }
      )
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    createdMeetups (state) {
      return state.createdMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    }
  }
}
