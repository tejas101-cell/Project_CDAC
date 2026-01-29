import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigableBar from '../new_components/NavigableBar';
import Footer from '../new_components/Footer';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [previousRequests, setPreviousRequests] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchUserRequests(parsedUser.userId || parsedUser.id);

            // Poll for updates every 5 seconds
            const intervalId = setInterval(() => {
                fetchUserRequests(parsedUser.userId || parsedUser.id);
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, []);

    const fetchUserRequests = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/requests/user/${userId}`);
            setPreviousRequests(response.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f0f2f5' }}>
            <NavigableBar />
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
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {previousRequests.map((req) => (
                                                    <tr key={req.id}>
                                                        <td>#{req.id}</td>
                                                        <td>{req.pickupDate}</td>
                                                        <td>{req.pickupAddress}</td>
                                                        <td>
                                                            <span className={`badge ${req.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                                {req.status}
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

