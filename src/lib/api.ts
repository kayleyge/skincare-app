import axios from 'axios';

// Get the API URL from environment variables or use a default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based auth
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        
        const { access_token } = response.data;
        localStorage.setItem('accessToken', access_token);
        
        // Retry original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (usually logout)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
const authApi = {
  // Fixed: Backend expects username, not email for login
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),
  register: (userData: any) => 
    api.post('/auth/register', userData),
  logout: () => 
    api.post('/auth/logout'),
  // Add method to check if user is authenticated
  checkAuth: () => 
    api.get('/users/me'),
};

const userApi = {
  getProfile: () => 
    api.get('/users/me'),
  updateProfile: (userData: any) => 
    api.put('/users/me', userData),
};

const skinAnalysisApi = {
  analyzeImage: (imageData: string) => 
    api.post('/skin-analysis/analyze', { image_data: imageData }),
  getHistory: (limit = 10, skip = 0) => 
    api.get(`/skin-analysis/history?limit=${limit}&skip=${skip}`),
  getProgress: (days = 30) => 
    api.get(`/skin-analysis/progress?days=${days}`),
};

// Utility function to check authentication status
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

// Utility function to logout user
export const logout = async (): Promise<void> => {
  try {
    await authApi.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export { api, authApi, userApi, skinAnalysisApi };