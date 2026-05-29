// API Authentication for Member System
const API_BASE = '/api/auth';

async function apiRequest(action, email, password) {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, email, password })
    });
    return await res.json();
  } catch (e) {
    return { error: 'Gagal terhubung ke server' };
  }
}

// Override localStorage functions to use API
function setupAPIAuth() {
  const loginForm = document.querySelector('#loginForm');
  const registerForm = document.querySelector('#registerForm');
  const loginMsg = document.querySelector('#loginMsg');
  const registerMsg = document.querySelector('#registerMsg');

  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const form = new FormData(loginForm);
      const email = String(form.get('username') || '').trim();
      const password = String(form.get('password') || '').trim();
      
      const result = await apiRequest('login', email, password);
      if (result.error) {
        loginMsg.textContent = result.error;
      } else {
        localStorage.setItem('member_demo_auth_v1', JSON.stringify({ username: email, t: Date.now() }));
        loginMsg.textContent = 'Login berhasil!';
        location.reload();
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async e => {
      e.preventDefault();
      const form = new FormData(registerForm);
      const email = String(form.get('reg-username') || '').trim();
      const password = String(form.get('reg-password') || '').trim();
      
      const result = await apiRequest('register', email, password);
      if (result.error) {
        registerMsg.textContent = result.error;
      } else {
        registerMsg.textContent = 'Registrasi berhasil! Silakan login.';
        registerForm.reset();
      }
    });
  }
}

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupAPIAuth);
} else {
  setupAPIAuth();
}