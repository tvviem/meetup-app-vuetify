import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [{
      imageUrl: require('@/assets/images/City_New_York.jpg'),
      id: 'saskdhkr126jhjasdah',
      title: 'Meetup in New York',
      date: '2017-07-20'
    },
    {
      imageUrl: require('@/assets/images/ParisOpera.jpg'),
      id: '37i64hdsmfsajdksfhd',
      title: 'Meetup in Paris',
      date: '2018-02-20'
    },
    {
      imageUrl: require('@/assets/images/PhoCoHoiAn.jpg'),
      id: 'teshg6546236w6347',
      title: 'Meetup in Quang Nam',
      date: '2018-05-29'
    }
    ],
    user: {
      id: 'admhfgahs7j1625v',
      registerMeetups: ['teshg6546236w6347']
    }
  },
  mutations: {

  },
  actions: {

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
