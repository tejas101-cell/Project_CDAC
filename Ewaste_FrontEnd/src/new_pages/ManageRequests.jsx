import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavigableBar from '../new_components/NavigableBar';
import Footer from '../new_components/Footer';

const ManageRequests = () => {
    const [activeTab, setActiveTab] = useState('ALL');

    // Mock Data based on screenshot
    const requests = [];

    const stats = [
        { label: 'Total', count: 2, icon: 'bi-list-ul', color: '#0f766e', bg: '#ccfbf1' },
        { label: 'Pending', count: 0, icon: 'bi-clock', color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Accepted', count: 1, icon: 'bi-check-circle', color: '#3b82f6', bg: '#dbeafe' },
        { label: 'Scheduled', count: 0, icon: 'bi-calendar-check', color: '#8b5cf6', bg: '#ede9fe' },
        { label: 'Picked Up', count: 1, icon: 'bi-truck', color: '#10b981', bg: '#d1fae5' },
        { label: 'Completed', count: 0, icon: 'bi-check-circle-fill', color: '#0ea5e9', bg: '#e0f2fe' }
    ];

    const getStatusBadge = (status) => {
        const styles = {
            ACCEPTED: { bg: '#3b82f6', color: 'white' },
            PICKED_UP: { bg: '#10b981', color: 'white' },
            PENDING: { bg: '#f59e0b', color: 'white' },
            COMPLETED: { bg: '#0ea5e9', color: 'white' },
            REJECTED: { bg: '#ef4444', color: 'white' }
        };
        const style = styles[status] || { bg: '#9ca3af', color: 'white' };

        return (
            <span className="badge rounded-pill fw-medium px-3 py-2" style={{ backgroundColor: style.bg, color: style.color }}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8fafc' }}>
            <NavigableBar />
            <main className="flex-grow-1 container-fluid px-4 py-5 mt-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-4 rounded shadow-sm">
                    <div>
                        <div className="d-flex align-items-center mb-1">
                            <i className="bi bi-clipboard-check fs-3 me-3" style={{ color: '#0f766e' }}></i>
                            <h2 className="fw-bold mb-0" style={{ color: '#1e293b' }}>E-Waste Request Management</h2>
                        </div>
                        <p className="text-muted mb-0 ms-5">Manage and schedule e-waste pickups</p>
                    </div>
                    <Link to="/admin/dashboard" className="btn btn-outline-secondary d-flex align-items-center px-4 py-2">
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Dashboard
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="row g-4 mb-5">
                    {stats.map((stat, index) => (
                        <div className="col-md-2" key={index}>
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body p-3 d-flex align-items-center">
                                    <div className="rounded-3 p-3 me-3 d-flex align-items-center justify-content-center"
                                        style={{ backgroundColor: stat.color, width: '48px', height: '48px' }}>
                                        <i className={`bi ${stat.icon} text-white fs-5`}></i>
                                    </div>
                                    <div>
                                        <h4 className="fw-bold mb-0">{stat.count}</h4>
                                        <span className="text-muted small">{stat.label}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="mb-4">
                    <div className="d-flex gap-2 flex-wrap">
                        {['ALL', 'PENDING', 'ACCEPTED', 'SCHEDULED', 'PICKED UP', 'COMPLETED', 'REJECTED'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`btn border-0 fw-bold px-4 py-2 rounded-1 small ${activeTab === tab ? 'text-white' : 'text-muted'}`}
                                style={{
                                    backgroundColor: activeTab === tab ? '#0f766e' : 'transparent',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3 border-0 text-muted small fw-bold text-uppercase">ID</th>
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase">User</th>
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase">Device</th>
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase">Condition</th>
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase">Qty</th>
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase" style={{ minWidth: '200px' }}>Location</th>
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase">Submitted</th>
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase">Status</th>
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id}>
                                        <td className="px-4 fw-medium text-muted">#{req.id}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3 text-white fw-bold"
                                                    style={{ width: '35px', height: '35px', backgroundColor: req.user.color, fontSize: '14px' }}>
                                                    {req.user.initial}
                                                </div>
                                                <div className="d-flex flex-column">
                                                    <span className="fw-semibold text-dark small">{req.user.name}</span>
                                                    <span className="text-muted smaller" style={{ fontSize: '11px' }}>{req.user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span className="fw-bold text-dark small">{req.device.name}</span>
                                                <span className="text-muted smaller" style={{ fontSize: '11px' }}>{req.device.model}</span>
                                            </div>
                                        </td>
                                        <td className="text-dark small">{req.condition}</td>
                                        <td className="text-dark small fw-medium">{req.qty}</td>
                                        <td className="text-muted small">{req.location}</td>
                                        <td className="text-muted small">{req.submitted}</td>
                                        <td>{getStatusBadge(req.status)}</td>
                                        <td className="text-end px-4">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button className="btn btn-warning text-white btn-sm px-3 fw-medium d-flex align-items-center shadow-sm" style={{ backgroundColor: '#f59e0b', border: 'none' }}>
                                                    <i className="bi bi-eye me-1"></i> View
                                                </button>
                                                {req.status === 'ACCEPTED' && (
                                                    <button className="btn btn-info text-white btn-sm px-3 fw-medium d-flex align-items-center shadow-sm" style={{ backgroundColor: '#0ea5e9', border: 'none' }}>
                                                        <i className="bi bi-calendar-check me-1"></i> Schedule
                                                    </button>
                                                )}
                                                {req.status === 'PICKED_UP' && (
                                                    <button className="btn btn-success text-white btn-sm px-3 fw-medium d-flex align-items-center shadow-sm" style={{ backgroundColor: '#10b981', border: 'none' }}>
                                                        <i className="bi bi-check-circle me-1"></i> Complete
                                                    </button>
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
            <Footer />
        </div>
    );
};

export default ManageRequests;
