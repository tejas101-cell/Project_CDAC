import React, { useState, useEffect } from 'react';
import NavigableBar from '../new_components/NavigableBar';
import Footer from '../new_components/Footer';
import requestService from '../Services/request.service';
import authService from '../Services/auth.service';

const CollectorDashboard = () => {
    const [activeTab, setActiveTab] = useState('Assigned');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        fetchTasks();
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

    const handleUpdateStatus = async (requestId, status) => {
        try {
            await requestService.updateStatus(requestId, status);
            fetchTasks(); // Refresh
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status.');
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'Assigned') {
            return task.status === 'SCHEDULED' || task.status === 'PICKED_UP';
        }
        return task.status === 'COMPLETED';
    });

    const stats = [
        { label: 'Assigned Pickups', count: tasks.filter(t => t.status === 'SCHEDULED').length, icon: 'bi-truck', color: '#0f766e', bg: '#ccfbf1' },
        { label: 'Picked Up', count: tasks.filter(t => t.status === 'PICKED_UP').length, icon: 'bi-box-seam', color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Completed', count: tasks.filter(t => t.status === 'COMPLETED').length, icon: 'bi-check-circle-fill', color: '#10b981', bg: '#d1fae5' }
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

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8fafc' }}>
            <NavigableBar />
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
                    <button className="btn d-flex align-items-center px-4 py-2 text-white" style={{ backgroundColor: '#f59e0b', border: 'none', borderRadius: '50px' }}>
                        <i className="bi bi-geo-alt me-2"></i>
                        <span className="fw-semibold">Refresh List</span>
                    </button>
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
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="d-flex flex-column align-items-center text-muted">
                                                <i className="bi bi-inbox fs-1 mb-2"></i>
                                                <p className="mb-0">No tasks found in this category.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTasks.map(task => (
                                        <tr key={task.id}>
                                            <td className="px-4 fw-medium">#{task.id}</td>
                                            <td>{task.user?.name}</td>
                                            <td><i className="bi bi-geo-alt-fill text-danger me-1"></i> {task.pickupAddress}</td>
                                            <td>{new Date(task.pickupDate).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${task.status === 'SCHEDULED' ? 'bg-warning text-dark' :
                                                        task.status === 'PICKED_UP' ? 'bg-info text-white' :
                                                            'bg-success'
                                                    }`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="text-end px-4">
                                                {task.status === 'SCHEDULED' && (
                                                    <button
                                                        className="btn btn-sm btn-info text-white me-2"
                                                        onClick={() => handleUpdateStatus(task.id, 'PICKED_UP')}
                                                    >
                                                        Pick Up
                                                    </button>
                                                )}
                                                {task.status === 'PICKED_UP' && (
                                                    <button
                                                        className="btn btn-sm btn-success text-white"
                                                        onClick={() => handleUpdateStatus(task.id, 'COMPLETED')}
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CollectorDashboard;
