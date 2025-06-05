import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const linkedinApi = {
  getProfile: async () => {
    const response = await api.get('/api/linkedin/profile');
    return response.data;
  },

  getPosts: async () => {
    const response = await api.get('/api/linkedin/posts');
    return response.data;
  },

  getArticles: async () => {
    const response = await api.get('/api/linkedin/articles');
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/api/linkedin/analytics');
    return response.data;
  },
};

export const configApi = {
  saveCredentials: async (credentials) => {
    const response = await api.post('/api/config/credentials', credentials);
    return response.data;
  },

  getCredentials: async () => {
    const response = await api.get('/api/config/credentials');
    return response.data;
  },

  getConfigStatus: async () => {
    const response = await api.get('/api/config/status');
    return response.data;
  },

  clearCredentials: async () => {
    const response = await api.delete('/api/config/credentials');
    return response.data;
  },
};

export default api; 