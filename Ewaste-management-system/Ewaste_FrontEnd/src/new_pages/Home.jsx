import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../new_components/NavigableBar';
import Footer from '../new_components/Footer';
import '../styling/Home.css';
import '../styling/NavigableBar.css';
import '../styling/Footer.css';

const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    return (
        <div className="home-page">
            <Navbar />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <div className="hero-content">
                                <span className="badge bg-success-gradient mb-3 px-4 py-2">
                                    🌱 Eco-Friendly Solution
                                </span>
                                <h1 className="display-3 fw-bold mb-4">
                                    Transform Your
                                    <span className="text-gradient"> E-Waste </span>
                                    Into a Greener Future
                                </h1>
                                <p className="lead mb-4 text-muted">
                                    Join thousands in making a difference. Dispose of your electronic waste responsibly
                                    and contribute to a sustainable tomorrow.
                                </p>
                                {!user && (
                                    <div className="d-flex gap-3 flex-wrap">
                                        <Link to="/register" className="btn btn-primary btn-lg px-5 py-3 rounded-pill">
                                            Get Started
                                            <i className="bi bi-arrow-left ms-2"></i>
                                        </Link>
                                        <Link to="/login" className="btn btn-outline-primary btn-lg px-5 py-3 rounded-pill">
                                            Sign In
                                        </Link>
                                    </div>
                                )}
                                <div className="stats-row mt-5">
                                    <div className="stat-item">
                                        <h3 className="fw-bold text-primary mb-0">10K+</h3>
                                        <p className="text-muted small mb-0">Items Recycled</p>
                                    </div>
                                    <div className="stat-item">
                                        <h3 className="fw-bold text-success mb-0">5K+</h3>
                                        <p className="text-muted small mb-0">Happy Users</p>
                                    </div>
                                    <div className="stat-item">
                                        <h3 className="fw-bold text-info mb-0">100%</h3>
                                        <p className="text-muted small mb-0">Eco-Friendly</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="hero-image-container">
                                <div className="floating-card card-1">
                                    <i className="bi bi-recycle display-4 text-success"></i>
                                </div>
                                <div className="floating-card card-2">
                                    <i className="bi bi-laptop display-4 text-primary"></i>
                                </div>
                                <div className="floating-card card-3">
                                    <i className="bi bi-phone display-4 text-info"></i>
                                </div>
                                <div className="floating-card card-4">
                                    <i className="bi bi-tablet display-4 text-warning"></i>
                                </div>
                                <div className="floating-card card-center">
                                    <i className="bi bi-tree-fill display-4 text-success"></i>
                                </div>
                                <div className="hero-circle"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section py-5">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <span className="badge bg-light text-primary mb-3 px-4 py-2">
                            Why Choose Us
                        </span>
                        <h2 className="display-5 text-primary fw-bold mb-3">Simple, Fast & Secure</h2>
                        <p className="lead text-muted">Everything you need for responsible e-waste management</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-6 col-lg-4">
                            <div className="feature-card h-100">
                                <div className="icon-wrapper bg-success-gradient">
                                    <i className="bi bi-recycle"></i>
                                </div>
                                <h4 className="fw-bold text-success mb-3">Easy Recycling</h4>
                                <p className="text-muted">
                                    Schedule pickups with just a few clicks. We make e-waste disposal effortless and convenient.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="feature-card h-100">
                                <div className="icon-wrapper bg-primary-gradient">
                                    <i className="bi bi-truck"></i>
                                </div>
                                <h4 className="fw-bold text-success mb-3">Free Pickup</h4>
                                <p className="text-muted">
                                    We come to you! Free doorstep pickup service for all your electronic waste items.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="feature-card h-100">
                                <div className="icon-wrapper bg-info-gradient">
                                    <i className="bi bi-shield-check"></i>
                                </div>
                                <h4 className="fw-bold text-success mb-3">Secure Process</h4>
                                <p className="text-muted">
                                    Your data is safe with us. We ensure complete data destruction and secure recycling.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="feature-card h-100">
                                <div className="icon-wrapper bg-warning-gradient">
                                    <i className="bi bi-globe"></i>
                                </div>
                                <h4 className="fw-bold text-success mb-3">Eco-Friendly</h4>
                                <p className="text-muted">
                                    100% environmentally responsible disposal. Help reduce carbon footprint.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="feature-card h-100">
                                <div className="icon-wrapper bg-danger-gradient">
                                    <i className="bi bi-clock-history"></i>
                                </div>
                                <h4 className="fw-bold text-success mb-3">Track Status</h4>
                                <p className="text-muted">
                                    Real-time tracking of your e-waste disposal requests from pickup to recycling.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="feature-card h-100">
                                <div className="icon-wrapper bg-purple-gradient">
                                    <i className="bi bi-award"></i>
                                </div>
                                <h4 className="fw-bold text-success mb-3">Certified</h4>
                                <p className="text-muted">
                                    Fully certified and compliant with environmental regulations and standards.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section py-5 bg-light">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <span className="badge bg-primary text-white mb-3 px-4 py-2">
                            Simple Process
                        </span>
                        <h2 className="display-5 text-success fw-bold mb-3">How It Works</h2>
                        <p className="lead text-muted">Get started in 3 easy steps</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="step-card text-center">
                                <div className="step-number">1</div>
                                <div className="step-icon">
                                    <i className="bi bi-person-plus-fill"></i>
                                </div>
                                <h4 className="fw-bold text-success mb-3">Register</h4>
                                <p className="text-muted">
                                    Create your free account in seconds. No credit card required.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="step-card text-center">
                                <div className="step-number">2</div>
                                <div className="step-icon">
                                    <i className="bi bi-calendar-check-fill"></i>
                                </div>
                                <h4 className="fw-bold text-success mb-3">Schedule</h4>
                                <p className="text-muted">
                                    Choose a convenient time for pickup. We work around your schedule.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="step-card text-center">
                                <div className="step-number">3</div>
                                <div className="step-icon">
                                    <i className="bi bi-check-circle-fill"></i>
                                </div>
                                <h4 className="fw-bold text-success mb-3">Done!</h4>
                                <p className="text-muted">
                                    We handle the rest. Track your request and get confirmation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-5">
                <div className="container py-5">
                    <div className="cta-card text-center">
                        <h2 className="display-5 fw-bold text-white mb-4">
                            Ready to Make a Difference?
                        </h2>
                        <p className="lead text-white mb-4">
                            Join our community and start your journey towards sustainable e-waste management today.
                        </p>
                        {!user && (
                            <Link to="/register" className="btn btn-light btn-lg px-5 py-3 rounded-pill">
                                Get Started Now
                                <i className="bi bi-arrow-right ms-2"></i>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
