import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../Services/auth.service';
import Notification from '../new_components/Notification';
import '../styling/Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // UI only (ignored)
    const [confirmPassword, setConfirmPassword] = useState(''); // UI only
    const [role, setRole] = useState('User'); // BACKEND ROLE FORMAT
    const [address, setAddress] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const navigate = useNavigate();

    const showNotify = (message, type = 'success') => {
        setNotification({ show: true, message, type });
    };

    useEffect(() => {
        setRole('User');
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // Step 1: Register in backend (now sending password for Keycloak sync)
            await authService.register(username, email, role, password);

            setSuccess(true);
            setError('');

            // Show message to user
            showNotify('Registration successful! Redirecting to login...');

            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (error) {
            console.error('Registration failed', error);
            const serverMessage = error.response?.data?.message || error.response?.data;
            setError(
                typeof serverMessage === 'string' ? serverMessage :
                    'Registration failed. Ensure all fields are valid or server is online.'
            );
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="auth-page">
            <Notification
                show={notification.show}
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ ...notification, show: false })}
            />
            <div className="auth-container">
                <div className="card auth-card">
                    <div className="auth-logo-section">
                        <div className="auth-logo">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3L4 9V21H20V9L12 3ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z" />
                            </svg>
                        </div>
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Join the Smart E-Waste community</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger auth-alert" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success auth-alert" role="alert">
                            Account created successfully! Redirecting to login...
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="auth-form">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading || success}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading || success}
                            />
                        </div>

                        {/* ROLE VALUES MUST MATCH BACKEND */}
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Account Type</label>
                            <select
                                className="form-select"
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                disabled={loading || success}
                            >
                                <option value="User">User</option>
                                <option value="Collector">Collector</option>
                                <option value="Recycler">Recycler</option>
                            </select>
                        </div>

                        {role === 'User' && (
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Residential Address (Permanent)</label>
                                <textarea
                                    className="form-control"
                                    id="address"
                                    rows="3"
                                    placeholder="Enter your full residential address (for certificate delivery)"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    disabled={loading || success}
                                ></textarea>
                                <div className="form-text text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                                    This address will be used by recyclers to send your e-waste certificates.
                                </div>
                            </div>
                        )}

                        {/* PASSWORD FIELDS KEPT FOR UI ONLY */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="position-relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading || success}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={togglePasswordVisibility}
                                    tabIndex="-1"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Retype Password</label>
                            <div className="position-relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={loading || success}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={togglePasswordVisibility}
                                    tabIndex="-1"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn auth-btn"
                            disabled={loading || success}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>Already have an account?</span>
                    </div>

                    <div className="auth-footer">
                        <Link to="/login" className="auth-link">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
