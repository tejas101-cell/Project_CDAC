import React, { useState, useEffect } from 'react';
import NavigableBar from '../new_components/NavigableBar';
import Footer from '../new_components/Footer';
import authService from '../Services/auth.service';
import recyclerService from '../Services/recycler.service';
import Notification from '../new_components/Notification';

const RecyclerDashboard = () => {
    const [activeTab, setActiveTab] = useState('Arrivals');
    const [currentUser, setCurrentUser] = useState(null);
    const [arrivals, setArrivals] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const showNotify = (message, type = 'success') => {
        setNotification({ show: true, message, type });
    };

    useEffect(() => {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        if (user) {
            fetchDashboardData(user.userId);
        }
    }, []);

    const fetchDashboardData = async (userId) => {
        try {
            setLoading(true);
            const pendingData = await recyclerService.getPendingArrivals(userId).catch(() => []);
            const inventoryData = await recyclerService.getInventory(userId).catch(() => []);

            setArrivals(pendingData);
            setInventory(inventoryData);
            setError('');
        } catch (err) {
            console.error('Error fetching recycler data:', err);
            setError('Failed to fetch dashboard data. Ensure Backend Services are running.');
        } finally {
            setLoading(false);
        }
    };

    const handleReceive = async (requestId) => {
        try {
            await recyclerService.markReceived(requestId);
            showNotify('Item marked as Received and moved to Inventory!');
            fetchDashboardData(currentUser.userId);
        } catch (err) {
            console.error('Receive failed:', err);
            showNotify('Failed to mark as received.', 'danger');
        }
    };

    const handleRecycle = async (requestId) => {
        try {
            await recyclerService.markDecomposed(requestId);
            showNotify('Item marked as Recycled. Disposal Certificate Issued!');
            fetchDashboardData(currentUser.userId);
        } catch (err) {
            console.error('Recycle failed:', err);
            showNotify('Failed to mark as recycled.', 'danger');
        }
    };

    const stats = [
        { label: 'Pending Arrivals', count: arrivals.length, icon: 'bi-box-seam', color: '#0ea5e9', bg: '#e0f2fe' },
        { label: 'In Inventory', count: inventory.filter(i => i.status !== 'Decomposed').length, icon: 'bi-gear-wide-connected', color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Total Recycled', count: inventory.filter(i => i.status === 'Decomposed').length, icon: 'bi-recycle', color: '#10b981', bg: '#d1fae5' }
    ];

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8fafc' }}>
            <NavigableBar />

            <Notification
                show={notification.show}
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ ...notification, show: false })}
            />
            <main className="flex-grow-1 container py-5 mt-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4" style={{ borderLeftColor: '#0ea5e9' }}>
                    <div>
                        <div className="d-flex align-items-center">
                            <i className="bi bi-recycle fs-3 me-3" style={{ color: '#0ea5e9' }}></i>
                            <h2 className="fw-bold mb-0" style={{ color: '#1a202c' }}>Recycler Dashboard</h2>
                        </div>
                        <p className="text-muted small mb-0 mt-1">Hello, {currentUser?.name || 'Recycler'}. Manage material recovery and recycling workflows.</p>
                    </div>
                    <button onClick={() => fetchDashboardData(currentUser.userId)} className="btn d-flex align-items-center px-4 py-2 text-white" style={{ backgroundColor: '#0ea5e9', border: 'none', borderRadius: '50px' }}>
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        <span className="fw-semibold">Refresh</span>
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

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-info" role="status"></div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : (
                    <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
                        <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-secondary">
                                {activeTab === 'Arrivals' ? 'Pending Handover Requests' : 'Material Inventory'}
                            </h5>
                            <div className="btn-group">
                                <button className={`btn btn-sm ${activeTab === 'Arrivals' ? 'btn-info text-white' : 'btn-outline-secondary'}`} onClick={() => setActiveTab('Arrivals')}>Arrivals</button>
                                <button className={`btn btn-sm ${activeTab === 'Inventory' ? 'btn-success text-white' : 'btn-outline-secondary'}`} onClick={() => setActiveTab('Inventory')}>Inventory/History</button>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-bold">ID</th>
                                        <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Status</th>
                                        <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Date</th>
                                        <th className="py-3 border-0 small text-uppercase text-muted fw-bold text-end px-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeTab === 'Arrivals' ? (
                                        arrivals.length === 0 ? (
                                            <tr><td colSpan="4" className="text-center py-5">No pending arrivals.</td></tr>
                                        ) : (
                                            arrivals.map((item, idx) => (
                                                <tr key={`arrival-${item.requestId}-${idx}`}>
                                                    <td className="px-4 fw-medium">#{item.requestId}</td>
                                                    <td><span className="badge bg-info">{item.status}</span></td>
                                                    <td>{new Date(item.deliveredAt).toLocaleString()}</td>
                                                    <td className="text-end px-4">
                                                        <button onClick={() => handleReceive(item.requestId)} className="btn btn-sm btn-outline-info">Mark Received</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                    ) : (
                                        inventory.length === 0 ? (
                                            <tr><td colSpan="4" className="text-center py-5">Inventory is empty.</td></tr>
                                        ) : (
                                            inventory.map((item, idx) => (
                                                <tr key={`inv-${item.requestId}-${idx}`}>
                                                    <td className="px-4 fw-medium">#{item.requestId}</td>
                                                    <td>
                                                        <span className={`badge ${item.status === 'Decomposed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(item.receivedAt).toLocaleString()}</td>
                                                    <td className="text-end px-4">
                                                        {item.status !== 'Decomposed' && (
                                                            <button onClick={() => handleRecycle(item.requestId)} className="btn btn-sm btn-outline-success">Recycle & Issue Certificate</button>
                                                        )}
                                                        {item.status === 'Decomposed' && (
                                                            <span className="text-success small fw-bold">Certificate Issued</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default RecyclerDashboard;
