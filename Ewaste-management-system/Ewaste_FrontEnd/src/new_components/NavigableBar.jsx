import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styling/NavigableBar.css";

function Navigablebar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Check if we are on the create request page
  const isCreateRequestPage = location.pathname === '/create-request';
  // Check if we are on the view requests page
  const isViewRequestsPage = location.pathname === '/my-requests';

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? "navbar-scrolled" : ""}`} style={{ backgroundColor: '#0F766E', backgroundImage: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="brand-icon me-2 bg-transparent border-0">
            <i className="bi bi-recycle fs-3 text-white"></i>
          </div>
          <span className="brand-text text-white fw-bold">Smart E-Waste</span>
        </Link>

        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <i className="bi bi-list fs-3"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user && (
              <>
                {/* Admin Links */}
                {((user.role && user.role.toLowerCase() === 'admin') || (user.roleName && user.roleName.toLowerCase() === 'admin')) && (
                  <>
                    <li className="nav-item px-2">
                      <Link className="nav-link text-white" to="/">Home</Link>
                    </li>
                    <li className="nav-item px-2">
                      <Link className="nav-link text-white" to="/admin/dashboard">Users</Link>
                    </li>
                    <li className="nav-item px-2">
                      <Link className="nav-link text-white" to="/admin/manage-requests">Approve Requests</Link>
                    </li>
                  </>
                )}

                {/* User Links (Hidden for Admin) */}
                {!((user.role && user.role.toLowerCase() === 'admin') || (user.roleName && user.roleName.toLowerCase() === 'admin')) && (user.role?.toLowerCase() === 'user' || user.roleName?.toLowerCase() === 'user' || (!user.role && !user.roleName && user.email)) && (
                  <li className="nav-item px-2 d-flex">
                    <Link className="nav-link text-white me-2" to="/">Home</Link>
                    {!isCreateRequestPage && !isViewRequestsPage && (
                      <Link className="btn d-flex align-items-center text-white py-2 px-3 me-2" to="/create-request" style={{ border: '1px solid rgba(255,255,255,0.4)', backgroundColor: 'transparent', borderRadius: '4px' }}>
                        <i className="bi bi-plus-square me-2"></i>
                        <span>Create Request</span>
                      </Link>
                    )}
                    {!isViewRequestsPage && (
                      <Link className="btn d-flex align-items-center text-white py-2 px-3" to="/my-requests" style={{ border: '1px solid rgba(255,255,255,0.4)', backgroundColor: 'transparent', borderRadius: '4px' }}>
                        <i className="bi bi-list-ul me-2"></i>
                        <span>View Requests</span>
                      </Link>
                    )}
                  </li>
                )}

                {/* Collector & Recycler Links */}
                {((user.role && user.role.toLowerCase() === 'collector') || (user.roleName && user.roleName.toLowerCase() === 'collector')) && (
                  <>
                    <li className="nav-item px-2">
                      <Link className="nav-link text-white" to="/">Home</Link>
                    </li>
                    <li className="nav-item px-2">
                      <Link className="nav-link text-white" to="/collector/dashboard">Dashboard</Link>
                    </li>
                  </>
                )}
                {((user.role && user.role.toLowerCase() === 'recycler') || (user.roleName && user.roleName.toLowerCase() === 'recycler')) && (
                  <>
                    <li className="nav-item px-2">
                      <Link className="nav-link text-white" to="/">Home</Link>
                    </li>
                    <li className="nav-item px-2">
                      <Link className="nav-link text-white" to="/recycler/dashboard">Dashboard</Link>
                    </li>
                  </>
                )}

                {/* User Dropdown (Common for all logged in users) */}
                <li className="nav-item dropdown px-2 ms-lg-2">
                  <button
                    className="nav-link btn btn-link dropdown-toggle d-flex align-items-center text-white border-0"
                    onClick={toggleDropdown}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="bg-white rounded-circle p-1 me-2 d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                      <i className="bi bi-person text-teal" style={{ color: '#0F766E' }}></i>
                    </div>
                    <span>{user.name || user.email || 'User'}</span>
                  </button>
                  {showDropdown && (
                    <div className="dropdown-menu show position-absolute end-0 shadow-lg border-0 mt-2" style={{ backgroundColor: '#ffffff' }}>
                      <button
                        className="dropdown-item text-danger py-2"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            )}
            {!user && (
              <>
                <li className="nav-item px-2">
                  <Link className="nav-link text-white" to="/">Home</Link>
                </li>

                <li className="nav-item px-2">
                  <Link className="nav-link text-white" to="/login">Login</Link>
                </li>
                <li className="nav-item ms-lg-3">
                  <Link className="btn btn-outline-light px-4 py-2" to="/register" style={{ borderRadius: '4px' }}>
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigablebar;
