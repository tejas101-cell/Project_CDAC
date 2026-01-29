import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import authService from '../Services/auth.service';
import requestService from '../Services/request.service';
import Navigablebar from '../new_components/NavigableBar';

const ManageRequests = () => {
    const [activeTab, setActiveTab] = useState('ALL');
    const [requests, setRequests] = useState([]);

    // Modal State
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [collectors, setCollectors] = useState([]);
    const [selectedCollector, setSelectedCollector] = useState('');

    useEffect(() => {
        fetchRequests();
        fetchCollectors();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await requestService.getAllRequests();
            const mappedRequests = data.map(req => ({
                id: req.id,
                user: {
                    name: req.user.name,
                    email: req.user.email,
                    initial: req.user.name ? req.user.name.charAt(0).toUpperCase() : 'U',
                    color: '#3b82f6'
                },
                device: {
                    name: req.items.length > 0 ? req.items[0].itemName : 'Unknown',
                    model: 'N/A'
                },
                condition: req.items.length > 0 ? req.items[0].remarks : 'Unknown',
                qty: req.items.length > 0 ? req.items[0].quantity : 0,
                location: req.pickupAddress,
                submitted: new Date(req.createdAt).toLocaleDateString(), // Use createdAt
                status: req.status
            }));
            setRequests(mappedRequests);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        }
    };

    const fetchCollectors = async () => {
        try {
            const response = await authService.getCollectors();
            setCollectors(response.data);
        } catch (error) {
            console.error("Failed to fetch collectors", error);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await requestService.updateStatus(id, status);
            fetchRequests(); // Refresh
        } catch (error) {
            console.error(`Failed to update status to ${status}`, error);
            alert(`Failed to update status: ${error.response?.data?.message || error.message}`);
        }
    };

    const openScheduleModal = (req) => {
        setSelectedRequest(req);
        setShowScheduleModal(true);
        setSelectedCollector('');
    };

    const handleScheduleSubmit = async () => {
        if (!selectedCollector) {
            alert("Please select a collector");
            return;
        }
        try {
            await requestService.assignCollector(selectedRequest.id, selectedCollector);
            setShowScheduleModal(false);
            fetchRequests();
        } catch (error) {
            console.error("Failed to schedule request", error);
            alert(`Failed to schedule request: ${error.response?.data?.message || error.message}`);
        }
    };

    const stats = [
        { label: 'Total', count: requests.length, icon: 'bi-list-ul', color: '#0f766e', bg: '#ccfbf1' },
        { label: 'Pending', count: requests.filter(r => r.status === 'PENDING').length, icon: 'bi-clock', color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Accepted', count: requests.filter(r => r.status === 'ACCEPTED').length, icon: 'bi-check-circle', color: '#3b82f6', bg: '#dbeafe' },
        { label: 'Scheduled', count: requests.filter(r => r.status === 'SCHEDULED').length, icon: 'bi-calendar-check', color: '#8b5cf6', bg: '#ede9fe' },
        { label: 'Picked Up', count: requests.filter(r => r.status === 'PICKED_UP').length, icon: 'bi-truck', color: '#10b981', bg: '#d1fae5' },
        { label: 'Completed', count: requests.filter(r => r.status === 'COMPLETED').length, icon: 'bi-check-circle-fill', color: '#0ea5e9', bg: '#e0f2fe' }
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
            <Navigablebar />
            <div style={{ paddingTop: '80px' }}></div>
            <main className="flex-grow-1 container-fluid px-4 py-5">
                {/* Header */}
                <div className="mb-4 bg-white p-4 rounded shadow-sm">
                    <div>
                        <div className="d-flex align-items-center mb-1">
                            <i className="bi bi-clipboard-check fs-3 me-3" style={{ color: '#0f766e' }}></i>
                            <h2 className="fw-bold mb-0" style={{ color: '#1e293b' }}>E-Waste Request Management</h2>
                        </div>
                        <p className="text-muted mb-0 ms-5">Manage and schedule e-waste pickups</p>
                    </div>
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
                                {requests.filter(req => activeTab === 'ALL' || req.status === activeTab).map(req => (
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
                                            <div className="d-flex flex-column gap-2 align-items-end">
                                                <button className="btn btn-warning text-white btn-sm px-3 fw-medium d-flex align-items-center shadow-sm w-100 justify-content-center" style={{ backgroundColor: '#f59e0b', border: 'none', maxWidth: '110px' }}>
                                                    <i className="bi bi-eye me-1"></i> View
                                                </button>

                                                {/* Pending: Accept & Reject */}
                                                {req.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req.id, 'ACCEPTED')}
                                                            className="btn btn-success text-white btn-sm px-3 fw-medium d-flex align-items-center shadow-sm w-100 justify-content-center" style={{ backgroundColor: '#10b981', border: 'none', maxWidth: '110px' }}>
                                                            <i className="bi bi-check-lg me-1"></i> Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req.id, 'REJECTED')}
                                                            className="btn btn-danger text-white btn-sm px-3 fw-medium d-flex align-items-center shadow-sm w-100 justify-content-center" style={{ backgroundColor: '#ef4444', border: 'none', maxWidth: '110px' }}>
                                                            <i className="bi bi-x-lg me-1"></i> Reject
                                                        </button>
                                                    </>
                                                )}

                                                {/* Accepted: Schedule */}
                                                {req.status === 'ACCEPTED' && (
                                                    <button
                                                        onClick={() => openScheduleModal(req)}
                                                        className="btn btn-info text-white btn-sm px-3 fw-medium d-flex align-items-center shadow-sm w-100 justify-content-center" style={{ backgroundColor: '#0ea5e9', border: 'none', maxWidth: '110px' }}>
                                                        <i className="bi bi-calendar-check me-1"></i> Schedule
                                                    </button>
                                                )}

                                                {/* Scheduled: Picked Up */}
                                                {req.status === 'SCHEDULED' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, 'PICKED_UP')}
                                                        className="btn btn-warning text-white btn-sm px-3 fw-medium d-flex align-items-center shadow-sm w-100 justify-content-center" style={{ backgroundColor: '#f59e0b', border: 'none', maxWidth: '110px' }}>
                                                        <i className="bi bi-truck me-1"></i> Picked Up
                                                    </button>
                                                )}

                                                {/* Picked Up: Complete */}
                                                {req.status === 'PICKED_UP' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, 'COMPLETED')}
                                                        className="btn btn-success text-white btn-sm px-3 fw-medium d-flex align-items-center shadow-sm w-100 justify-content-center" style={{ backgroundColor: '#10b981', border: 'none', maxWidth: '110px' }}>
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

            {/* Schedule Modal */}
            {showScheduleModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Schedule Pickup</h5>
                                <button type="button" className="btn-close" onClick={() => setShowScheduleModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Assign Collector</label>
                                    <select
                                        className="form-select"
                                        value={selectedCollector}
                                        onChange={(e) => setSelectedCollector(e.target.value)}
                                    >
                                        <option value="">Select a collector...</option>
                                        {collectors.map(c => (
                                            <option key={c.userId} value={c.userId}>
                                                {c.name} ({c.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-light" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleScheduleSubmit}>Schedule</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageRequests;
