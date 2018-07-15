<template>
    <v-container fluid>
      <v-layout class="mt-4" v-show="loading">
        <v-flex xs12 class="text-xs-center secondary--text" >
            <v-progress-circular :indeterminate="true"
              v-if="loading"
            ></v-progress-circular>
        </v-flex>
      </v-layout>
      <v-layout row wrap v-show="!loading">
        <v-flex xs12 sm6 md8 offset-sm3 offset-md2 >
          <v-card class="primary--text">
            <v-card-title>Created Meetups</v-card-title>
            <v-list v-if="createdMeetups.length > 0">
              <template v-for="meetup in createdMeetups">
                <v-list-tile :key="meetup.id" @click="showMeetupDetail(meetup.id)">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="meetup.title"></v-list-tile-title>
                    <v-list-tile-sub-title> {{ meetup.date | date }} </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
            <v-list v-else>
              <v-list-tile>
                You have not created a meeting yet
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6 md8 offset-sm3 offset-md2>
          <v-card class="primary--text">
            <v-card-title>Registered Meetups</v-card-title>
            <v-list v-if="registeredMeetupsDetail.length">
              <template v-for="meetup in registeredMeetupsDetail">
                <v-list-tile :key="meetup.id" @click="showMeetupDetail(meetup.id)">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="meetup.title"></v-list-tile-title>
                    <v-list-tile-sub-title> {{ meetup.date | date }} </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
            <v-list v-else>
              <v-list-tile>
                You have not yet registered for a meeting
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
export default {
  methods: {
    showMeetupDetail (meetupId) {
      this.$router.push('/meetups/' + meetupId)
    }
  },
  computed: {
    createdMeetups () {
      return this.$store.getters.createdMeetups
    },
    registeredMeetupsDetail () {
      return this.$store.getters.registeredMeetupsDetail
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    this.$store.dispatch('fetchMeetupsCreatedByUser')
    this.$store.dispatch('fetchDetailRegisteredMeetups')
  }
}
</script>
