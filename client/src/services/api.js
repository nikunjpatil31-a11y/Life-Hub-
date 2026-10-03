const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('lifehub_token') || 'demo-token-lifehub';

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || 'API request failed');
    }
    return await response.json();
  } catch (err) {
    console.warn(`[LifeHub API Notice] (${endpoint}): ${err.message}`);
    throw err;
  }
};
