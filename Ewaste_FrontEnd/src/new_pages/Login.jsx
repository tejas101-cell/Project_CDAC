import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../Services/auth.service';
import '../styling/Auth.css';

const Login = () => {
  const handleLogin = async () => {
    try {
      console.log('--- ATTEMPTING KEYCLOAK LOGIN ---');
      await authService.login();
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="card auth-card text-center p-5">
          <div className="auth-logo-section mb-4">
            <div className="auth-logo mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L4 9V21H20V9L12 3ZM12 15C10.34 15 9 13.66 9 13C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z" />
              </svg>
            </div>
            <h1 className="auth-title mt-3">Welcome Back</h1>
            <p className="auth-subtitle">Login to your Smart E-Waste account</p>
          </div>

          <button
            onClick={handleLogin}
            className="btn btn-primary btn-lg w-100 py-3 fw-bold shadow-sm"
            style={{ backgroundColor: '#0D9488', border: 'none', borderRadius: '8px' }}
          >
            <i className="bi bi-shield-lock me-2"></i> Login with Keycloak
          </button>

          <div className="auth-divider my-4">
            <span>New to the platform?</span>
          </div>

          <div className="auth-footer">
            <Link to="/register" className="auth-link fw-medium">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
