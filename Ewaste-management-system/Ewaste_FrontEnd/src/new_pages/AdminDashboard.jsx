import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../Services/auth.service';
import Navigablebar from '../new_components/NavigableBar';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('All Users');
    const [users, setUsers] = useState([]);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await authService.getAllUsers();
                setUsers(allUsers);
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };
        fetchUsers();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved':
            case 'Active': return { color: '#10b981', backgroundColor: '#ecfdf5' };
            case 'Pending': return { color: '#f59e0b', backgroundColor: '#fffbe6' };
            case 'Rejected': return { color: '#ef4444', backgroundColor: '#fef2f2' };
            default: return {};
        }
    };

    const stats = {
        total: users.length,
        pending: users.filter(u => u.status === 'Pending').length,
        approved: users.filter(u => u.status === 'Approved').length,
        rejected: users.filter(u => u.status === 'Rejected').length
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleStatusChange = async (userId, status) => {
        try {
            // Map "Active" to "Approved" for consistency if needed, or stick to "Active"
            // Backend uses "Active" in one place and "Approved" check in login. 
            // Let's ensure consistency. Implementation plan said "Approved". 
            // Checking UserServiceImpl: setStatus("Pending"), check "Approved". 
            // So we must send "Approved".
            const statusToSend = status === 'Active' ? 'Approved' : status;

            await authService.updateUserStatus(userId, statusToSend);

            // Refresh list
            const allUsers = await authService.getAllUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error("Failed to update user status", error);
            alert("Failed to update user status");
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8fafc' }}>
            <Navigablebar />
            <div style={{ paddingTop: '80px' }}></div>
            <main className="flex-grow-1 container py-5">
                {/* Header Title Only */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-0" style={{ color: '#1a202c' }}>Admin Dashboard</h2>
                        <p className="text-muted small mb-0 mt-1">Smart E-Waste Management System</p>
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
                                    <h3 className="fw-bold mb-0">{stats.total}</h3>
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
                                    <h3 className="fw-bold mb-0">{stats.pending}</h3>
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
                                    <h3 className="fw-bold mb-0">{stats.approved}</h3>
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
                                    <h3 className="fw-bold mb-0">{stats.rejected}</h3>
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
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Account Type</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Registration Date</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Status</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.filter(u => activeTab === 'All Users' || u.status === activeTab).map((user) => (
                                    <tr key={user.userId} className="border-bottom">
                                        <td className="px-4 py-4 text-muted small">{user.userId}</td>
                                        <td className="py-4">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', color: '#4a5568', fontSize: '14px' }}>
                                                    {user.name && user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="fw-semibold text-dark">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-muted">{user.email}</td>
                                        <td className="py-4">
                                            <span className="badge bg-light text-dark border fw-normal">
                                                {user.roleName || 'User'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="py-4">
                                            <span className="badge rounded-pill px-3 py-2 fw-medium" style={getStatusStyle(user.status)}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-center">
                                            <div className="dropdown position-relative">
                                                <button
                                                    className="btn btn-sm text-white px-3 dropdown-toggle"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(openDropdownId === user.userId ? null : user.userId);
                                                    }}
                                                    style={{ backgroundColor: '#0D9488', borderRadius: '4px' }}
                                                >
                                                    Action
                                                </button>
                                                {openDropdownId === user.userId && (
                                                    <ul className="dropdown-menu show position-absolute end-0 mt-1 shadow-lg border-0" style={{ zIndex: 1000, display: 'block' }}>
                                                        <li><button className="dropdown-item" onClick={() => { handleStatusChange(user.userId, 'Active'); setOpenDropdownId(null); }}>Approve</button></li>
                                                        <li><button className="dropdown-item" onClick={() => { handleStatusChange(user.userId, 'Rejected'); setOpenDropdownId(null); }}>Reject</button></li>
                                                        <li><button className="dropdown-item" onClick={() => { handleStatusChange(user.userId, 'Pending'); setOpenDropdownId(null); }}>Mark Pending</button></li>
                                                    </ul>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
