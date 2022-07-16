<template>
 <div class="text-white text-center font-bold p-5 mb-4 bg-blue-500" v-if="showAlert"
          :class="colorVarient">
          {{alertMessage}}
          </div>
<vee-form :validation-schema="loginSchema" @submit="login">
            <!-- Email -->
            <div class="mb-3">
              <label class="inline-block mb-2">Email</label>
              <vee-field type="email" name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />

                <VeeErrorMessage class="text-red-600" name="email" />
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="inline-block mb-2">Password</label>
              <vee-field type="password" name="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password" />

                <VeeErrorMessage class="text-red-600" name="password" />
            </div>
            <button type="submit" :disabled="inProgress"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700">
              Submit
            </button>
          </vee-form>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      loginSchema: {
        email: 'required|email',
        password: 'required'
      },
      showAlert: false,
      colorVarient: '',
      inProgress: false,
      alertMessage: ''
    };
  },
  methods: {
    async login(values) {
      this.showAlert = true;
      this.colorVarient = 'bg-blue-500';
      this.inProgress = true;
      this.alertMessage = 'Please wait...';
      console.log(values);
      try {
        await this.$store.dispatch('login', values);
      } catch (eroor) {
        this.colorVarient = 'bg-red-500';
        this.inProgress = false;
        this.alertMessage = 'Invalid login credentials';
        return;
      }

      this.colorVarient = 'bg-green-500';
      this.inProgress = false;
      this.alertMessage = 'You have been login successfully.';

      window.location.reload();
    }

  }
};
</script>
