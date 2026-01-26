import React, { useState } from 'react';
import NavigableBar from '../new_components/NavigableBar';
import Footer from '../new_components/Footer';

const CollectorDashboard = () => {
    const [activeTab, setActiveTab] = useState('Assigned');

    // Placeholder data - in real app this comes from assignments
    const [tasks, setTasks] = useState([
        /* 
        { 
            id: 101, 
            customer: 'Alice Vendor', 
            location: '123 Tech Park, City', 
            items: '2x Servers, 5x Laptops', 
            status: 'Assigned',
            date: '2023-11-25'
        } 
        */
    ]);

    const stats = [
        { label: 'Assigned Pickups', count: tasks.filter(t => t.status === 'Assigned').length, icon: 'bi-truck', color: '#0f766e', bg: '#ccfbf1' },
        { label: 'Completed Today', count: 0, icon: 'bi-check-circle-fill', color: '#10b981', bg: '#d1fae5' },
        { label: 'Pending Verification', count: 0, icon: 'bi-hourglass-split', color: '#f59e0b', bg: '#fef3c7' }
    ];

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
                        <p className="text-muted small mb-0 mt-1">Manage your pickup assignments and routes</p>
                    </div>
                    <button className="btn d-flex align-items-center px-4 py-2 text-white" style={{ backgroundColor: '#f59e0b', border: 'none', borderRadius: '50px' }}>
                        <i className="bi bi-geo-alt me-2"></i>
                        <span className="fw-semibold">View Route Map</span>
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
                        <h5 className="fw-bold mb-0 text-secondary">Assigned Tasks</h5>
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
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Items</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Date</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Status</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold text-end px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5">
                                            <div className="d-flex flex-column align-items-center text-muted">
                                                <i className="bi bi-inbox fs-1 mb-2"></i>
                                                <p className="mb-0">No tasks currently assigned to you.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    tasks.map(task => (
                                        <tr key={task.id}>
                                            <td className="px-4 fw-medium">#{task.id}</td>
                                            <td>{task.customer}</td>
                                            <td><i className="bi bi-geo-alt-fill text-danger me-1"></i> {task.location}</td>
                                            <td>{task.items}</td>
                                            <td>{task.date}</td>
                                            <td><span className="badge bg-warning text-dark">Assigned</span></td>
                                            <td className="text-end px-4">
                                                <button className="btn btn-sm btn-success text-white">
                                                    Mark Picked Up
                                                </button>
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
