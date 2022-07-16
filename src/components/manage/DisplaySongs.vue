<template>
<div class="border border-gray-200 p-3 mb-4 rounded">
              <div v-show="!showForm">
                <h4 class="inline-block text-2xl font-bold">{{song.modified_name}}</h4>
                <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
                @click.prevent="deleteSong">
                  <i class="fa fa-times"></i>
                </button>
                <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                @click.prevent="toggleForm">
                  <i class="fa fa-pencil-alt"></i>
                </button>
              </div>
              <div v-show="showForm">
                <div class="text-white text-center font-bold p-4 mb-4" v-if="showAlert"
                :class="alertVarient">
                {{alertMessage}}
                </div>
                <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
                  <div class="mb-3">
                    <label class="inline-block mb-2">Song Title</label>
                    <vee-field type="text" name="modified_name"
                      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                      placeholder="Enter Song Title" @input="updateUnsavedChangesFlag(true)" />

                     <VeeErrorMessage class="text-red-600" name="modified_name" />

                  </div>
                  <div class="mb-3">
                    <label class="inline-block mb-2">Genre</label>
                    <vee-field type="text" name="genre"
                      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                      placeholder="Enter Genre" @input="updateUnsavedChangesFlag(true)" />

                       <VeeErrorMessage class="text-red-600" name="genre" />
                  </div>
                  <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600"
                  :disabled="inProgress">
                    Submit
                  </button>
                  <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600 ml-3"
                  :disabled="inProgress" @click.prevent="toggleForm">
                    Close
                  </button>
                </vee-form>
              </div>
</div>
</template>

<script>
import { songsCollection, storage } from '@/plugins/firebase';

export default {
  name: 'DisplaySongs',
  props: {
    song: {
      type: Object,
      required: true
    },
    updateSong: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    removeSong: {
      type: Function,
      required: true
    },
    updateUnsavedChangesFlag: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      schema: {
        modified_name: 'required|max:100',
        genre: 'max:50|alpha_spaces'
      },
      showForm: false,
      inProgress: false,
      showAlert: false,
      alertMessage: '',
      alertVarient: 'bg-blue-500'
    };
  },
  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
    },
    async edit(values) {
      this.inProgress = true;
      this.showAlert = true;
      this.alertVarient = 'bg-blue-500';
      this.alertMessage = 'Please wait. your song is being updated.';

      try {
        await songsCollection.doc(this.song.documentId).update(values);
      } catch (error) {
        this.inProgress = false;
        this.alertVarient = 'bg-red-500';
        this.alertMessage = 'Something went wrong while processing the operation.';

        return;
      }

      this.updateSong(this.index, values);
      this.updateUnsavedChangesFlag(false);

      this.inProgress = false;
      this.alertVarient = 'bg-green-500';
      this.alertMessage = 'Success';
    },
    async deleteSong() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.original_name}`);

      // remove from firebase storage
      songRef.delete();

      // remove from firestore
      songsCollection.doc(this.song.documentId).delete();

      // remove from the list on the manage page
      this.removeSong(this.index);
    }
  }

};
</script>
