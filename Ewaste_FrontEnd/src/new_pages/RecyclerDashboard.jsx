import React, { useState } from 'react';
import NavigableBar from '../new_components/NavigableBar';
import Footer from '../new_components/Footer';

const RecyclerDashboard = () => {
    const [activeTab, setActiveTab] = useState('Pending');

    // Placeholder data
    const [jobs, setJobs] = useState([
        /*
        {
            id: 'R-2023-001',
            source: 'Collector A',
            batchType: 'Laptops',
            weight: '45 kg',
            status: 'Processing',
            date: '2023-11-26'
        }
        */
    ]);

    const stats = [
        { label: 'Materials Received', count: 0, icon: 'bi-box-seam', color: '#0ea5e9', bg: '#e0f2fe' },
        { label: 'Processing', count: jobs.filter(j => j.status === 'Processing').length, icon: 'bi-gear-wide-connected', color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Recycled', count: 0, icon: 'bi-recycle', color: '#10b981', bg: '#d1fae5' }
    ];

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8fafc' }}>
            <NavigableBar />
            <main className="flex-grow-1 container py-5 mt-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4" style={{ borderLeftColor: '#0ea5e9' }}>
                    <div>
                        <div className="d-flex align-items-center">
                            <i className="bi bi-recycle fs-3 me-3" style={{ color: '#0ea5e9' }}></i>
                            <h2 className="fw-bold mb-0" style={{ color: '#1a202c' }}>Recycler Dashboard</h2>
                        </div>
                        <p className="text-muted small mb-0 mt-1">Manage material processing and recovery</p>
                    </div>
                    <button className="btn d-flex align-items-center px-4 py-2 text-white" style={{ backgroundColor: '#0ea5e9', border: 'none', borderRadius: '50px' }}>
                        <i className="bi bi-file-earmark-bar-graph me-2"></i>
                        <span className="fw-semibold">Generate Report</span>
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

                {/* Jobs Section */}
                <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
                    <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0 text-secondary">Recycling Jobs</h5>
                        <div className="btn-group">
                            <button className={`btn btn-sm ${activeTab === 'Pending' ? 'btn-info text-white' : 'btn-outline-secondary'}`} onClick={() => setActiveTab('Pending')}>Pending</button>
                            <button className={`btn btn-sm ${activeTab === 'Processing' ? 'btn-warning text-white' : 'btn-outline-secondary'}`} onClick={() => setActiveTab('Processing')}>Processing</button>
                            <button className={`btn btn-sm ${activeTab === 'Completed' ? 'btn-success text-white' : 'btn-outline-secondary'}`} onClick={() => setActiveTab('Completed')}>Completed</button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-bold">Job ID</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Source</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Batch Type</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Total Weight</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Date Received</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Status</th>
                                    <th className="py-3 border-0 small text-uppercase text-muted fw-bold text-end px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5">
                                            <div className="d-flex flex-column align-items-center text-muted">
                                                <i className="bi bi-box-seam fs-1 mb-2"></i>
                                                <p className="mb-0">No recycling jobs available.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    jobs.map(job => (
                                        <tr key={job.id}>
                                            <td className="px-4 fw-medium">{job.id}</td>
                                            <td>{job.source}</td>
                                            <td>{job.batchType}</td>
                                            <td>{job.weight}</td>
                                            <td>{job.date}</td>
                                            <td><span className="badge bg-warning text-dark">{job.status}</span></td>
                                            <td className="text-end px-4">
                                                <button className="btn btn-sm btn-primary text-white">
                                                    Process
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

export default RecyclerDashboard;
