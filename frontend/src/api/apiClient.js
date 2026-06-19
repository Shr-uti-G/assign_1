const API_BASE = '/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

let onUnauthorized = () => {};

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

const getToken = () => localStorage.getItem('token');

async function request(path, options = {}) {
  const headers = { ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let body = options.body;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers, body });

  if (res.status === 401) {
    onUnauthorized();
    throw new ApiError('Session expired. Please log in again.', 401);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.error || 'Something went wrong', res.status);
  }

  return data;
}

export const api = {
  login: (username, password) =>
    request('/login', { method: 'POST', body: { username, password } }),

  register: (data) =>
    request('/register', { method: 'POST', body: data }),

  getProducts: () => request('/products'),

  getProduct: (id) => request(`/products/${id}`),

  createProduct: (formData) =>
    request('/products', { method: 'POST', body: formData }),

  updateProduct: (id, formData) =>
    request(`/products/${id}`, { method: 'PUT', body: formData }),

  deleteProduct: (id) =>
    request(`/products/${id}`, { method: 'DELETE' }),

  getUsers: () => request('/users'),

  createUser: (data) =>
    request('/users', { method: 'POST', body: data }),

  deleteUser: (id) =>
    request(`/users/${id}`, { method: 'DELETE' }),
};

export { ApiError };
