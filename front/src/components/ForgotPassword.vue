<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-container>
      <h1 class="text-center mb-8">Send reset password email</h1>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field v-model="email" label="Email" required :rules="emailRules" />
        </v-col>
      </v-row>
      <v-btn type="submit" variant="outlined">Reset password</v-btn>
    </v-container>
  </v-form>
</template>

<script setup>
  import { ref } from 'vue'
  import { forgotpassword } from '../services/authService'
  import router from '../router/index.js'

  // Refs
  const form = ref(null)
  const valid = ref(false)

  const email = ref('')

  const emailRules = [
    v => !!v || 'E-mail is required.',
    v => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
  ]

  // Submit handler
  const submitForm = async () => {
    const isValid = await form.value?.validate()
    if (isValid) {
      const formData = {
        email: email.value,
      }

      try {
        const result = await forgotpassword(formData)
        router.push('/login');
      } catch (error) {
        console.error('Forgotten Password email send failed:', error)
      }
    }
  }
</script>
