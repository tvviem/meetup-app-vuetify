import Vue from 'vue'
import Vuex from 'vuex'

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
    user: {
      id: 'admhfgahs7j1625v',
      registerMeetups: ['teshg6546236w6347']
    }
  },
  mutations: {
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    }
  },
  actions: {
    createMeetup ({commit}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date,
        id: 'asjdh76kh1987'
      }
      // reach out to firebase and store it, maybe later
      commit('createMeetup', meetup)
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
})
