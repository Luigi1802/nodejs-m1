import axios from 'axios';

const AUTH_URL = import.meta.env.VITE_API_URL + 'auth/';

export const register = async (formData) => {
  try {
    const response = await axios.post(AUTH_URL + 'register/', formData);
    return response.data;
  } catch (error) {
    console.error('Registration error', error);
  }
}