import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavigableBar from '../new_components/NavigableBar';
import Footer from '../new_components/Footer';

const MyRequests = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [requests, setRequests] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchUserRequests(parsedUser.userId || parsedUser.id);

            // Poll for updates every 5 seconds
            const intervalId = setInterval(() => {
                fetchUserRequests(parsedUser.userId || parsedUser.id);
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, []);

    const fetchUserRequests = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/requests/user/${userId}`);
            // Map response to match expected structure if needed, or use directly
            // Assuming response matches logic in UserDashboard
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ACCEPTED': return { bg: '#3b82f6', color: 'white' };
            case 'PICKED_UP': return { bg: '#10b981', color: 'white' }; // Example mapping
            case 'PENDING': return { bg: '#f59e0b', color: 'white' };
            case 'SCHEDULED': return { bg: '#0f766e', color: 'white' };
            case 'COMPLETED': return { bg: '#10b981', color: 'white' };
            case 'REJECTED': return { bg: '#ef4444', color: 'white' };
            default: return { bg: '#9ca3af', color: 'white' };
        }
    };

    const stats = [
        { label: 'Total Requests', count: requests.length, icon: 'bi-list-ul', color: '#0f766e' },
        { label: 'Pending', count: requests.filter(r => r.status === 'PENDING').length, icon: 'bi-clock', color: '#f59e0b' },
        { label: 'Scheduled', count: requests.filter(r => r.status === 'SCHEDULED' || r.status === 'ACCEPTED').length, icon: 'bi-calendar-check', color: '#3b82f6' },
        { label: 'Completed', count: requests.filter(r => r.status === 'COMPLETED' || r.status === 'PICKED_UP').length, icon: 'bi-check-circle', color: '#10b981' }
    ];

    const filteredRequests = activeTab === 'All'
        ? requests
        : requests.filter(req => {
            if (activeTab === 'Pending') return req.status === 'PENDING';
            if (activeTab === 'Scheduled') return ['SCHEDULED', 'ACCEPTED'].includes(req.status);
            if (activeTab === 'Completed') return ['COMPLETED', 'PICKED_UP'].includes(req.status);
            return true;
        });

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8fafc' }}>
            <NavigableBar />

            <main className="flex-grow-1 container py-5 mt-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#1e293b' }}>My E-Waste Requests</h2>
                        <div className="d-flex gap-2">
                            <i className="bi bi-list-ul text-muted"></i>
                            <span className="text-muted small">Manage and track your disposal requests</span>
                        </div>

                    </div>
                    <Link to="/create-request" className="btn text-white fw-medium px-4 py-2 shadow-sm d-flex align-items-center gap-2"
                        style={{ backgroundColor: '#0f766e', border: 'none', borderRadius: '8px' }}>
                        <i className="bi bi-plus-circle"></i>
                        New Request
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="row g-4 mb-5">
                    {stats.map((stat, index) => (
                        <div className="col-md-3" key={index}>
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                                <div className="card-body p-4 d-flex align-items-center">
                                    <div className="rounded-3 p-3 me-3 d-flex align-items-center justify-content-center"
                                        style={{ backgroundColor: `${stat.color}20`, width: '56px', height: '56px' }}>
                                        <i className={`bi ${stat.icon} fs-4`} style={{ color: stat.color }}></i>
                                    </div>
                                    <div>
                                        <h3 className="fw-bold mb-0" style={{ color: '#1e293b' }}>{stat.count}</h3>
                                        <span className="text-muted small fw-medium">{stat.label}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div className="mb-4">
                    <div className="d-flex gap-2">
                        {['All', 'Pending', 'Scheduled', 'Completed'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`btn border-0 fw-medium px-4 py-2 rounded-pill small transition-all ${activeTab === tab ? 'text-white shadow-sm' : 'text-muted bg-white'}`}
                                style={{
                                    backgroundColor: activeTab === tab ? '#0f766e' : 'white',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Requests Grid */}
                <div className="row g-4">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map(req => {
                            const statusStyle = getStatusStyle(req.status);
                            const mainItem = req.items && req.items.length > 0 ? req.items[0] : { itemName: 'Unknown', quantity: 0, remarks: 'N/A' };

                            return (
                                <div className="col-md-4" key={req.id}>
                                    <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden" style={{ borderRadius: '16px', transition: 'transform 0.2s' }}>
                                        {/* Status Badge */}
                                        <div className="position-absolute top-0 end-0 mt-3 me-3">
                                            <span className="badge rounded-pill px-3 py-2 fw-bold"
                                                style={{ backgroundColor: statusStyle.bg, fontSize: '0.75rem' }}>
                                                {req.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="card-body p-4 pt-5">
                                            <div className="mb-4">
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <i className="bi bi-recycle text-secondary"></i>
                                                    <span className="fw-bold text-muted small text-uppercase">Request #{req.id}</span>
                                                </div>
                                                <h4 className="fw-bold mb-1 text-dark">{mainItem.itemName}</h4>
                                                <span className="text-muted smaller">{user ? user.name : 'User'} - {mainItem.quantity} Item{mainItem.quantity !== 1 ? 's' : ''}</span>
                                            </div>

                                            <div className="vstack gap-3 mb-4">
                                                <div className="d-flex align-items-center text-muted small">
                                                    <i className="bi bi-box-seam me-3 opacity-75"></i>
                                                    <span>Condition: <span className="fw-medium text-dark">{mainItem.remarks}</span></span>
                                                </div>
                                                <div className="d-flex align-items-center text-muted small">
                                                    <i className="bi bi-geo-alt me-3 opacity-75"></i>
                                                    <span className="text-truncate">{req.pickupAddress}</span>
                                                </div>
                                                <div className="d-flex align-items-center text-muted small">
                                                    <i className="bi bi-calendar3 me-3 opacity-75"></i>
                                                    <span>Submitted: {req.scheduledDate || new Date().toLocaleDateString()}</span>
                                                </div>
                                                {req.pickupDate && (
                                                    <div className="d-flex align-items-center small p-2 rounded bg-light text-success border border-success-subtle">
                                                        <i className="bi bi-truck me-2"></i>
                                                        <span className="fw-medium">Pickup: {req.pickupDate}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="d-flex justify-content-center pt-3 border-top">
                                                <Link to={`/requests/${req.id}`} className="btn btn-warning w-100 fw-bold text-white shadow-sm"
                                                    style={{ borderRadius: '8px' }}>
                                                    <i className="bi bi-eye me-2"></i>View Details
                                                </Link>
                                                {/* Optional Cancel button for pending
                                                {req.status === 'PENDING' && (
                                                     <button className="btn btn-outline-danger w-50 ms-2 fw-medium" style={{ borderRadius: '8px' }}>
                                                        <i className="bi bi-x-circle me-1"></i> Cancel
                                                    </button>
                                                )}
                                                */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-12 text-center py-5">
                            <div className="mb-3">
                                <i className="bi bi-inbox fs-1 text-muted opacity-50"></i>
                            </div>
                            <h5 className="text-muted fw-medium">No requests found in this category</h5>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MyRequests;
