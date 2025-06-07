import axios from 'axios';
import { getToken } from '../utils/auth.js'

const EQUIPMENT_URL = import.meta.env.VITE_API_URL + 'equipments/';

export const getAllEquipments = async () => {
  try {
    const response = await axios.get(EQUIPMENT_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Registration error', error);
  }
}

export const getAllAvailableEquipments = async () => {
  try {
    const response = await axios.get(EQUIPMENT_URL + 'available', {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Registration error', error);
  }
}

export const getAllUnavailableEquipments = async () => {
  try {
    const response = await axios.get(EQUIPMENT_URL + 'unavailable', {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Registration error', error);
  }
}

export const putEquipment = async (id, formData) => {
  try {
    const response = await axios.put(EQUIPMENT_URL + id, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Registration error', error);
  }
}

export const postEquipment = async formData => {
  try {
    const response = await axios.post(EQUIPMENT_URL, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Registration error', error);
  }
}

export const deleteEquipment = async id => {
  try {
    const response = await axios.delete(EQUIPMENT_URL + id, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Registration error', error);
  }
}
