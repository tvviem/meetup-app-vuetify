<template>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-card-title>
              <h3 class="primary--text">My Meetup</h3>
            </v-card-title>
            <v-card-media
                      :src="require('@/assets/images/City_New_York.jpg')"
                      height="400px">
            </v-card-media>
            <v-card-text>
              <div class="info--text">17th July 2018 - Where to show event</div>
              <div>Blah blash, baby blood is a ghost at here. You will die, if you not more try</div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="primary">Register</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>
