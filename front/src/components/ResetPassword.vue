<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-container>
      <h1 class="text-center mb-8">Change your password</h1>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="password"
            label="Password"
            required
            :rules="passwordRules"
            type="password"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="confirmpassword"
            label="Confirm Password"
            required
            :rules="passwordRules"
            type="password"
          />
        </v-col>
      </v-row>
      <v-btn type="submit" variant="outlined">Change password</v-btn>
    </v-container>
  </v-form>
</template>

<script setup>
  import { ref } from 'vue'
  import { resetpassword } from '../services/authService'
  import router from '../router/index.js'

  // Refs
  const form = ref(null)
  const valid = ref(false)
  const currentUrl = window.location.href
  const matches = currentUrl.match('(?<=reset-password\/).+')
  const match = matches.find(element => element)
  console.log(match)

  const password = ref('')
  const confirmpassword = ref('')

  const passwordRules = [
    v => !!v || 'Password is required.',
  ]

  // Submit handler
  const submitForm = async () => {
    const isValid = await form.value?.validate()
    if (isValid) {
      const formData = {
        token: match,
        newPassword: password.value,
      }

      try {
        const result = await resetpassword(formData)
        router.push('/login');
      } catch (error) {
        console.error('Forgotten Password email send failed:', error)
      }
    }
  }
</script>
