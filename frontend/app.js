const API_BASE = 'http://localhost:3000/api';
const PRODUCTS_URL = `${API_BASE}/products`;
const EMPLOYEES_URL = `${API_BASE}/employees`;
const SALES_URL = `${API_BASE}/sales`;
const AUTH_URL = `${API_BASE}/auth`;

// Elements
const listEl = document.getElementById('product-list');
const formEl = document.getElementById('product-form');
const productIdInput = document.getElementById('product-id');
const adminPanel = document.getElementById('admin-panel');
const currentRoleDisplay = document.getElementById('current-role-display');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

let currentUser = JSON.parse(localStorage.getItem('user')) || null;
let token = localStorage.getItem('token') || null;
let allProducts = [];
let cart = [];
let currentView = 'catalog';

function init() {
  bindEvents();
  loadProducts();
  updateUIForAuth();
}

function bindEvents() {
  loginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
  registerBtn.addEventListener('click', () => registerModal.classList.remove('hidden'));
  logoutBtn.addEventListener('click', logout);

  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);
  formEl.addEventListener('submit', handleProductSubmit);

  document.querySelectorAll('.side-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  document.getElementById('cancel-button').addEventListener('click', () => adminPanel.classList.add('hidden'));
}

async function handleLogin(e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      token = result.token;
      currentUser = result.user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(currentUser));
      loginModal.classList.add('hidden');
      loginForm.reset();
      updateUIForAuth();
      alert(`Bienvenido, ${currentUser.name}`);
    } else {
      alert(result.message);
    }
  } catch (err) {
    alert('Error al iniciar sesión');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const formData = new FormData(registerForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      registerModal.classList.add('hidden');
      registerForm.reset();
    } else {
      alert(result.message);
    }
  } catch (err) {
    alert('Error al registrarse');
  }
}

function logout() {
  token = null;
  currentUser = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateUIForAuth();
  switchView('catalog');
}

function updateUIForAuth() {
  if (currentUser) {
    loginBtn.classList.add('hidden');
    registerBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    currentRoleDisplay.textContent = `${currentUser.name} (${currentUser.role})`;
    
    document.querySelectorAll('.admin-only').forEach(el => {
      currentUser.role === 'admin' ? el.classList.remove('hidden') : el.classList.add('hidden');
    });
    document.querySelectorAll('.employee-only').forEach(el => {
      (currentUser.role === 'admin' || currentUser.role === 'employee') ? el.classList.remove('hidden') : el.classList.add('hidden');
    });
  } else {
    loginBtn.classList.remove('hidden');
    registerBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    currentRoleDisplay.textContent = 'Invitado';
    document.querySelectorAll('.admin-only, .employee-only').forEach(el => el.classList.add('hidden'));
  }
  renderProducts(allProducts);
}

async function loadProducts() {
  try {
    const res = await fetch(PRODUCTS_URL);
    allProducts = await res.json();
    renderProducts(allProducts);
  } catch (err) {
    console.error('Error loading products', err);
  }
}

function renderProducts(products) {
  listEl.innerHTML = products.map(p => `
    <article class="product-card">
      <img src="${p.image || 'https://via.placeholder.com/200'}" class="product-image">
      <div class="card-content">
        <span class="tag">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="card-row">
          <span class="price">$${p.price.toFixed(2)}</span>
          <span class="stock">Stock: ${p.stock}</span>
        </div>
        <div class="card-actions">
          ${currentUser && currentUser.role === 'admin' ? `
            <button class="action-button" onclick="editProduct(${p.id})">Editar</button>
            <button class="action-button action-delete" onclick="deleteProduct(${p.id})">Eliminar</button>
          ` : ''}
          ${currentUser ? `
            <button class="btn-primary btn-block" onclick="addToCart(${p.id})">Vender</button>
          ` : '<p style="font-size: 12px; color: #666;">Inicia sesión para vender</p>'}
        </div>
      </div>
    </article>
  `).join('');
}

async function handleProductSubmit(e) {
  e.preventDefault();
  const formData = new FormData(formEl);
  const id = productIdInput.value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${PRODUCTS_URL}/${id}` : PRODUCTS_URL;

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData // Use FormData for file upload
    });
    if (res.ok) {
      adminPanel.classList.add('hidden');
      loadProducts();
      alert('Producto guardado');
    } else {
      const err = await res.json();
      alert(err.message);
    }
  } catch (err) {
    alert('Error al guardar producto');
  }
}

window.editProduct = async (id) => {
  const p = allProducts.find(x => x.id === id);
  productIdInput.value = p.id;
  formEl.name.value = p.name;
  formEl.brand.value = p.brand;
  formEl.category.value = p.category;
  formEl.price.value = p.price;
  formEl.stock.value = p.stock;
  formEl.discount.value = p.discount || 0;
  adminPanel.classList.remove('hidden');
};

window.deleteProduct = async (id) => {
  if (!confirm('¿Eliminar producto?')) return;
  try {
    const res = await fetch(`${PRODUCTS_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) loadProducts();
  } catch (err) {
    alert('Error al eliminar');
  }
};

function switchView(viewId) {
  currentView = viewId;
  document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
  document.getElementById(`view-${viewId}`).classList.remove('hidden');
  document.querySelectorAll('.side-nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === viewId));

  if (viewId === 'employees') loadEmployees();
}


async function loadEmployees() {
  try {
    const res = await fetch(EMPLOYEES_URL, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const employees = await res.json();
    const body = document.getElementById('employee-list-body');
    if (!body) return;
    body.innerHTML = employees.map(e => `
      <tr>
        <td>${e.id}</td>
        <td>${e.name}</td>
        <td>${e.role}</td>
        <td>${e.email}</td>
        <td><span class="tag">${e.role === 'admin' ? '🛡️' : '👤'}</span></td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading employees', err);
  }
}


init();
