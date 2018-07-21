<template>
    <v-dialog persistent v-model="deleteDialog" max-width="290px">
        <v-btn fab accent slot="activator">
            <v-icon>delete_forever</v-icon>
        </v-btn>
      <v-card>
         <v-container>
            <v-layout row wrap>
               <v-flex xs12>
                  <v-card-title>Delete a meetup?</v-card-title>
               </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row wrap>
               <v-flex xs12>
                  <v-card-text>Are you sure you want to permanently delete this meetup?</v-card-text>
               </v-flex>
            </v-layout>
            <v-layout row wrap align-center justify-center>
               <v-flex xs12>
                  <v-card-actions>
							<div>
								<v-btn class="blue--text darken-4" flat 
                        	@click="deleteDialog=false">No</v-btn>
                     	<v-btn class="red--text darken-4" flat 
                        	@click="onYesSelect">Yes</v-btn>
							</div>
                  </v-card-actions>
               </v-flex>
            </v-layout>
         </v-container>
      </v-card>
   </v-dialog>
</template>

<script>
/* eslint-disable */
export default {
    props: ['meetup'],
    data () {
        return {
            deleteDialog: false
        }
    },
    methods: {
        onYesSelect () {
            this.$store.dispatch('deleteMeetup', this.meetup.id)
            this.deleteDialog = false
        }
    }
}
</script>
