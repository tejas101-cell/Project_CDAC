import React from "react";
import { Link } from "react-router-dom";
import "../styling/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="row g-4">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand mb-4">
              <div className="d-flex align-items-center mb-3">
                <div className="footer-brand-icon me-2">
                  <i className="bi bi-recycle"></i>
                </div>
                <h4 className="text-gradient mb-0">Smart E-Waste</h4>
              </div>
              <p className="text-light-muted">
                Making the world cleaner, one device at a time. Join us in our mission to create a sustainable future through responsible e-waste management.
              </p>
              <div className="social-links">
                <a href="#" className="social-link"><i className="bi bi-facebook"></i></a>
                <a href="#" className="social-link"><i className="bi bi-twitter-x"></i></a>
                <a href="#" className="social-link"><i className="bi bi-instagram"></i></a>
                <a href="#" className="social-link"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link"><i className="bi bi-chevron-right"></i>Home</Link></li>
              <li><Link to="/about" className="footer-link"><i className="bi bi-chevron-right"></i>About Us</Link></li>
              <li><Link to="/services" className="footer-link"><i className="bi bi-chevron-right"></i>Services</Link></li>
              <li><Link to="/" className="footer-link"><i className="bi bi-chevron-right"></i>Home</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-md-6">
            <h5 className="footer-title">Support</h5>
            <ul className="footer-links">
              <li><Link to="/faq" className="footer-link"><i className="bi bi-chevron-right"></i>FAQ</Link></li>
              <li><Link to="/contact" className="footer-link"><i className="bi bi-chevron-right"></i>Contact Us</Link></li>
              <li><Link to="/privacy" className="footer-link"><i className="bi bi-chevron-right"></i>Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link"><i className="bi bi-chevron-right"></i>Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6">
            <h5 className="footer-title">Contact Info</h5>
            <ul className="footer-contact">
              <li>
                <div className="contact-icon"><i className="bi bi-geo-alt-fill"></i></div>
                <span>123 Green Street, Eco City, EC 12345</span>
              </li>
              <li>
                <div className="contact-icon"><i className="bi bi-envelope-fill"></i></div>
                <span>info@smartewaste.com</span>
              </li>
              <li>
                <div className="contact-icon"><i className="bi bi-telephone-fill"></i></div>
                <span>+1 (234) 567-890</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <p>© 2026 Smart E-Waste Management. All rights reserved.</p>
            <div className="d-flex gap-3">
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3">
                <i className="bi bi-shield-check me-1"></i> Certified
              </span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3">
                <i className="bi bi-check-circle me-1"></i> ISO 14001
              </span>
              <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-3">
                <i className="bi bi-tree me-1"></i> 100% Eco-Friendly
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
