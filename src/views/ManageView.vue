<template>
    <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
            <manage-upload :addSong="addSong" />
        </div>
        <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <template v-if="songs.length > 0">
                <display-songs  v-for="(song, i) in songs" :key="song.documentId" :song="song"
                 :updateSong="updateSong"
                 :index="i"
                 :removeSong="removeSong"
                 :updateUnsavedChangesFlag="updateUnsavedChangesFlag" />
            </template>
          <div v-else class="text-center">
           No files to show
          </div>
        </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { songsCollection, auth } from '@/plugins/firebase';
import ManageUpload from '../components/manage/ManageUpload.vue';
import DisplaySongs from '../components/manage/DisplaySongs.vue';

export default {
  components: {
    ManageUpload,
    DisplaySongs
  },
  data() {
    return {
      songs: [],
      unsavedChanges: false
    };
  },
  async created() {
    const snapshots = await songsCollection.where('uid', '==', auth.currentUser.uid).get();
    snapshots.forEach(this.addSong);
  },
  methods: {
    addSong(document) {
      const song = {
        ...document.data(),
        documentId: document.id
      };

      this.songs.push(song);
    },
    updateSong(index, values) {
      this.songs[index].modified_name = values.modified_name;
      this.songs[index].genre = values.genre;
    },
    removeSong(index) {
      this.songs.splice(index, 1);
    },
    updateUnsavedChangesFlag(value) {
      this.unsavedChanges = value;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedChanges) {
      next();
    } else {
      // eslint-disable-next-line no-use-before-define, no-restricted-globals
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
      next(leave);
    }
  }
};
</script>
