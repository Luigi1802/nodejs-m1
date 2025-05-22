import { jwtDecode } from 'jwt-decode';

export function isAuthenticated () {
  // check expiration date
  const token = localStorage.getItem('token');
  if (!token) return false;
  const decoded = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000); // en secondes
  return decoded.exp > currentTime;
}

export function getUserRole () {
  return localStorage.getItem('role')
}

export function setAuthInfo (token) {
  const decoded = jwtDecode(token);
  const role = decoded.role || 'customer';
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
}
