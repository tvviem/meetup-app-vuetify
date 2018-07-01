<template>
    <v-container fluid>
      <v-layout row>
        <v-flex xs12 sm8 md8 offset-sm2 offset-md2>
          <h2 class="secondary--text">Create a new meetup</h2>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12 sm8 md8 offset-sm2 offset-md2>
          <form @submit.prevent="onCreateMeetup">
            <v-layout row>
              <v-flex>
                <v-text-field name="title" label="Title" id="title" required 
                  v-model="title"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-text-field name="location" label="Location" id="location" required
                  v-model="location"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-text-field name="imageUrl" label="Image URL" id="image-url" required
                  v-model="imageUrl"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <img :src="imageUrl" height="160">
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-text-field name="description" label="Description" id="description" multi-line required
                  v-model="description"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <h2>Choose a Date and Time</h2>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex>
                <v-dialog
                  ref="dialogDay"
                  v-model="modalDateDialog"
                  :return-value.sync="date"
                  persistent
                  lazy
                  full-width
                  width="290px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="dateFormatted"
                    label="Picker in dialog"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model="date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="modalDateDialog = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.dialogDay.save(date)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-flex>
              <v-flex>
                <v-dialog
                  ref="dialogTime"
                  v-model="modalTimeDialog"
                  :return-value.sync="time"
                  persistent
                  lazy
                  full-width
                  width="290px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="time"
                    label="Picker in dialog"
                    prepend-icon="access_time"
                    readonly
                  ></v-text-field>
                  <v-time-picker v-model="time" actions>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="modalTimeDialog = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.dialogTime.save(time)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-btn class="primary" :disabled="!formIsValid" type="submit">create meetup</v-btn>
                <p> {{ submittableDateTime }} </p>
              </v-flex>
            </v-layout>
          </form>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      location: '',
      imageUrl: '',
      description: '',
      date: null,
      dateFormatted: null,
      time: null,
      modalDateDialog: false,
      modalTimeDialog: false
    }
  },
  computed: {
    formIsValid () {
      return this.title !== '' &&
            this.location !== '' &&
            this.imageUrl !== '' &&
            this.description !== ''
    },
    submittableDateTime () {
      return new Date(this.date + ' ' + this.time)
    }
  },
  methods: {
    onCreateMeetup () {
      if (!this.formIsValid) {
        return
      }
      const meetupData = {
        title: this.title,
        location: this.location,
        imageUrl: this.imageUrl,
        description: this.description,
        date: this.submittableDateTime
      }
      this.$store.dispatch('createMeetup', meetupData)
      this.$router.push('/meetups')
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  },
  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
    }
  }
}
</script>
