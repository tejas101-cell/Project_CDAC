import keycloak from '../keycloak.config';
import apiClient from './api.config';

/**
 * AUTH SERVICE WITH KEYCLOAK
 */

const login = () => {
  return keycloak.login({
    redirectUri: window.location.origin
  });
};

const register = (name, email, roleName, password) => {
  // Register user in backend (Includes Keycloak sync in backend)
  return apiClient.post('/api/users/register', {
    name,
    email,
    roleName: roleName.toUpperCase(),
    password
  });
};

const logout = () => {
  localStorage.removeItem('keycloak_token');
  localStorage.removeItem('keycloak_refresh_token');
  localStorage.removeItem('user');
  return keycloak.logout({
    redirectUri: window.location.origin
  });
};

const getCurrentUser = () => {
  if (!keycloak.authenticated) {
    return null;
  }

  const tokenParsed = keycloak.tokenParsed;

  return {
    token: keycloak.token,
    userId: tokenParsed.sub,  // Keycloak user ID
    name: tokenParsed.name || tokenParsed.preferred_username,
    email: tokenParsed.email,
    roleName: getUserRole(tokenParsed),
    status: 'ACTIVE'
  };
};

const getUserRole = (tokenParsed) => {
  const roles = tokenParsed.realm_access?.roles || [];
  // Make roles uppercase for consistent checking
  const upperRoles = roles.map(r => r.toUpperCase());

  if (upperRoles.includes('ADMIN')) return 'ADMIN';
  if (upperRoles.includes('COLLECTOR')) return 'COLLECTOR';
  if (upperRoles.includes('RECYCLER')) return 'RECYCLER';
  if (upperRoles.includes('USER')) return 'USER';

  return 'USER'; // default
};

const isAuthenticated = () => {
  return keycloak.authenticated;
};

const getToken = () => {
  return keycloak.token;
};

// Keep other methods for compatibility
const getAllUsers = () => {
  return apiClient.get('/api/users').then(response => response.data);
};

const getUserById = (userId) => {
  return apiClient.get(`/api/users/${userId}`).then(response => response.data);
};

const updateUserStatus = (userId, status) => {
  return apiClient.put(`/api/users/${userId}/status`, null, {
    params: { status }
  });
};

const getCollectors = () => {
  return apiClient.get('/api/users').then(response => {
    console.log("AuthService: Fetched users for Collector list:", response.data);
    const collectors = response.data.filter(u => {
      const rName = (u.roleName || '').toUpperCase();
      const status = (u.status || '').toUpperCase();
      return rName === 'COLLECTOR' && (status === 'ACTIVE' || status === 'APPROVED');
    });
    return { data: collectors };
  });
};

const getRecyclers = () => {
  return apiClient.get('/api/users').then(response => {
    console.log("AuthService: Fetched users for Recycler list:", response.data);
    const recyclers = response.data.filter(u => {
      const rName = (u.roleName || '').toUpperCase();
      const status = (u.status || '').toUpperCase();
      return rName === 'RECYCLER' && (status === 'ACTIVE' || status === 'APPROVED');
    });
    console.log("AuthService: Filtered Recyclers:", recyclers);
    return { data: recyclers };
  });
};

const updateAvailability = (userId, availability) => {
  return apiClient.put(`/api/users/${userId}/availability`, null, {
    params: { availability }
  });
};

const setCurrentUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  setCurrentUser,
  isAuthenticated,
  getToken,
  getAllUsers,
  getUserById,
  updateUserStatus,
  getCollectors,
  getRecyclers,
  updateAvailability
};