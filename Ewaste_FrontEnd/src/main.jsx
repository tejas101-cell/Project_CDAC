import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import keycloak from './keycloak.config.js';

// Initialize Keycloak
keycloak.init({
  onLoad: 'check-sso',
  checkLoginIframe: false,
  pkceMethod: 'S256'
}).then((authenticated) => {
  console.log('Keycloak initialized. Authenticated:', authenticated);

  // Store token if authenticated
  if (authenticated) {
    localStorage.setItem('keycloak_token', keycloak.token);
    localStorage.setItem('keycloak_refresh_token', keycloak.refreshToken);

    // Extract user details and save to localStorage for legacy components
    const userId = keycloak.subject || keycloak.tokenParsed?.sub;
    const userProfile = {
      userId: userId, // Keycloak User ID (UUID)
      name: keycloak.tokenParsed.name || keycloak.tokenParsed.preferred_username,
      email: keycloak.tokenParsed.email,
      username: keycloak.tokenParsed.preferred_username,
      // Default to 'USER' role if not specified, or extract from realm_access
      // Use case-insensitive check for roles
      role: (keycloak.tokenParsed.realm_access?.roles?.some(r => r.toUpperCase() === 'ADMIN')) ? 'ADMIN' :
        (keycloak.tokenParsed.realm_access?.roles?.some(r => r.toUpperCase() === 'COLLECTOR')) ? 'COLLECTOR' :
          (keycloak.tokenParsed.realm_access?.roles?.some(r => r.toUpperCase() === 'RECYCLER')) ? 'RECYCLER' : 'USER'
    };
    console.log("Main.jsx: User Profile extracted:", userProfile);
    localStorage.setItem('user', JSON.stringify(userProfile));

    // AUTO-SYNC: Ensure user exists in Backend Database
    // We import axios directly or use config, here using fetch for simplicity or importing api config
    // We already have user logic above. Let's do a quick sync.
    import('./Services/api.config').then(module => {
      const apiClient = module.default;
      apiClient.post('/api/users/register', {
        userId: userProfile.userId,
        name: userProfile.name,
        email: userProfile.email,
        roleName: userProfile.role // 'ADMIN' or 'USER'
      }).then(() => {
        console.log('Backend Sync: User registered successfully.');
      }).catch(err => {
        console.log('Backend Sync: User likely already exists or sync failed.', err);
      });
    });
  }

  // Render app
  ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );

  // Token refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        console.log('Token refreshed');
        localStorage.setItem('keycloak_token', keycloak.token);
      }
    }).catch(() => {
      console.log('Failed to refresh token');
    });
  }, 60000); // Check every minute

}).catch((error) => {
  console.error('Keycloak initialization failed:', error);
});