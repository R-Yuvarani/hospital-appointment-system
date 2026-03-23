// public/js/app.js
// Shared utility functions used across all pages

// ─────────────────────────────────────────
// API Helper
// Makes fetch calls easier with error handling
// ─────────────────────────────────────────
const api = {
  // GET request
  get: async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },

  // POST request (send data)
  post: async (url, body) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },

  // PUT request (update data)
  put: async (url, body) => {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },

  // DELETE request
  delete: async (url) => {
    const res = await fetch(url, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  }
};

// ─────────────────────────────────────────
// Show Alert Message
// Usage: showAlert('alertId', 'Your message', 'success')
// ─────────────────────────────────────────
function showAlert(elementId, message, type = 'info') {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.className = `alert alert-${type}`;
  el.style.display = 'block';

  // Auto-hide after 5 seconds
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

// ─────────────────────────────────────────
// Format Date: "2024-12-25" → "December 25, 2024"
// ─────────────────────────────────────────
function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

// ─────────────────────────────────────────
// Get status badge HTML
// ─────────────────────────────────────────
function statusBadge(status) {
  return `<span class="badge badge-${status}">${status}</span>`;
}

// ─────────────────────────────────────────
// Check if user is logged in
// Redirects to login if not
// ─────────────────────────────────────────
async function requireAuth() {
  try {
    const data = await api.get('/api/auth/me');
    if (!data.loggedIn) {
      window.location.href = '/login';
    }
    return data.user;
  } catch {
    window.location.href = '/login';
  }
}

// ─────────────────────────────────────────
// Logout function
// ─────────────────────────────────────────
async function logout() {
  try {
    await api.post('/api/auth/logout');
    window.location.href = '/';
  } catch (err) {
    console.error('Logout failed:', err);
  }
}
