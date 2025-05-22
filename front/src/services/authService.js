import axios from 'axios';
import { setAuthInfo } from '../utils/auth.js'

const AUTH_URL = import.meta.env.VITE_API_URL + 'auth/';

export const register = async formData => {
  try {
    const response = await axios.post(AUTH_URL + 'register/', formData);
    return response.data;
  } catch (error) {
    console.error('Registration error', error);
  }
}

export const login = async formData => {
  try {
    const response = await axios.post(AUTH_URL + 'login/', formData);
    setAuthInfo(response.data.token);
    return true;
  } catch (error) {
    console.error('Login error', error);
    return false;
  }
}
