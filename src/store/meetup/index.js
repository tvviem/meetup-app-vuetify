import firebase from 'firebase/app'
// import 'firebase/auth'

export default {
  state: {
    loadedMeetups: []
  },
  mutations: {
    setLoadedMeetups (state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    updateMeetup (state, payload) {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id
      })
      if (payload.title) {
        meetup.title = payload.title
      }
      if (payload.description) {
        meetup.description = payload.description
      }
      if (payload.date) {
        meetup.date = payload.date
      }
    },
    deleteMeetup (state, payload) {
      let removeIndex = state.loadedMeetups.map(meetup => {
        return meetup.id
      }).indexOf(payload.id)
      // const reloadMeetups = state.loadedMeetups.filter(meetup => meetup.id === payload)
      ~removeIndex && state.loadedMeetups.splice(removeIndex, 1)
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
      // let imageUrlTemp
      let key
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
        fileData.ref.getDownloadURL().then(function (imageUrl) {
          firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
          commit('createMeetup', {
            ...meetup,
            imageUrl: imageUrl,
            id: key
          })
        })
      })
      .catch(
        error => {
          console.log(error)
        }
      )
    },
    updateMeetupData ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      firebase.database().ref('meetups').child(payload.id).update(updateObj)
      .then(
        () => {
          commit('setLoading', false)
          commit('updateMeetup', payload)
        })
        .catch(
          error => {
            console.log(error)
            commit('setLoading', false)
          })
    },
    deleteMeetup ({commit}, payload) {
      commit('setLoading', true)
      // Remove Meetup info
      firebase.database().ref('meetups').child(payload.id).remove()
      .then(function () {
        var patt = /\.[0-9a-z]+\?/
        var strExtensionExtract = payload.imageUrl.match(patt)[0] // return ".jpg?"
        firebase.storage().ref('meetups/' + payload.id + strExtensionExtract.slice(0, -1)).delete()
        .then(function () { // Remove Image Storage success
          commit('setLoading', false)
          // Read users registrations
          firebase.database().ref('users').once('value')
          .then(data => {
            const obj = data.val()
            for (const key in obj) { // Search and remove registration info
              const objRegistrations = obj[key].registrations
              for (const key1 in objRegistrations) {
                if (objRegistrations[key1] === payload.id) {
                  firebase.database().ref('users/' + key + '/registrations').child(key1).remove()
                  .catch(errorWhenRemoveRegistrations => {
                    console.log(errorWhenRemoveRegistrations)
                    commit('setLoading', false)
                  })
                }
              }
            }
            commit('deleteMeetup', payload)
            commit('setLoading', false)
          })
        })
        .catch(function (errorWhenRemoveImage) {
          console.log(errorWhenRemoveImage)
          commit('setLoading', false)
        })
      })
      .catch(function (errorWhenRemoveMeetupInfo) {
        console.log(errorWhenRemoveMeetupInfo)
        commit('setLoading', false)
      })
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
    }
  }
}
