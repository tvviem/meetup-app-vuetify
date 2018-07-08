<template>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 md8 offset-sm3 offset-md2>
          <v-card class="primary--text">
            <v-card-title>Your Meetups</v-card-title>
            <v-list>
              <template v-for="meetup in ownMeetups">
                <v-list-tile :key="meetup.id" @click="showMeetupDetail(meetup.id)">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="meetup.title"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="meetup.description"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
export default {
  props: ['meetup'],
  data () {
    return {
      ownMeetups: [
        {
          id: '-LG_gjh6r5o3PdEeO7gv',
          title: 'Brunch this weekend?',
          date: '2018-8-8',
          description: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        {
          id: '-LGkAB3kAxcPuiCqUuLS',
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          date: '2018-8-8',
          description: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
        },
        {
          id: '-LGrVeW-H6f3nCGqB8md',
          title: 'Oui oui',
          date: '2018-8-8',
          description: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
        }
      ]
    }
  },
  methods: {
    showMeetupDetail (meetupId) {
      this.$router.push('/meetups/' + meetupId)
    }
  }
}
</script>
