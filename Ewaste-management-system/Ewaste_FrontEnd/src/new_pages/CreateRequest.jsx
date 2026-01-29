import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavigableBar from '../new_components/NavigableBar';
import Footer from '../new_components/Footer';

const CreateRequest = () => {
    const navigate = useNavigate();
    const [requestDetails, setRequestDetails] = useState({
        pickupDate: '',
        pickupAddress: '',
        phone: ''
    });

    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState({
        itemName: '',
        quantity: 1,
        remarks: '',
        image: ''
    });

    const [user, setUser] = useState(null);
    const [customItemName, setCustomItemName] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } else {
            // Redirect to login if not logged in
            navigate('/login');
        }
    }, [navigate]);

    const handleDetailsChange = (e) => {
        const { name, value } = e.target;
        setRequestDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentItem(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddItem = () => {
        const finalItemName = currentItem.itemName === 'Other' ? customItemName : currentItem.itemName;

        if (!finalItemName || currentItem.quantity < 1) {
            alert("Please select an item name (or specify one) and ensure quantity is at least 1.");
            return;
        }

        const newItem = {
            ...currentItem,
            itemName: finalItemName
        };

        setItems(prev => [...prev, newItem]);
        setCurrentItem({
            itemName: '',
            quantity: 1,
            remarks: '',
            image: ''
        });
        setCustomItemName('');
    };

    const handleRemoveItem = (index) => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            setItems(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (items.length === 0) {
            alert("Please add at least one item to the request.");
            return;
        }

        const payload = {
            userId: user?.id || user?.userId || 1,
            pickupDate: requestDetails.pickupDate,
            pickupAddress: requestDetails.pickupAddress,
            items: items
        };

        try {
            // 1. Save in USER-SERVICE (populates ewate_requests, request_items)
            await axios.post('http://localhost:8080/api/requests', payload);

            // 2. Save in PICKUP-SERVICE (populates pickup_requests, pickup_items, status_logs)
            // PICKUP-SERVICE will automatically call TRACKING-SERVICE via Feign
            await axios.post('http://localhost:8080/api/pickups', payload);

            alert('E-Waste request submitted successfully across all services!');
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Failed to submit request: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f0f2f5' }}>
            <NavigableBar />
            <main className="flex-grow-1 container py-5 mt-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                            <div className="text-center py-4 bg-white border-bottom">
                                <h2 className="fw-bold mb-1" style={{ color: '#2d3748' }}>Submit E-Waste Request</h2>
                                <p className="text-muted">Schedule a pickup for your electronic waste</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 bg-white">
                                {/* Section 1: Add Items */}
                                <h5 className="mb-3 fw-bold" style={{ color: '#2d3748' }}>1. Add Items</h5>
                                <div className="p-3 bg-light rounded-2 mb-3">
                                    <div className="row g-3 align-items-end">
                                        <div className="col-md-4">
                                            <label className="form-label small fw-semibold text-muted">Item Name</label>
                                            <select name="itemName" className="form-select" value={currentItem.itemName} onChange={handleItemChange}>
                                                <option value="">Select Item</option>
                                                <option value="Laptop">Laptop</option>
                                                <option value="Mobile Phone">Mobile Phone</option>
                                                <option value="Monitor">Monitor</option>
                                                <option value="Keyboard/Mouse">Keyboard/Mouse</option>
                                                <option value="Printer">Printer</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label small fw-semibold text-muted">Quantity</label>
                                            <input type="number" name="quantity" className="form-control" value={currentItem.quantity} onChange={handleItemChange} min="1" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small fw-semibold text-muted">Remarks</label>
                                            <input type="text" name="remarks" className="form-control" value={currentItem.remarks} onChange={handleItemChange} placeholder="Condition, etc." />
                                        </div>
                                        <div className="col-12 mt-2">
                                            <label className="form-label small fw-semibold text-muted">Upload Image (Optional)</label>
                                            <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                                            {currentItem.image && (
                                                <div className="mt-2">
                                                    <span className="badge bg-success me-2">Image Selected</span>
                                                    <img src={currentItem.image} alt="Preview" style={{ height: '50px', objectFit: 'cover' }} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-2 mt-3">
                                            <button type="button" className="btn btn-primary w-100" onClick={handleAddItem} style={{ backgroundColor: '#0F766E', borderColor: '#0F766E' }}>
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    {currentItem.itemName === 'Other' && (
                                        <div className="row g-3 mt-2">
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold text-muted">Specify Item Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={customItemName}
                                                    onChange={(e) => setCustomItemName(e.target.value)}
                                                    placeholder="Enter custom item name"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* List of Added Items */}
                                {items.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="fw-bold text-muted mb-2">Items to Pickup:</h6>
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-sm">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Item Name</th>
                                                        <th>Qty</th>
                                                        <th>Remarks</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                {item.itemName}
                                                                {item.image && <div><img src={item.image} alt="item" style={{ height: '30px', marginTop: '5px' }} /></div>}
                                                            </td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.remarks}</td>
                                                            <td>
                                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveItem(index)}>
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                <hr className="my-4" />

                                {/* Section 2: Pickup Details */}
                                <h5 className="mb-3 fw-bold" style={{ color: '#2d3748' }}>2. Pickup Details</h5>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold text-muted">Pickup Date *</label>
                                        <input
                                            type="date"
                                            name="pickupDate"
                                            className="form-control"
                                            value={requestDetails.pickupDate}
                                            onChange={handleDetailsChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold text-muted">Phone Number</label>
                                        <input type="tel" name="phone" className="form-control" value={requestDetails.phone} onChange={handleDetailsChange} placeholder="Contact number" />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-semibold text-muted">Pickup Address *</label>
                                        <textarea name="pickupAddress" className="form-control" rows="2" value={requestDetails.pickupAddress} onChange={handleDetailsChange} placeholder="Enter full address" required></textarea>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end gap-3 pt-3">
                                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate('/dashboard')}>Cancel</button>
                                    <button type="submit" className="btn text-white px-5" style={{ backgroundColor: '#0F766E' }}>
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreateRequest;
