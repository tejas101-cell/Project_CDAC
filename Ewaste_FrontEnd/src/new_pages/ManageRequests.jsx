import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import authService from '../Services/auth.service';
import requestService from '../Services/request.service';
import Navigablebar from '../new_components/NavigableBar';
import Notification from '../new_components/Notification';

const ManageRequests = () => {
    const [activeTab, setActiveTab] = useState('ALL');
    const [requests, setRequests] = useState([]);

    // Modal State
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [collectors, setCollectors] = useState([]);
    const [selectedCollector, setSelectedCollector] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const showNotify = (message, type = 'success') => {
        setNotification({ show: true, message, type });
    };

    useEffect(() => {
        fetchRequests();
        fetchCollectors();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await requestService.getAllRequests();
            const mappedRequests = data.map(req => ({
                id: req.requestID || req.requestId, // Handle both casings
                user: {
                    name: req.user?.name || `User ${req.userID || req.userId}`,
                    email: req.user?.email || 'N/A',
                    initial: req.user?.name ? req.user.name.charAt(0).toUpperCase() : (req.userID || req.userId || 'U').charAt(0).toUpperCase(),
                    color: '#3b82f6'
                },
                device: {
                    name: req.items && req.items.length > 0 ? req.items[0].itemName : 'Unknown',
                    model: 'N/A'
                },
                condition: req.items && req.items.length > 0 ? req.items[0].remarks : 'Unknown',
                qty: req.items && req.items.length > 0 ? req.items[0].quantity : 0,
                date: req.pickupDate, // Raw date for modal
                displayDate: req.pickupDate ? new Date(req.pickupDate).toLocaleDateString() : 'TBD',
                location: req.pickupAddress,
                submitted: req.requestDate ? new Date(req.requestDate).toLocaleDateString() : 'N/A',
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
            showNotify(`Request #${id} status updated to ${status}!`);
            fetchRequests(); // Refresh
        } catch (error) {
            console.error(`Failed to update status to ${status}`, error);
            showNotify(`Failed to update status.`, 'danger');
        }
    };

    const openScheduleModal = (req) => {
        setSelectedRequest(req);
        setShowScheduleModal(true);
        setSelectedCollector('');
    };

    const handleViewRequest = (req) => {
        setSelectedRequest(req);
        setShowViewModal(true);
    };

    const handleScheduleSubmit = async () => {
        if (!selectedCollector) {
            showNotify("Please select a collector", "danger");
            return;
        }
        try {
            await requestService.assignCollector(selectedRequest.id, selectedCollector, selectedRequest.date);
            showNotify(`Request #${selectedRequest.id} successfully scheduled and assigned!`);
            setShowScheduleModal(false);
            fetchRequests();
        } catch (error) {
            console.error("Failed to schedule request", error);
            showNotify(`Failed to schedule request.`, 'danger');
        }
    };

    const stats = [
        { label: 'Total', count: requests.length, icon: 'bi-list-ul', color: '#0f766e', bg: '#ccfbf1' },
        { label: 'Pending', count: requests.filter(r => r.status === 'PENDING' || r.status === 'Requested').length, icon: 'bi-clock', color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Accepted', count: requests.filter(r => r.status === 'ACCEPTED').length, icon: 'bi-check-circle', color: '#3b82f6', bg: '#dbeafe' },
        { label: 'Scheduled', count: requests.filter(r => r.status === 'SCHEDULED').length, icon: 'bi-calendar-check', color: '#8b5cf6', bg: '#ede9fe' },
        { label: 'Picked Up', count: requests.filter(r => r.status === 'PICKED_UP').length, icon: 'bi-truck', color: '#10b981', bg: '#d1fae5' },
        { label: 'Collected', count: requests.filter(r => r.status === 'COLLECTED').length, icon: 'bi-box-seam', color: '#6366f1', bg: '#e0e7ff' },
        { label: 'Completed', count: requests.filter(r => r.status === 'COMPLETED').length, icon: 'bi-check-circle-fill', color: '#0ea5e9', bg: '#e0f2fe' }
    ];

    const getStatusBadge = (status) => {
        const styles = {
            ACCEPTED: { bg: '#3b82f6', color: 'white' },
            PICKED_UP: { bg: '#10b981', color: 'white' },
            COLLECTED: { bg: '#6366f1', color: 'white' },
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

            {/* Premium Notification Bar */}
            <Notification
                show={notification.show}
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ ...notification, show: false })}
            />

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
                        {['ALL', 'PENDING', 'ACCEPTED', 'SCHEDULED', 'PICKED UP', 'COLLECTED', 'COMPLETED', 'REJECTED'].map(tab => (
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
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase">Pickup Date</th>
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase">Submitted</th>
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase">Status</th>
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.filter(req => req.id && (activeTab === 'ALL' || req.status === activeTab || (activeTab === 'PENDING' && req.status === 'Requested'))).map(req => (
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
                                        <td className="text-muted small">{req.displayDate}</td>
                                        <td className="text-muted small">{req.submitted}</td>
                                        <td>{getStatusBadge(req.status)}</td>
                                        <td className="text-end px-4">
                                            <div className="d-flex flex-column gap-2 align-items-end">
                                                <button
                                                    onClick={() => handleViewRequest(req)}
                                                    className="btn btn-warning text-white btn-sm px-3 fw-medium d-flex align-items-center shadow-sm w-100 justify-content-center" style={{ backgroundColor: '#f59e0b', border: 'none', maxWidth: '110px' }}>
                                                    <i className="bi bi-eye me-1"></i> View
                                                </button>

                                                {/* Pending: Approve & Reject */}
                                                {(req.status === 'PENDING' || req.status === 'Requested') && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req.id, 'ACCEPTED')}
                                                            className="btn btn-success text-white btn-sm px-3 fw-medium d-flex align-items-center shadow-sm w-100 justify-content-center" style={{ backgroundColor: '#10b981', border: 'none', maxWidth: '110px' }}>
                                                            <i className="bi bi-check-lg me-1"></i> Approve
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

                                                {/* Picked Up: Wait for Collector */}
                                                {(req.status === 'PICKED_UP') && (
                                                    <span className="text-muted small fst-italic">Waiting for Collector...</span>
                                                )}

                                                {/* Collected: Finalize */}
                                                {req.status === 'COLLECTED' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, 'COMPLETED')}
                                                        className="btn btn-success text-white btn-sm px-3 fw-medium d-flex align-items-center shadow-sm w-100 justify-content-center" style={{ backgroundColor: '#10b981', border: 'none', maxWidth: '110px' }}>
                                                        <i className="bi bi-check-circle-fill me-1"></i> Finalize
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
                                    <label className="form-label fw-semibold">Pickup Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={selectedRequest?.date || ''}
                                        onChange={(e) => setSelectedRequest(prev => ({ ...prev, date: e.target.value }))}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    <small className="text-muted">You can update the pickup date if needed.</small>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Assign Collector</label>
                                    <select
                                        className="form-select"
                                        value={selectedCollector}
                                        onChange={(e) => setSelectedCollector(e.target.value)}
                                    >
                                        <option value="">Select a collector...</option>
                                        {collectors.map(c => {
                                            const isAvailable = c.availability === 'AVAILABLE';
                                            return (
                                                <option key={c.userId} value={c.userId} disabled={!isAvailable} style={{ color: isAvailable ? 'green' : 'red' }}>
                                                    {c.name} ({c.email}) - {isAvailable ? 'AVAILABLE' : (c.availability || 'BUSY')}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-light" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleScheduleSubmit}>Assign & Schedule</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {showViewModal && selectedRequest && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header border-bottom-0">
                                <h5 className="modal-title fw-bold">Request Details #{selectedRequest.id}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase small text-muted mb-3">User Information</h6>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3 text-white fw-bold"
                                            style={{ width: '48px', height: '48px', backgroundColor: selectedRequest.user.color }}>
                                            {selectedRequest.user.initial}
                                        </div>
                                        <div>
                                            <div className="fw-bold">{selectedRequest.user.name}</div>
                                            <div className="text-muted small">{selectedRequest.user.email}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase small text-muted mb-3">Item Details</h6>
                                    <div className="p-3 bg-light rounded-3">
                                        <div className="row g-2">
                                            <div className="col-6">
                                                <small className="d-block text-muted">Device</small>
                                                <span className="fw-medium">{selectedRequest.device.name}</span>
                                            </div>
                                            <div className="col-6">
                                                <small className="d-block text-muted">Quantity</small>
                                                <span className="fw-medium">{selectedRequest.qty} Units</span>
                                            </div>
                                            <div className="col-12 mt-3">
                                                <small className="d-block text-muted">Condition/Remarks</small>
                                                <span className="fw-medium">{selectedRequest.condition}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h6 className="fw-bold text-uppercase small text-muted mb-3">Pickup Info</h6>
                                    <div className="d-flex mb-2">
                                        <i className="bi bi-geo-alt text-primary me-2"></i>
                                        <span>{selectedRequest.location}</span>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <i className="bi bi-calendar-event text-primary me-2"></i>
                                        <span>Scheduled: {selectedRequest.displayDate}</span>
                                    </div>
                                    <div className="d-flex">
                                        <i className="bi bi-flag text-primary me-2"></i>
                                        <span>Status: {getStatusBadge(selectedRequest.status)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageRequests;
