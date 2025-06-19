<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-container>
      <h1 class="text-center mb-8">Register</h1>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field v-model="username" label="Username" required :rules="usernameRules" />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field v-model="email" label="Email" required :rules="emailRules" />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field v-model="password" label="Password" required type="password" />
        </v-col>
      </v-row>

      <v-btn type="submit" variant="outlined">Register</v-btn>
    </v-container>
  </v-form>
</template>

<script setup>
  import { ref } from 'vue'
  import { register } from '../services/authService'
  import router from '../router/index.js'

  // Refs
  const form = ref(null)
  const valid = ref(false)

  const username = ref('')
  const email = ref('')
  const password = ref('')

  // Validation rules
  const usernameRules = [
    v => !!v || 'Username is required.',
  ]

  const emailRules = [
    v => !!v || 'E-mail is required.',
    v => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
  ]

  // Submit handler
  const submitForm = async () => {
    const isValid = await form.value?.validate()
    if (isValid) {
      const formData = {
        username: username.value,
        email: email.value,
        password: password.value,
      }

      try {
        const result = await register(formData)
        console.log('Registration successful:', result)
        router.push('/login');
      } catch (error) {
        console.error('Registration failed:', error)
      }
    }
  }
</script>
