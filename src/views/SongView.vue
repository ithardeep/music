<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)">
    </div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none" @click.prevent="saveAndPlaySong(song)">
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{song.modified_name}}</div>
        <div>{{song.genre}}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">   Comments({{song.comment_count}}) </span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div class="text-white text-center font-bolt p-4 mb-4" v-if="commentShowAlert"
        :class="commentVarient">
        {{commentAlertMessage}}
        </div>
        <vee-form :validation-schema="schema" @submit="createComment" v-if="hasAuthenticated">
          <vee-field name="comment" as="textarea"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."></vee-field>

             <VeeErrorMessage class="text-red-600" name="comment" />

          <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block"
           :disabled="commentInProgress">
            Submit
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded">
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li class="p-6 bg-gray-50 border border-gray-200"
    v-for="comment in getSortedComments" :key="comment.documentid">
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{comment.userName}}</div>
        <time>{{comment.datePosted}}</time>
      </div>

      <p>
        {{comment.comment}}
      </p>
    </li>
  </ul>
</template>

<script>
import { auth, songsCollection, commentCollection } from '@/plugins/firebase';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'SongView',
  data() {
    return {
      schema: {
        comment: 'required|min:10|max:200'
      },
      song: {},
      comments: [],
      sort: '1',
      commentInProgress: false,
      commentVarient: '',
      commentShowAlert: false,
      commentAlertMessage: ''
    };
  },
  async created() {
    const docSnapshot = await songsCollection.doc(this.$route.params.id).get();
    if (!docSnapshot.exists) {
      this.$router.push({ name: 'home' });
    }

    this.song = docSnapshot.data();

    this.getComments();

    const { sort } = this.$route.query;
    this.sort = sort === '1' || sort === '2' ? sort : '1';
  },
  computed: {
    ...mapState(['hasAuthenticated']),
    getSortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }

        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    }
  },
  methods: {
    ...mapActions(['saveAndPlaySong']),
    async getComments() {
      const snapshots = await commentCollection.where('songId', '==', this.$route.params.id).get();

      this.comments = [];

      snapshots.forEach(this.addComment);
    },

    async createComment(values, { resetForm }) {
      this.commentInProgress = true;
      this.commentShowAlert = true;
      this.commentVarient = 'bg-blue-500';
      this.commentAlertMessage = 'Please wait, your comment is being submitted';

      const comment = {
        uid: auth.currentUser.uid,
        songId: this.$route.params.id,
        userName: auth.currentUser.displayName,
        comment: values.comment,
        datePosted: new Date().toString()
      };

      try {
        // create a comment in the firebase collection
        const commentRef = await commentCollection.add(comment);

        // update comment count in the song collection
        let commentCount = this.song.comment_count;
        commentCount += 1;

        await songsCollection.doc(this.$route.params.id).update({
          comment_count: commentCount
        });

        const commentSnapshot = await commentRef.get();
        this.addComment(commentSnapshot);
        this.song.comment_count = commentCount;
      } catch (error) {
        this.commentInProgress = false;
        this.commentVarient = 'bg-red-500';
        this.commentAlertMessage = 'Something went wrong, please try again';
      }

      this.commentInProgress = false;
      this.commentVarient = 'bg-green-500';
      this.commentAlertMessage = 'Your comment has been added';

      // Now reset the form
      resetForm();
    },

    addComment(document) {
      this.comments.push({
        documentId: document.id,
        ...document.data()
      });
    }
  },
  watch: {
    sort(newValue) {
      if (newValue === this.$route.query.sort) {
        return;
      }

      this.$router.push({
        query: {
          sort: newValue
        }
      });
    }
  }
};
</script>
