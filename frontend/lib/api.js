const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

let accessToken = null;
let refreshPromise = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || 'Session expired');
        }

        setAccessToken(data.accessToken);

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const api = async (path, options = {}, canRetry = true) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include'
    });
  } catch {
    throw new Error('Unable to connect to the backend');
  }

  if (response.status === 401 && canRetry && !path.startsWith('/auth/')) {
    try {
      await refreshAccessToken();
      return api(path, options, false);
    } catch {
      clearAccessToken();
      localStorage.removeItem('user');
      throw new Error('Session expired. Please login again.');
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const logout = async () => {
  try {
    await api('/auth/logout', { method: 'POST' }, false);
  } finally {
    clearAccessToken();
    localStorage.removeItem('user');
  }
};
