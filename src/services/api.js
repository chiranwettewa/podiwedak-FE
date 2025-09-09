const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Check if response has content
      const contentType = response.headers.get('content-type');
      let data = null;
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } else {
        data = {};
      }
      
      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: data
          }
        };
      }

      return { data };
    } catch (error) {
      if (error.response) {
        throw error;
      }
      throw {
        response: {
          status: 500,
          data: { error: error.message || 'Network error' }
        }
      };
    }
  }

  // HTTP methods
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, { method: 'POST', body: data });
  }

  async put(endpoint, data) {
    return this.request(endpoint, { method: 'PUT', body: data });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // User APIs
  async registerUser(userData) {
    return this.post('/users/register', userData);
  }

  async loginUser(credentials) {
    return this.post('/users/login', credentials);
  }

  async getUser(userId) {
    return this.get(`/users/${userId}`);
  }

  async getUserBalance(userId) {
    return this.get(`/users/${userId}/balance`);
  }

  async updateUserProfile(userId, profileData) {
    return this.put(`/users/${userId}/profile`, profileData);
  }

  async getUserProfile(userId) {
    return this.get(`/users/${userId}/profile`);
  }

  // Task APIs
  async createTask(taskData) {
    return this.post('/tasks', taskData);
  }

  async getAllTasks() {
    return this.get('/tasks');
  }

  async getUserTasks(userId) {
    return this.get(`/tasks/user/${userId}`);
  }

  async getTasksByCategory(category) {
    return this.get(`/tasks/category/${category}`);
  }

  // Payment APIs
  async makeDeposit(userId, amount, description) {
    return this.post('/payments/deposit', { userId, amount, description });
  }

  async makeWithdrawal(userId, amount, description) {
    return this.post('/payments/withdraw', { userId, amount, description });
  }

  async getUserPayments(userId) {
    return this.get(`/payments/user/${userId}`);
  }
}

const apiService = new ApiService();
export default apiService;
