<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field v-model="email" label="Email" required :rules="emailRules" />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field v-model="password" label="Password" required type="password" />
        </v-col>
      </v-row>

      <v-btn class="me-4" type="submit" variant="outlined">Login</v-btn>
      <v-btn class="forgotpassword" to="forgot-password" variant="outlined">Forgot password?</v-btn>
    </v-container>
  </v-form>
</template>

<script setup>
  import { ref } from 'vue'
  import { forgotpassword, login } from '../services/authService'
  import router from '../router/index.js'
  import { getUserRole } from '../utils/auth.js'

  // Refs
  const form = ref(null)
  const valid = ref(false)

  const email = ref('')
  const password = ref('')

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
        password: password.value,
      }

      try {
        const result = await login(formData)
        if (result) {
          const role = getUserRole();
          switch (role) {
            case 'customer':
              router.push('/customer/dashboard');
              break;
            case 'admin':
              router.push('/admin/equipments');
              break;
            default:
              break;
          }
        }
      } catch (error) {
        console.error('Login failed:', error)
      }
    }
  }
</script>
