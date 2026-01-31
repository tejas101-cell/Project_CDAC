import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import requestService from '../Services/request.service';
import NavigableBar from '../new_components/NavigableBar';
import Footer from '../new_components/Footer';
import Notification from '../new_components/Notification';

const RequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const showNotify = (message, type = 'success') => {
        setNotification({ show: true, message, type });
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this request? This action cannot be undone.")) {
            try {
                await requestService.deleteRequest(id);
                // alert("Request deleted successfully");
                navigate('/my-requests');
            } catch (error) {
                console.error("Failed to delete request", error);
                showNotify("Failed to delete request. Please try again.", "danger");
            }
        }
    };

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const response = await requestService.getRequestById(id);
                setRequest(response.data);
            } catch (error) {
                console.error("Failed to fetch request details", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRequest();

            // Poll for updates every 5 seconds
            const intervalId = setInterval(() => {
                fetchRequest();
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-vh-100 d-flex flex-column">
                <NavigableBar />
                <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-teal" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="min-vh-100 d-flex flex-column">
                <NavigableBar />
                <div className="flex-grow-1 container py-5 mt-5 text-center">
                    <h3 className="text-muted">Request not found</h3>
                    <Link to="/my-requests" className="btn btn-primary mt-3">Back to My Requests</Link>
                </div>
            </div>
        );
    }

    const mainItem = request.items && request.items.length > 0 ? request.items[0] : {};

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
                <div className="mb-4">
                    <Link to="/my-requests" className="text-decoration-none text-muted d-flex align-items-center">
                        <i className="bi bi-arrow-left me-2"></i> Back to My Requests
                    </Link>
                </div>

                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="card-header bg-white border-0 py-4 px-4 px-md-5 d-flex justify-content-between align-items-center flex-wrap gap-3">
                                <div>
                                    <h5 className="text-muted text-uppercase small fw-bold mb-1">Request #{request.requestId}</h5>
                                    <h2 className="fw-bold mb-0 text-dark">{mainItem.itemName || 'E-Waste Item'}</h2>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <span className="badge rounded-pill px-3 py-2 fw-bold"
                                        style={{ backgroundColor: request.status === 'PENDING' ? '#f59e0b' : '#10b981', fontSize: '0.9rem' }}>
                                        {request.status.replace('_', ' ')}
                                    </span>
                                    {request.status === 'PENDING' && (
                                        <button onClick={handleDelete} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 fw-medium px-3 py-2" style={{ borderRadius: '8px' }}>
                                            <i className="bi bi-trash"></i> Delete
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="card-body p-4 p-md-5 pt-0">
                                <hr className="mb-4 mt-0 text-muted opacity-25" />

                                <div className="row g-4 mb-4">
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-muted text-uppercase small mb-3">Item Details</h6>
                                        <ul className="list-unstyled">
                                            <li className="mb-2 d-flex justify-content-between">
                                                <span className="text-muted">Quantity:</span>
                                                <span className="fw-medium">{mainItem.quantity} units</span>
                                            </li>
                                            <li className="mb-2 d-flex justify-content-between">
                                                <span className="text-muted">Condition:</span>
                                                <span className="fw-medium">{mainItem.remarks}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-muted text-uppercase small mb-3">Pickup Information</h6>
                                        <div className="d-flex mb-3">
                                            <i className="bi bi-geo-alt text-teal fs-5 me-3" style={{ color: '#0f766e' }}></i>
                                            <div>
                                                <span className="d-block fw-medium text-dark">Address</span>
                                                <span className="text-muted small">{request.pickupAddress}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-3">
                                            <i className="bi bi-calendar-event text-teal fs-5 me-3" style={{ color: '#0f766e' }}></i>
                                            <div>
                                                <span className="d-block fw-medium text-dark">Preferred Date</span>
                                                <span className="text-muted small">{request.scheduledDate || 'Not scheduled'}</span>
                                            </div>
                                        </div>
                                        {request.pickupDate && (
                                            <div className="d-flex mb-3">
                                                <i className="bi bi-truck text-teal fs-5 me-3" style={{ color: '#0f766e' }}></i>
                                                <div>
                                                    <span className="d-block fw-medium text-dark">Scheduled Pickup</span>
                                                    <span className="text-muted small">{request.pickupDate}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-light p-4 rounded-3">
                                    <h6 className="fw-bold text-dark mb-3">Track Status</h6>
                                    <div className="position-relative m-4">
                                        <div className="progress" style={{ height: '2px' }}>
                                            <div className="progress-bar bg-teal" role="progressbar"
                                                style={{
                                                    width: ['COMPLETED', 'COLLECTED'].includes(request.status) ? '100%' :
                                                        request.status === 'PICKED_UP' ? '70%' :
                                                            request.status === 'SCHEDULED' ? '50%' :
                                                                request.status === 'ACCEPTED' ? '35%' : '15%',
                                                    backgroundColor: '#0f766e'
                                                }}></div>
                                        </div>
                                        {/* Step 1: PbSubmited */}
                                        <div className="position-absolute top-0 start-0 translate-middle btn btn-sm rounded-pill btn-primary" style={{ backgroundColor: '#0f766e', border: 'none' }}>1</div>

                                        {/* Step 2: Scheduled/PickedUp */}
                                        <div className={`position-absolute top-0 start-50 translate-middle btn btn-sm rounded-pill ${['SCHEDULED', 'PICKED_UP', 'COLLECTED', 'COMPLETED'].includes(request.status) ? 'btn-primary' : 'btn-secondary'}`} style={{ backgroundColor: ['SCHEDULED', 'PICKED_UP', 'COLLECTED', 'COMPLETED'].includes(request.status) ? '#0f766e' : '#e2e8f0', border: 'none' }}>2</div>

                                        {/* Step 3: Collected/Completed */}
                                        <div className={`position-absolute top-0 start-100 translate-middle btn btn-sm rounded-pill ${['COLLECTED', 'COMPLETED'].includes(request.status) ? 'btn-primary' : 'btn-secondary'}`} style={{ backgroundColor: ['COLLECTED', 'COMPLETED'].includes(request.status) ? '#0f766e' : '#e2e8f0', border: 'none' }}>3</div>
                                    </div>
                                    <div className="d-flex justify-content-between text-muted small px-2">
                                        <span>Submitted</span>
                                        <span>Scheduled</span>
                                        <span>Collected/Done</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RequestDetails;
