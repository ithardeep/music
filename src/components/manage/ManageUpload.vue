<template>
  <div class="col-span-1">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">Upload</span>
            <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Upload Dropbox -->
            <div
              class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
                :class="{ 'bg-green-400 border-green-400 border-solid' : is_dragOver }"
                @drag.prevent.stop=""
                @dragstart.prevent.stop=""
                @dragend.prevent.stop="is_dragOver = false"
                @dragover.prevent.stop="is_dragOver = true"
                @dragenter.prevent.stop="is_dragOver = true"
                @dragleave.prevent.stop="is_dragOver = false"
                @drop.prevent.stop="upload($event)"
                >
              <h5>Drop your files here</h5>
            </div>
            <input type="file" multiple @change="upload($event)" />
            <hr class="my-6" />
            <!-- Progess Bars -->
            <div class="mb-4" v-for="(upload, index) in uploads" :key="index">
              <!-- File Name -->
              <div class="font-bold text-sm" :class="upload.text_color">
                <i :class="upload.font_icon"></i>
                {{ upload.name}}
                </div>
              <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                <!-- Inner Progress Bar -->
                <div class="transition-all progress-bar" :class="upload.varient"
                :style="{width: upload.current_progress + '%'}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
import { auth, storage, songsCollection } from '@/plugins/firebase';

export default {
  name: 'ManageUpload',
  props: {
    addSong: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      is_dragOver: false,
      uploads: []
    };
  },
  methods: {
    upload($event) {
      this.is_dragOver = false;

      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];

      const storageRef = storage.ref();
      files.forEach((file) => {
        // if (file.type !== 'audio/mpeg') { return; }

        const songsRef = storageRef.child(`songs/${file.name}`);
        const task = songsRef.put(file);

        // Saving the task into an array
        const uploadIndex = this.uploads.push({
          task,
          current_progress: 0,
          name: file.name,
          font_icon: '',
          varient: 'bg-blue-400',
          text_color: ''
        }) - 1;

        task.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const upload = this.uploads[uploadIndex];
            upload.current_progress = progress;
            upload.font_icon = 'fas fa-spinner fa-spin';
          },
          () => {
            const upload = this.uploads[uploadIndex];
            upload.varient = 'bg-red-400';
            upload.font_icon = 'fas fa-times';
            upload.text_color = 'text-red-400';
          },
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0
            };

            song.url = await task.snapshot.ref.getDownloadURL();
            const songRef = await songsCollection.add(song);
            const songSnapshot = await songRef.get();

            this.addSong(songSnapshot);

            const upload = this.uploads[uploadIndex];
            upload.varient = 'bg-green-400';
            upload.font_icon = 'fas fa-check';
            upload.text_color = 'text-green-400';
          }
        );
      });
    }
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  }
};
</script>
