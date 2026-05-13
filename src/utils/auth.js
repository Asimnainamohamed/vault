const PIN='1234';
export function checkPin(pin){ const ok=pin===PIN; if(ok)localStorage.setItem('myvault_auth','yes'); return ok; }
export function isLoggedIn(){ return localStorage.getItem('myvault_auth')==='yes'; }
export function logout(){ localStorage.removeItem('myvault_auth'); }
