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

export const getMyRequests = async () => {
  const res = await axios.get(CUSTOMER_REQUEST_URL + 'my-requests', { 
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data
}

export const getMyRequestsToReturn = async () => {
  const res = await axios.get(CUSTOMER_REQUEST_URL + 'my-requests-to-return', { 
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

export const createRequest = async ({ equipment, request_type }) => {
  const formData = { equipment, request_type };

  const res = await axios.post(CUSTOMER_REQUEST_URL, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

export const cancelRequest = async (id) => {
  await axios.put(CUSTOMER_REQUEST_URL + id + '/cancel', null, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};