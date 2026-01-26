import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavigableBar from '../new_components/NavigableBar';
import Footer from '../new_components/Footer';
import authService from '../Services/auth.service';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('All Users');

    // Fetch real users from authService
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = () => {
            const allUsers = authService.getAllUsers();
            setUsers(allUsers);
        };
        fetchUsers();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return { color: '#10b981', backgroundColor: '#ecfdf5' };
            case 'Pending': return { color: '#f59e0b', backgroundColor: '#fffbe6' };
            case 'Rejected': return { color: '#ef4444', backgroundColor: '#fef2f2' };
            default: return {};
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8fafc' }}>
            <NavigableBar />
            <main className="flex-grow-1 container py-5 mt-5">
                {/* Custom Admin Header Match Screenshot */}
                <div className="d-flex justify-content-between align-items-start mb-4 bg-white p-4 rounded shadow-sm border-start border-4" style={{ borderLeftColor: '#0D9488' }}>
                    <div>
                        <div className="d-flex align-items-center">
                            <i className="bi bi-shield-check fs-3 me-3" style={{ color: '#0D9488' }}></i>
                            <h2 className="fw-bold mb-0" style={{ color: '#1a202c' }}>Admin Dashboard</h2>
                        </div>
                        <p className="text-muted small mb-0 mt-1">Smart E-Waste Management System</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Link to="/admin/manage-requests" className="btn d-flex align-items-center px-4 py-2" style={{ backgroundColor: '#ccfbf1', color: '#0D9488', border: 'none', borderRadius: '50px', textDecoration: 'none' }}>
                            <i className="bi bi-clipboard-check me-2"></i>
                            <span className="fw-semibold">Manage Requests</span>
                        </Link>
                        <button className="btn d-flex align-items-center px-4 py-2 border" style={{ backgroundColor: '#fff', color: '#4a5568', borderRadius: '4px' }}>
                            <i className="bi bi-box-arrow-right me-2"></i>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Summary Cards Row */}
                <div className="row g-4 mb-4">
                    {/* Total Users */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
                            <div className="d-flex align-items-center">
                                <div className="rounded-3 p-3 me-3" style={{ backgroundColor: '#0D9488' }}>
                                    <i className="bi bi-people-fill text-white fs-4"></i>
                                </div>
                                <div>
                                    <h3 className="fw-bold mb-0">8</h3>
                                    <p className="text-muted small mb-0">Total Users</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Pending Approval */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
                            <div className="d-flex align-items-center">
                                <div className="rounded-3 p-3 me-3" style={{ backgroundColor: '#f59e0b' }}>
                                    <i className="bi bi-clock text-white fs-4"></i>
                                </div>
                                <div>
                                    <h3 className="fw-bold mb-0">6</h3>
                                    <p className="text-muted small mb-0">Pending Approval</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Approved */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
                            <div className="d-flex align-items-center">
                                <div className="rounded-3 p-3 me-3" style={{ backgroundColor: '#10b981' }}>
                                    <i className="bi bi-check-circle text-white fs-4"></i>
                                </div>
                                <div>
                                    <h3 className="fw-bold mb-0">2</h3>
                                    <p className="text-muted small mb-0">Approved</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Rejected */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
                            <div className="d-flex align-items-center">
                                <div className="rounded-3 p-3 me-3" style={{ backgroundColor: '#ef4444' }}>
                                    <i className="bi bi-x-circle text-white fs-4"></i>
                                </div>
                                <div>
                                    <h3 className="fw-bold mb-0">0</h3>
                                    <p className="text-muted small mb-0">Rejected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="d-flex gap-4 mb-4 bg-white p-2 rounded shadow-sm w-fit" style={{ width: 'fit-content' }}>
                    {['All Users', 'Pending', 'Approved', 'Rejected'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`btn px-4 py-2 border-0 rounded ${activeTab === tab ? 'text-white' : 'text-muted fw-semibold'}`}
                            style={{
                                backgroundColor: activeTab === tab ? '#0D9488' : 'transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Users Table */}
                <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white mt-4">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead style={{ backgroundColor: '#fbfcfd' }}>
                                <tr>
                                    <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-bold">ID</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Full Name</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Email</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Registration Date</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Status</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.filter(u => activeTab === 'All Users' || u.status === activeTab).map((user) => (
                                    <tr key={user.id} className="border-bottom">
                                        <td className="px-4 py-4 text-muted small">{user.id}</td>
                                        <td className="py-4">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', color: '#4a5568', fontSize: '14px' }}>
                                                    {user.fullName.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="fw-semibold text-dark">{user.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-muted">{user.email}</td>
                                        <td className="py-4 text-muted">{user.regDate}</td>
                                        <td className="py-4">
                                            <span className="badge rounded-pill px-3 py-2 fw-medium" style={getStatusStyle(user.status)}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-center">
                                            <button className="btn btn-sm text-white px-3" style={{ backgroundColor: '#0D9488', borderRadius: '4px' }}>
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
