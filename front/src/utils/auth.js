export function isAuthenticated () {
  return !!localStorage.getItem('token')
}

export function getUserRole () {
  return localStorage.getItem('role')
}

export function setAuthInfo (token, role) {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
}
