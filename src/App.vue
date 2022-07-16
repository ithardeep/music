<template>

  <app-header />

  <router-view></router-view>

  <!-- Player -->
  <app-player />

  <!-- Auth Modal -->
  <app-auth />

</template>

<script>

import AppAuth from './components/AppAuth.vue';
import AppHeader from './components/AppHeader.vue';
import AppPlayer from './components/AppPlayer.vue';

export default {
  name: 'App',
  components: {
    AppAuth,
    AppHeader,
    AppPlayer
  },
  created() {
    this.$store.dispatch('init_login');
  }
};
</script>
