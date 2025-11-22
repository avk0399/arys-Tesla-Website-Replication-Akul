//Navigation Functionality

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const overlay = document.getElementById('overlay');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });
}

if (overlay) {
  overlay.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    // Only remove scrolled class on home page
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      navbar.classList.remove('scrolled');
    }
  }
});

//Authentication State Management

// Check if user is logged in and update nav
async function checkAuthStatus() {
  try {
    const response = await fetch('/api/auth/status');
    const data = await response.json();
    updateNavAuth(data);
  } catch (err) {
    console.error('Auth check failed:', err);
  }
}

// Update navigation based on auth status
function updateNavAuth(data) {
  const navAuth = document.getElementById('navAuth');
  const mobileNav = document.getElementById('mobileNav');

  if (!navAuth) return;

  if (data.loggedIn && data.user) {
    navAuth.innerHTML = `
      <span class="user-greeting">Hi, ${data.user.name}</span>
      <button class="logout-btn" onclick="handleLogout()">Sign Out</button>
    `;

    // Update mobile nav too
    if (mobileNav) {
      const authLinks = mobileNav.querySelectorAll('a[href="/login"], a[href="/signup"]');
      authLinks.forEach(link => link.remove());

      const logoutLink = document.createElement('a');
      logoutLink.href = '#';
      logoutLink.textContent = 'Sign Out';
      logoutLink.onclick = handleLogout;
      mobileNav.appendChild(logoutLink);
    }
  }
}

// Handle logout
async function handleLogout() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      window.location.href = '/';
    }
  } catch (err) {
    console.error('Logout failed:', err);
  }
}

// Check auth status on page load
document.addEventListener('DOMContentLoaded', checkAuthStatus);

//Smooth Scroll for Anchor Links

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

//Utility Functions

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Show toast notification
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'error' ? '#e82127' : type === 'success' ? '#2e7d32' : '#171a20'};
    color: white;
    border-radius: 4px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);