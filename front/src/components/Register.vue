<template>
    <v-form v-model="valid" @submit.prevent="submitForm">
        <v-container>
            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field v-model="username" :rules="usernameRules" label="username"
                        required></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="email" :rules="emailRules" label="email" required></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="password" label="password" required></v-text-field>
                </v-col>
            </v-row>
            <v-btn variant="outlined" @click="submitForm">
                Register
            </v-btn>
        </v-container>
    </v-form>
</template>

<script>
import { register } from '../services/authService'

export default {
    data: () => ({
        valid: false,
        username: '',
        usernameRules: [
            value => {
                if (value) return true

                return 'Username is required.'
            }
        ],
        email: '',
        emailRules: [
            value => {
                if (value) return true

                return 'E-mail is required.'
            },
            value => {
                if (/.+@.+\..+/.test(value)) return true

                return 'E-mail must be valid.'
            },
        ],
        password: '',

    }),
    methods: {
        // Méthode pour soumettre le formulaire
        async submitForm() {
            if (this.$refs.form.validate()) {  // Vérifier si le formulaire est valide
                const formData = {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                };

                try {
                    // Appel au service d'enregistrement
                    const result = await register(formData);
                    console.log('Registration successful:', result);
                    // Gestion de la réponse de l'API
                    // Par exemple, rediriger l'utilisateur ou afficher un message de succès
                } catch (error) {
                    console.error('Registration failed', error);
                    // Gérer l'erreur d'inscription ici (affichage d'un message d'erreur, etc.)
                }
            }
        }
    }
}
</script>
