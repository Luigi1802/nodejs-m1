import axios from 'axios';
import { getToken } from '../utils/auth.js'

const CUSTOMER_REQUEST_URL = import.meta.env.VITE_API_URL + 'customer-requests/';

export const getAllRequests = async () => {
  const res = await axios.get(CUSTOMER_REQUEST_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data
}

export const updateRequestStatus = async (id, status, state) => {
  const formData = { status, state }

  await axios.put(CUSTOMER_REQUEST_URL + id, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
}
