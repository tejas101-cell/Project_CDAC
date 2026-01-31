import React, { useState, useEffect } from 'react';
import NavigableBar from '../new_components/NavigableBar';
import Footer from '../new_components/Footer';
import requestService from '../Services/request.service';
import authService from '../Services/auth.service';
import recyclerService from '../Services/recycler.service';
import Notification from '../new_components/Notification';

const CollectorDashboard = () => {
    const [activeTab, setActiveTab] = useState('Assigned');
    const [tasks, setTasks] = useState([]);
    const [recyclers, setRecyclers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const currentUser = authService.getCurrentUser();
    const [availability, setAvailability] = useState(currentUser?.availability || 'AVAILABLE');

    // Handover Modal State
    const [showHandoverModal, setShowHandoverModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [selectedRecyclerId, setSelectedRecyclerId] = useState('');
    const [handoverLoading, setHandoverLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const showNotify = (message, type = 'success') => {
        setNotification({ show: true, message, type });
    };

    useEffect(() => {
        fetchTasks();
        fetchRecyclers();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await requestService.getCollectorRequests(currentUser.userId);
            setTasks(data);
            setError('');
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError('Failed to fetch assignments.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRecyclers = async () => {
        try {
            const response = await authService.getRecyclers();
            setRecyclers(response.data);
        } catch (err) {
            console.error('Error fetching recyclers:', err);
        }
    };

    const handleUpdateStatus = async (requestId, status) => {
        try {
            await requestService.updateStatus(requestId, status);
            const msg = status === 'PICKED_UP' ? 'Item marked as Picked Up!' : 'Item marked as Collected! You can now Handover to Recycler.';
            showNotify(msg);
            fetchTasks(); // Refresh
        } catch (err) {
            console.error('Error updating status:', err);
            showNotify('Failed to update status.', 'danger');
        }
    };

    const openHandoverModal = (requestId) => {
        setSelectedRequestId(requestId);
        setShowHandoverModal(true);
    };

    const handleHandover = async () => {
        if (!selectedRecyclerId) {
            showNotify('Please select a recycler', 'danger');
            return;
        }

        try {
            setHandoverLoading(true);
            await recyclerService.deliverWaste(selectedRequestId, currentUser.userId, selectedRecyclerId);
            showNotify('Handover recorded successfully! Item moved to history.');
            setShowHandoverModal(false);
            setSelectedRecyclerId('');
            fetchTasks(); // Refresh tasks to update status if needed
        } catch (err) {
            console.error('Handover failed:', err);
            showNotify('Handover failed. Ensure Recycler Service is running.', 'danger');
        } finally {
            setHandoverLoading(false);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'Assigned') {
            // Include COLLECTED here so user sees "Handover" button in active tab
            return task.status === 'SCHEDULED' || task.status === 'PICKED_UP' || task.status === 'COLLECTED';
        }
        // History only shows COMPLETED
        return task.status === 'COMPLETED' || task.status === 'DELIVERED';
    });

    const stats = [
        { label: 'Assigned Pickups', count: tasks.filter(t => t.status === 'SCHEDULED').length, icon: 'bi-truck', color: '#0f766e', bg: '#ccfbf1' },
        { label: 'Picked Up', count: tasks.filter(t => t.status === 'PICKED_UP').length, icon: 'bi-box-seam', color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Completed', count: tasks.filter(t => t.status === 'COMPLETED' || t.status === 'COLLECTED').length, icon: 'bi-check-circle-fill', color: '#10b981', bg: '#d1fae5' }
    ];

    if (loading) {
        return (
            <div className="min-vh-100 d-flex flex-column">
                <NavigableBar />
                <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const toggleAvailability = async () => {
        const newStatus = availability === 'AVAILABLE' ? 'BUSY' : 'AVAILABLE';
        try {
            await authService.updateAvailability(currentUser.userId, newStatus);
            setAvailability(newStatus);
            const updatedUser = { ...currentUser, availability: newStatus };
            authService.setCurrentUser(updatedUser);
        } catch (err) {
            console.error('Failed to update availability', err);
            showNotify('Failed to update availability status.', 'danger');
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8fafc' }}>
            <NavigableBar />

            {/* Premium Notification Bar */}
            <Notification
                show={notification.show}
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ ...notification, show: false })}
            />

            <main className="flex-grow-1 container py-5 mt-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4" style={{ borderLeftColor: '#f59e0b' }}>
                    <div>
                        <div className="d-flex align-items-center">
                            <i className="bi bi-truck fs-3 me-3" style={{ color: '#f59e0b' }}></i>
                            <h2 className="fw-bold mb-0" style={{ color: '#1a202c' }}>Collector Dashboard</h2>
                        </div>
                        <p className="text-muted small mb-0 mt-1">Hello, {currentUser?.name || 'Collector'}. Manage your assignments.</p>
                    </div>
                    <div className="d-flex gap-3">
                        <button
                            onClick={toggleAvailability}
                            className={`btn d-flex align-items-center px-4 py-2 text-white shadow-sm ${availability === 'AVAILABLE' ? 'btn-success' : 'btn-danger'}`}
                            style={{ borderRadius: '50px' }}>
                            <i className={`bi ${availability === 'AVAILABLE' ? 'bi-check-circle' : 'bi-slash-circle'} me-2`}></i>
                            <span className="fw-semibold">{availability === 'AVAILABLE' ? 'Available' : 'Busy'}</span>
                        </button>
                        <button onClick={fetchTasks} className="btn d-flex align-items-center px-4 py-2 text-white" style={{ backgroundColor: '#f59e0b', border: 'none', borderRadius: '50px' }}>
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            <span className="fw-semibold">Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="row g-4 mb-4">
                    {stats.map((stat, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body p-4 d-flex align-items-center">
                                    <div className="rounded-3 p-3 me-3 d-flex align-items-center justify-content-center"
                                        style={{ backgroundColor: stat.bg, width: '56px', height: '56px' }}>
                                        <i className={`bi ${stat.icon} fs-4`} style={{ color: stat.color }}></i>
                                    </div>
                                    <div>
                                        <h3 className="fw-bold mb-0">{stat.count}</h3>
                                        <p className="text-muted mb-0">{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tasks Section */}
                <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
                    <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0 text-secondary">{activeTab} Tasks</h5>
                        <div className="btn-group">
                            <button className={`btn btn-sm ${activeTab === 'Assigned' ? 'btn-warning text-white' : 'btn-outline-secondary'}`} onClick={() => setActiveTab('Assigned')}>Assigned</button>
                            <button className={`btn btn-sm ${activeTab === 'Completed' ? 'btn-success text-white' : 'btn-outline-secondary'}`} onClick={() => setActiveTab('Completed')}>History</button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-bold">ID</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Customer</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Location</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Date</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Status</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold text-end px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-5">
                                            <div className="d-flex flex-column align-items-center text-muted">
                                                <i className="bi bi-inbox fs-1 mb-2"></i>
                                                <p className="mb-0">No tasks found in this category.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTasks.map(task => (
                                        <tr key={task.requestId}>
                                            <td className="px-4 fw-medium">#{task.requestId}</td>
                                            <td>{task.user?.name || `User ${task.userID || task.userId || 'Unknown'}`}</td>
                                            <td><i className="bi bi-geo-alt-fill text-danger me-1"></i> {task.pickupAddress}</td>
                                            <td>{new Date(task.pickupDate).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${task.status === 'SCHEDULED' ? 'bg-warning text-dark' :
                                                    task.status === 'PICKED_UP' ? 'bg-info text-white' :
                                                        task.status === 'COLLECTED' ? 'bg-primary' : 'bg-success'
                                                    }`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="text-end px-4">
                                                {task.status === 'SCHEDULED' && (
                                                    <button
                                                        className="btn btn-sm btn-info text-white me-2 shadow-sm"
                                                        onClick={() => handleUpdateStatus(task.requestId, 'PICKED_UP')}
                                                    >
                                                        Pick Up
                                                    </button>
                                                )}
                                                {task.status === 'PICKED_UP' && (
                                                    <button
                                                        className="btn btn-sm btn-success text-white shadow-sm"
                                                        onClick={() => handleUpdateStatus(task.requestId, 'COLLECTED')}
                                                    >
                                                        Mark Collected
                                                    </button>
                                                )}
                                                {task.status === 'COLLECTED' && (
                                                    <button
                                                        className="btn btn-sm text-white shadow-sm"
                                                        style={{ backgroundColor: '#0ea5e9' }}
                                                        onClick={() => openHandoverModal(task.requestId)}
                                                    >
                                                        Handover to Recycler
                                                    </button>
                                                )}
                                                {task.status === 'COMPLETED' && (
                                                    <span className="text-success small fw-bold"><i className="bi bi-check-all"></i> COMPLETED</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Handover Modal */}
                {showHandoverModal && (
                    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg">
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold">Handover Waste to Recycler</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowHandoverModal(false)}></button>
                                </div>
                                <div className="modal-body py-4">
                                    <p className="text-muted mb-4">Select a registered recycler to deliver the collected e-waste batch #{selectedRequestId}.</p>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Available Recyclers</label>
                                        <select
                                            className="form-select form-select-lg shadow-sm"
                                            value={selectedRecyclerId}
                                            onChange={(e) => setSelectedRecyclerId(e.target.value)}
                                        >
                                            <option value="">Select a Recycler...</option>
                                            {recyclers.map(r => (
                                                <option key={r.userId} value={r.userId}>{r.name} ({r.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                    {recyclers.length === 0 && (
                                        <div className="alert alert-warning small">
                                            No active recyclers found. Please ensure recyclers are registered and approved in the system.
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-light px-4" onClick={() => setShowHandoverModal(false)}>Cancel</button>
                                    <button
                                        type="button"
                                        className="btn btn-primary px-4 shadow-sm"
                                        onClick={handleHandover}
                                        disabled={handoverLoading || !selectedRecyclerId}
                                    >
                                        {handoverLoading ? 'Processing...' : 'Confirm Handover'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default CollectorDashboard;
