import axios from 'axios';
const dotenv = require('dotenv');

dotenv.config();

const AUTH_URL = process.env.API_URL + '/auth/';

export const getApiMessage = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.message;
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API:', error);
    return 'Erreur de connexion à l\'API';
  }
};

export const register = async (formData) => {
  try {
    const response = await axios.post(AUTH_URL, formData);
    return response.data;
  } catch (error) {
    console.error('Registration error', error);
  }
}