// Car Customization Page

document.addEventListener('DOMContentLoaded', () => {
  // Car data configuration
  const carData = {
    models: {
      name: 'Model S',
      basePrice: 74990,
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80',
      specs: { range: '396 mi', speed: '1.99s', top: '200 mph' }
    },
    model3: {
      name: 'Model 3',
      basePrice: 40240,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80',
      specs: { range: '333 mi', speed: '3.1s', top: '162 mph' }
    },
    modelx: {
      name: 'Model X',
      basePrice: 79990,
      image: 'https://images.unsplash.com/photo-1566055909643-a51b4271aa47?w=1200&q=80',
      specs: { range: '348 mi', speed: '2.5s', top: '163 mph' }
    },
    modely: {
      name: 'Model Y',
      basePrice: 44990,
      image: 'https://images.unsplash.com/photo-1619317408603-96bb7ac5d7c0?w=1200&q=80',
      specs: { range: '310 mi', speed: '3.5s', top: '155 mph' }
    }
  };

  // Color image overlays 
  const colorStyles = {
    white: 'brightness(1.1) saturate(0.9)',
    black: 'brightness(0.6) saturate(0.5)',
    blue: 'brightness(0.85) saturate(1.3) hue-rotate(200deg)',
    red: 'brightness(0.9) saturate(1.5) hue-rotate(-10deg)',
    silver: 'brightness(1) saturate(0.3)'
  };

  // State
  let currentConfig = {
    model: 'models',
    battery: 'standard',
    color: 'white',
    wheel: '19',
    interior: 'black',
    prices: {
      battery: 0,
      color: 0,
      wheel: 0,
      interior: 0
    }
  };

  // DOM Elements
  const modelSelect = document.getElementById('modelSelect');
  const carPreview = document.getElementById('carPreview');
  const carName = document.getElementById('carName');
  const specRange = document.getElementById('specRange');
  const specSpeed = document.getElementById('specSpeed');
  const specTop = document.getElementById('specTop');
  const basePrice = document.getElementById('basePrice');
  const batteryPrice = document.getElementById('batteryPrice');
  const colorPrice = document.getElementById('colorPrice');
  const wheelPrice = document.getElementById('wheelPrice');
  const interiorPrice = document.getElementById('interiorPrice');
  const totalPrice = document.getElementById('totalPrice');
  const orderBtn = document.getElementById('orderBtn');

  // Check URL for model parameter
  const urlParams = new URLSearchParams(window.location.search);
  const modelParam = urlParams.get('model');
  if (modelParam && carData[modelParam]) {
    currentConfig.model = modelParam;
    modelSelect.value = modelParam;
  }

  // Initialize
  updateCarDisplay();
  setupEventListeners();

  // Update car display based on current config
  function updateCarDisplay() {
    const car = carData[currentConfig.model];
    
    // Update preview image with color filter
    carPreview.style.backgroundImage = `url('${car.image}')`;
    carPreview.style.filter = colorStyles[currentConfig.color];
    
    // Update car name
    carName.textContent = car.name;
    
    // Update specs based on battery selection
    let rangeMultiplier = 1;
    if (currentConfig.battery === 'long') rangeMultiplier = 1.15;
    if (currentConfig.battery === 'plaid') rangeMultiplier = 1.25;
    
    const baseRange = parseInt(car.specs.range);
    specRange.textContent = Math.round(baseRange * rangeMultiplier) + ' mi';
    specSpeed.textContent = car.specs.speed;
    specTop.textContent = car.specs.top;
    
    // Update prices
    updatePrices(car.basePrice);
  }

  // Update price display
  function updatePrices(base) {
    const { battery, color, wheel, interior } = currentConfig.prices;
    const total = base + battery + color + wheel + interior;
    
    basePrice.textContent = formatCurrency(base);
    batteryPrice.textContent = battery > 0 ? '+' + formatCurrency(battery) : '$0';
    colorPrice.textContent = color > 0 ? '+' + formatCurrency(color) : '$0';
    wheelPrice.textContent = wheel > 0 ? '+' + formatCurrency(wheel) : '$0';
    interiorPrice.textContent = interior > 0 ? '+' + formatCurrency(interior) : '$0';
    totalPrice.textContent = formatCurrency(total);
  }

  // Format currency helper
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Setup all event listeners
  function setupEventListeners() {
    // Model selector
    modelSelect.addEventListener('change', (e) => {
      currentConfig.model = e.target.value;
      updateCarDisplay();
    });

    // Battery options
    document.querySelectorAll('.battery-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.battery-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        currentConfig.battery = option.dataset.battery;
        currentConfig.prices.battery = parseInt(option.dataset.price);
        updateCarDisplay();
      });
    });

    // Color options
    document.querySelectorAll('.color-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        currentConfig.color = option.dataset.color;
        currentConfig.prices.color = parseInt(option.dataset.price);
        updateCarDisplay();
      });
    });

    // Wheel options
    document.querySelectorAll('.wheel-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.wheel-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        currentConfig.wheel = option.dataset.wheel;
        currentConfig.prices.wheel = parseInt(option.dataset.price);
        updateCarDisplay();
      });
    });

    // Interior options
    document.querySelectorAll('.interior-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.interior-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        currentConfig.interior = option.dataset.interior;
        currentConfig.prices.interior = parseInt(option.dataset.price);
        updateCarDisplay();
      });
    });

    // Order button
    orderBtn.addEventListener('click', handleOrder);
  }

  // Handle order button click
  async function handleOrder() {
    // Check if user is logged in
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();

      if (!data.loggedIn) {
        // Show message and redirect to login
        showToast('Please sign in to place an order', 'info');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        return;
      }

      // User is logged in - show order confirmation
      const car = carData[currentConfig.model];
      const total = car.basePrice + 
        currentConfig.prices.battery + 
        currentConfig.prices.color + 
        currentConfig.prices.wheel + 
        currentConfig.prices.interior;

      const configSummary = `
Model: ${car.name}
Battery: ${currentConfig.battery.charAt(0).toUpperCase() + currentConfig.battery.slice(1)} Range
Color: ${currentConfig.color.charAt(0).toUpperCase() + currentConfig.color.slice(1)}
Wheels: ${currentConfig.wheel}"
Interior: ${currentConfig.interior.charAt(0).toUpperCase() + currentConfig.interior.slice(1)}

Total: ${formatCurrency(total)}
      `;

      if (confirm(`Order Summary:\n${configSummary}\n\nProceed with order?`)) {
        showToast('Order placed successfully! We\'ll contact you shortly.', 'success');
      }
    } catch (err) {
      console.error('Order error:', err);
      showToast('Error processing order. Please try again.', 'error');
    }
  }

  // Toast notification (using the one from main.js or creating inline)
  function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

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
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});