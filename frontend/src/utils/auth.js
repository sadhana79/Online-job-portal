export function saveToken(t){ localStorage.setItem('token', t) }
export function getToken(){ return localStorage.getItem('token') }
export function clearToken(){ localStorage.removeItem('token') }
