import { createStore } from 'vuex';
import { auth, userCollection } from '@/plugins/firebase';
import { Howl } from 'howler';
import helper from '@/plugins/helper';

export default createStore({
  state: {
    hasAuthenticated: false,
    authModelShow: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%'
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    }
  },
  mutations: {
    toggleAuthModel: (state) => {
      state.authModelShow = !state.authModelShow;
    },
    toggleAuth: (state) => {
      state.hasAuthenticated = !state.hasAuthenticated;
    },
    saveAndPlaySong: (state, payLoad) => {
      state.currentSong = payLoad;
      state.sound = new Howl({
        src: [payLoad.url],
        html5: true
      });
    },
    updateSeekAndDuration: (state) => {
      const seek = state.sound.seek();
      const duration = state.sound.duration();

      state.seek = helper.formatTime(seek);
      state.duration = helper.formatTime(duration);

      state.playerProgress = `${(seek / duration) * 100}%`;
    }
  },
  actions: {
    async  register({ commit }, payLoad) {
      const userCred = await auth.createUserWithEmailAndPassword(payLoad.email, payLoad.password);

      await userCollection.doc(userCred.user.uid).set({
        name: payLoad.name,
        Email: payLoad.email,
        age: payLoad.age,
        country: payLoad.country
      });

      userCred.user.updateProfile({
        displayName: payLoad.name
      });

      commit('toggleAuth');
    },
    async login({ commit }, payLoad) {
      await auth.signInWithEmailAndPassword(payLoad.email, payLoad.password);

      commit('toggleAuth');
    },
    init_login({ commit }) {
      const user = auth.currentUser;

      if (user) {
        commit('toggleAuth');
      }
    },
    async signOut({ commit }) {
      await auth.signOut();
      commit('toggleAuth');
    },
    saveAndPlaySong({ commit, state, dispatch }, payLoad) {
      // unload a song if already playing
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }

      // save a song
      commit('saveAndPlaySong', payLoad);

      // play a song
      state.sound.play();

      // update seek and duration
      state.sound.on('play', () => {
        dispatch('soundProgress');
      });
    },
    toggleAudio({ state }) {
      if (!state.sound.playing) {
        return;
      }

      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    soundProgress({ commit, state, dispatch }) {
      commit('updateSeekAndDuration');

      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('soundProgress');
        });
      }
    },
    updateSeek({ state, dispatch }, payLoad) {
      if (!state.sound.playing) {
        return;
      }

      const { x, width } = payLoad.currentTarget.getBoundingClientRect();
      // Document = 2000, Timeline = 1000, click = 500, distance = 500

      // calculate correct seconds
      const clickX = payLoad.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;

      // change the song position
      state.sound.seek(seconds);

      // update progress once seek has initiated
      state.sound.once('seek', () => {
        dispatch('soundProgress');
      });
    }
  },
  modules: {
  }
});
