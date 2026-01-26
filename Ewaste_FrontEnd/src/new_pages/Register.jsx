import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../Services/auth.service';
import '../styling/Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // UI only (ignored)
    const [confirmPassword, setConfirmPassword] = useState(''); // UI only
    const [role, setRole] = useState('User'); // BACKEND ROLE FORMAT
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setRole('User');
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // UI validation ONLY (backend ignores password)
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // ✅ BACKEND EXPECTS: name, email, roleName
            await authService.register(username, email, role);

            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Registration failed', error);
            setError(
                error.response?.data?.message ||
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="auth-page">
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
                                <option value="Recycling_centre">Recycler</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

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
