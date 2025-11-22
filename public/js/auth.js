// Authentication Forms Handler

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  const submitBtn = document.getElementById('submitBtn');

  // Helper: Show error message
  function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.add('show');
    successMessage.classList.remove('show');
  }

  // Helper: Show success message
  function showSuccess(msg) {
    successMessage.textContent = msg;
    successMessage.classList.add('show');
    errorMessage.classList.remove('show');
  }

  // Helper: Clear messages
  function clearMessages() {
    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');
  }

  // Helper: Set loading state
  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? 'Please wait...' : (loginForm ? 'Sign In' : 'Create Account');
  }

  // Login Form Handler
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessages();
      setLoading(true);

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      // Basic validation
      if (!email || !password) {
        showError('Please fill in all fields');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
          showSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          showError(data.message || 'Login failed. Please try again.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Login error:', err);
        showError('Network error. Please try again.');
        setLoading(false);
      }
    });
  }

  // Signup Form Handler
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessages();
      setLoading(true);

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      // Validation
      if (!name || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (name.length < 2) {
        showError('Name must be at least 2 characters');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        showError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        showError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.success) {
          showSuccess('Account created successfully! Redirecting...');
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else {
          // Handle validation errors from server
          if (data.errors && data.errors.length > 0) {
            showError(data.errors[0].msg);
          } else {
            showError(data.message || 'Signup failed. Please try again.');
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Signup error:', err);
        showError('Network error. Please try again.');
        setLoading(false);
      }
    });
  }

  // Password visibility toggle
  document.querySelectorAll('input[type="password"]').forEach(input => {
    input.addEventListener('focus', function() {
      this.style.borderColor = '#171a20';
    });
    input.addEventListener('blur', function() {
      this.style.borderColor = '#ddd';
    });
  });
});