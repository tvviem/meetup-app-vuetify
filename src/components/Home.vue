<template>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 sm6 class="text-xs-center text-sm-right">
          <v-btn large router to="/meetups" class="info">Explorer Meetups</v-btn>
        </v-flex>
        <v-flex xs12 sm6 class="text-xs-center text-sm-left">
          <v-btn large router to="/meetup/new" class="info">Organize Meetups</v-btn>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="mt-2">
        <v-flex xs12 class="text-xs-center">
          <v-carousel>
            <v-carousel-item 
              v-for="meetup in meetups" 
              :src="meetup.imageUrl" 
              :key="meetup.id">
              <div class="title">
                {{ meetup.title }}
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="mt-2">
        <v-flex xs12 class="text-xs-center">
          <p>Join our awesome meetups</p>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
export default {
  data () {
    return {
      meetups: [
        {
          imageUrl: require('@/assets/images/City_New_York.jpg'), id: 'saskdhkr126jhjasdah', title: 'Meetup in New York'
        },
        {
          imageUrl: require('@/assets/images/ParisOpera.jpg'), id: '37i64hdsmfsajdksfhd', title: 'Meetup in Paris'
        },
        {
          imageUrl: require('@/assets/images/PhoCoHoiAn.jpg'), id: 'teshg6546236w6347', title: 'Meetup in Quang Nam'
        }
      ]
    }
  }
}
</script>

<style scoped>
.title {
  background-color: rgba(0,0,0,0.4);
  color: white;
  padding: 20px;
  font-size: 2em;
}
</style>
