import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Updated to match our backend port

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login/', credentials),
  register: (userData) => api.post('/api/auth/register/', userData),
  logout: (refreshToken) => api.post('/api/users/logout/', { refresh: refreshToken }),
  getCurrentUser: () => api.get('/api/auth/profile/'),
};

// Network API endpoints
export const networkAPI = {
  // Contact management
  getContacts: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add all parameters to the query string
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    return api.get(`/api/network/contacts/${queryString ? '?' + queryString : ''}`);
  },
  createContact: (contactData) => api.post('/api/network/contacts/', contactData),
  updateContact: (contactId, contactData) => api.put(`/api/network/contacts/${contactId}/`, contactData),
  deleteContact: (contactId) => api.delete(`/api/network/contacts/${contactId}/`),
  
  // Contact search
  searchContacts: (query) => {
    const params = new URLSearchParams({ q: query });
    return api.get(`/api/network/contacts/search/?${params.toString()}`);
  },
  
  // User search for platform users
  searchUsers: (query) => {
    const params = new URLSearchParams({ query });
    return api.get(`/api/network/instructor/users/search/?${params.toString()}`);
  },
  
  // Connection management
  sendConnectionRequest: (userId, message = '') => api.post('/api/network/connections/request/', {
    to_user: userId,
    message
  }),
  acceptConnection: (connectionId) => api.post(`/api/network/connections/${connectionId}/accept/`),
  declineConnection: (connectionId) => api.post(`/api/network/connections/${connectionId}/decline/`),
  
  // Instructor-specific endpoints
  getInstructorContacts: () => api.get('/api/network/instructor/contacts/'),
};

// Courses API endpoints
export const coursesAPI = {
  // Course management
  getCourses: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add all parameters to the query string
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    return api.get(`/api/courses/instructor/courses/${queryString ? '?' + queryString : ''}`);
  },
  
  createCourse: (courseData) => api.post('/api/courses/instructor/courses/create/', courseData),
  
  getCourse: (courseId) => api.get(`/api/courses/${courseId}/`),
  
  updateCourse: (courseId, courseData) => api.put(`/api/courses/${courseId}/`, courseData),
  
  deleteCourse: (courseId) => api.delete(`/api/courses/${courseId}/`),
  
  // Categories
  getCategories: () => api.get('/api/courses/categories/'),
  
  // Course units
  getCourseUnits: (courseId) => api.get(`/api/courses/${courseId}/units/`),
  createUnit: (courseId, unitData) => api.post(`/api/courses/${courseId}/units/create/`, unitData),
  updateUnit: (unitId, unitData) => api.put(`/api/units/${unitId}/update/`, unitData),
  deleteUnit: (unitId) => api.delete(`/api/units/${unitId}/delete/`),
  
  // Course goals
  getCourseGoals: (courseId) => api.get(`/api/courses/${courseId}/goals/`),
  createCourseGoal: (courseId, goalData) => api.post(`/api/courses/instructor/courses/${courseId}/goals/create/`, goalData),
  updateCourseGoal: (goalId, goalData) => api.put(`/api/courses/instructor/goals/${goalId}/update/`, goalData),
  deleteCourseGoal: (goalId) => api.delete(`/api/courses/instructor/goals/${goalId}/delete/`),
  toggleGoalComplete: (goalId, completed) => api.post(`/api/courses/goals/${goalId}/complete/`, { completed }),
  
  // Course materials
  getCourseMaterials: (courseId) => api.get(`/api/courses/${courseId}/materials/`),
  createCourseMaterial: (courseId, materialData) => api.post(`/api/courses/instructor/courses/${courseId}/materials/create/`, materialData),
  updateCourseMaterial: (materialId, materialData) => api.put(`/api/courses/instructor/materials/${materialId}/update/`, materialData),
  deleteCourseMaterial: (materialId) => api.delete(`/api/courses/instructor/materials/${materialId}/delete/`),
  
  // Course material sections
  getCourseMaterialSection: (courseId) => api.get(`/api/courses/${courseId}/material-section/`),
  updateCourseMaterialSection: (sectionId, sectionData) => api.patch(`/api/courses/instructor/material-sections/${sectionId}/update/`, sectionData),
  
  // Unit material sections
  getUnitMaterialSection: (unitId) => api.get(`/api/courses/units/${unitId}/material-section/`),
  updateUnitMaterialSection: (sectionId, sectionData) => api.patch(`/api/courses/instructor/unit-material-sections/${sectionId}/update/`, sectionData),
  
  // Bulk reordering (drag & drop)
  reorderCourseMaterials: (courseId, materialsOrder) => api.post(`/api/courses/instructor/courses/${courseId}/materials/reorder/`, { materials: materialsOrder }),
  reorderCourseGoals: (courseId, goalsOrder) => api.post(`/api/courses/instructor/courses/${courseId}/goals/reorder/`, { goals: goalsOrder }),
  reorderUnitTasks: (unitId, tasksOrder) => api.post(`/api/courses/instructor/units/${unitId}/tasks/reorder/`, { tasks: tasksOrder }),
  reorderUnitResources: (unitId, resourcesOrder) => api.post(`/api/courses/instructor/units/${unitId}/resources/reorder/`, { resources: resourcesOrder }),
};

export default api;
