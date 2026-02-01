import React, { useState, useEffect } from 'react';
import requestService from '../Services/request.service';
import authService from '../Services/auth.service';
import NavigableBar from '../new_components/NavigableBar';
import Footer from '../new_components/Footer';
import Notification from '../new_components/Notification';
import CertificateModal from '../new_components/CertificateModal';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [previousRequests, setPreviousRequests] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [selectedCertRequestId, setSelectedCertRequestId] = useState(null);
    const [showCertModal, setShowCertModal] = useState(false);

    const showNotify = (message, type = 'success') => {
        setNotification({ show: true, message, type });
    };

    useEffect(() => {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
            fetchUserRequests(storedUser.userId);

            // Poll for updates every 5 seconds
            const intervalId = setInterval(() => {
                fetchUserRequests(storedUser.userId);
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, []);

    const fetchUserRequests = async (userId) => {
        try {
            const response = await requestService.getUserRequests(userId);
            setPreviousRequests(response.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f0f2f5' }}>
            <NavigableBar />

            <Notification
                show={notification.show}
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ ...notification, show: false })}
            />

            <CertificateModal
                show={showCertModal}
                requestId={selectedCertRequestId}
                onClose={() => setShowCertModal(false)}
            />
            <main className="flex-grow-1 container py-5 mt-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        {/* Dashboard Header */}
                        <div className="text-center py-4 mb-4">
                            <h2 className="fw-bold mb-1" style={{ color: '#2d3748' }}>User Dashboard</h2>
                            <p className="text-muted">View and manage your e-waste pickup requests</p>
                        </div>

                        {/* Previous Requests Section */}
                        {previousRequests.length > 0 ? (
                            <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                                <div className="text-center py-4 bg-white border-bottom">
                                    <h3 className="fw-bold mb-1" style={{ color: '#2d3748' }}>Previous Requests</h3>
                                </div>
                                <div className="p-4 bg-white">
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Request ID</th>
                                                    <th>Pickup Date</th>
                                                    <th>Address</th>
                                                    <th>Status</th>
                                                    <th>Items</th>
                                                    <th className="text-center">Certificate</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {previousRequests.map((req) => (
                                                    <tr key={req.requestId}>
                                                        <td>#{req.userRequestNo || req.requestId}</td>
                                                        <td>{req.pickupDate}</td>
                                                        <td>{req.pickupAddress}</td>
                                                        <td>
                                                            <span className={`badge ${req.status === 'PENDING' ? 'bg-warning text-dark' :
                                                                req.status === 'ACCEPTED' ? 'bg-primary' :
                                                                    req.status === 'SCHEDULED' ? 'bg-info text-dark' :
                                                                        req.status === 'PICKED_UP' ? 'bg-secondary' :
                                                                            req.status === 'COLLECTED' ? 'bg-indigo text-white' : // using custom or close match
                                                                                'bg-success'
                                                                }`} style={{ backgroundColor: req.status === 'COLLECTED' ? '#6366f1' : '' }}>
                                                                {req.status.replace('_', ' ')}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <ul className="list-unstyled mb-0">
                                                                {req.items.map((item, i) => (
                                                                    <li key={i} className="small">
                                                                        {item.quantity}x {item.itemName}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </td>
                                                        <td className="text-center">
                                                            {((req.status || '').toUpperCase() === 'DECOMPOSED' || (req.status || '').toUpperCase() === 'COMPLETED') ? (
                                                                <button
                                                                    className="btn btn-sm text-white px-3 fw-medium"
                                                                    style={{ backgroundColor: '#0D9488', borderRadius: '6px' }}
                                                                    onClick={() => {
                                                                        setSelectedCertRequestId(req.requestId);
                                                                        setShowCertModal(true);
                                                                    }}
                                                                >
                                                                    <i className="bi bi-patch-check me-1"></i> View
                                                                </button>
                                                            ) : (
                                                                <span className="text-muted small">Pending...</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <p className="text-muted fs-5">You haven't made any requests yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserDashboard;

