<template>
    <v-dialog width="350px" persistent v-model="editDialog">
        <v-btn accent slot="activator"> Edit Date Time </v-btn>
        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex>
                        <v-card-title>
									        <h3>Edit meetup Date and Time</h3>
                        </v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap>
                    <v-flex>
                        <v-menu
                          :close-on-content-click="false"
                          v-model="menuDate"
                          :nudge-right="40"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          max-width="290px"
                          min-width="290px"
                        >
                        <v-text-field
                          slot="activator"
                          v-model="computedDateFormatted"
                          label="Meetup date (dd/MM/yyyy)"
                          persistent-hint
                          prepend-icon="event"
                          @blur="editableDate = parseDate(computedDateFormatted)"
                          readonly
                        ></v-text-field>
                        <v-date-picker v-model="editableDate" no-title @input="menuDate = false"></v-date-picker>
                       </v-menu>
                    </v-flex>
                    <v-flex>
                           <v-dialog
                           ref="dialogTime"
                           v-model="modalTime"
                           :return-value.sync="editableTime"
                           persistent
                           lazy
                           full-width
                           width="290px"
                           >
                           <v-text-field
                              slot="activator"
                              v-model="editableTime"
                              label="Meetup Time (24 hours)"
                              prepend-icon="access_time"
                              readonly
                           ></v-text-field>
                           <v-time-picker v-model="editableTime" format="24hr" actions>
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="modalTime = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="$refs.dialogTime.save(editableTime)">OK</v-btn>
                           </v-time-picker>
                        </v-dialog>
                    </v-flex>
                </v-layout>
            <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="blue darken-1" flat @click.native="editDialog = false">Close</v-btn>
               <v-btn color="blue darken-1" flat @click.native="onSaveChanges">Save</v-btn>
            </v-card-actions>
         </v-container>  
      </v-card>
    </v-dialog>
</template>

<script>
/* eslint-disable */
export default {
  props: ["meetup"],
  data() {
    return {
      editDialog: false,
      menuDate: false,
      editableDate: null,
      modalTime: false,
      editableTime: null
    };
  },
  methods: {
    onSaveChanges() {
      this.$store.dispatch("updateMeetupData", {
        id: this.meetup.id,
        date: this.submittableDateTimeToUpdated
      });
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null
      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
  },
  created() {
    //this.editableDate = new Date(this.meetup.date)
    const originDate = new Date(this.meetup.date)
    this.editableDate = originDate.getUTCFullYear() + "-" + (originDate.getUTCMonth() + 1) + "-" + originDate.getUTCDate();
    const originTime = originDate.toTimeString()
    const hours = originTime.match(/^(\d+)/)[1]
    const minutes = originTime.match(/:(\d+)/)[1]
    this.editableTime = hours + ':' + minutes
  },
  computed: {
    submittableDateTimeToUpdated () {
      return new Date(this.editableDate + ' ' + this.editableTime)
    },
    computedDateFormatted () {
      return this.formatDate(this.editableDate)
    }
  }
};
</script>
