<template>
   <div class="text-white text-center font-bold p-5 mb-4 bg-blue-500" v-if="regShowAlert"
          :class="regAlertVarient">
          {{regAlertMessage}}
          </div>
          <vee-form :validation-schema="schema" @submit="register">
            <!-- Name -->
            <div class="mb-3">
              <label class="inline-block mb-2">Name</label>
              <vee-field type="text" name="name"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Name" />

                <VeeErrorMessage class="text-red-600" name="name" />
            </div>
            <!-- Email -->
            <div class="mb-3">
              <label class="inline-block mb-2">Email</label>
              <vee-field type="email" name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />

                <VeeErrorMessage class="text-red-600" name="email" />

            </div>
            <!-- Age -->
            <div class="mb-3">
              <label class="inline-block mb-2">Age</label>
              <vee-field type="number" name="age"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded" />

              <VeeErrorMessage class="text-red-600" name="age" />

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
            <!-- Confirm Password -->
            <div class="mb-3">
              <label class="inline-block mb-2">Confirm Password</label>
              <vee-field type="password" name="confirm_password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Confirm Password" />

            <VeeErrorMessage class="text-red-600" name="confirm_password" />

            </div>
            <!-- Country -->
            <div class="mb-3">
              <label class="inline-block mb-2">Country</label>
              <vee-field as="select" name="country"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded">
                <option value="">Select</option>
                <option value="USA">USA</option>
                <option value="Mexico">Mexico</option>
                <option value="Germany">Germany</option>
              </vee-field>

              <VeeErrorMessage class="text-red-600" name="country" />
            </div>
            <!-- TOS -->
            <div class="mb-3 pl-6">
              <vee-field type="checkbox" name="terms" value="0"
              class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
              <label class="inline-block">Accept terms of service</label>
              <VeeErrorMessage class="text-red-600" name="terms" />
            </div>
            <button type="submit" :disabled="regInProgress"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700">
              Submit
            </button>
          </vee-form>
</template>

<script>

export default {
  name: 'RegisterForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:50|alpha_spaces',
        email: 'required|max:50|email',
        age: 'required|min_value:18|max_value:50',
        password: 'required|min:8',
        confirm_password: 'password_mismatch:@password',
        country: 'required',
        terms: 'required'
      },
      regInProgress: false,
      regShowAlert: false,
      regAlertVarient: '',
      regAlertMessage: ''
    };
  },
  methods: {
    async register(values) {
      this.regInProgress = true;
      this.regShowAlert = true;
      this.regAlertVarient = 'bg-blue-500';
      this.regAlertMessage = 'Hang tight! you account is being created.';

      // save user email and password for authentication
      try {
        await this.$store.dispatch('register', values);
      } catch (error) {
        this.regInProgress = false;
        this.regAlertVarient = 'bg-red-500';
        this.regAlertMessage = error.message;
        return;
      }

      this.regInProgress = false;
      this.regAlertVarient = 'bg-green-500';
      this.regAlertMessage = 'Congratulations! your account has been created';

      window.location.reload();
    }
  }
};
</script>
