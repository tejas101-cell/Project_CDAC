import React, { useState, useEffect } from 'react';
import recyclerService from '../Services/recycler.service';

const CertificateModal = ({ show, requestId, onClose }) => {
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show && requestId) {
            fetchCertificate();
        }
    }, [show, requestId]);

    const fetchCertificate = async () => {
        setLoading(true);
        try {
            const data = await recyclerService.getCertificate(requestId);
            setCertificate(data);
        } catch (error) {
            console.error("Error fetching certificate:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                    <div className="modal-header border-0 pb-0">
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4 p-md-5">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-3 text-muted fw-medium">Generating your certificate...</p>
                            </div>
                        ) : certificate ? (
                            <div id="printable-certificate" className="certificate-container p-5 text-center position-relative overflow-hidden"
                                style={{
                                    border: '15px double #0D9488',
                                    backgroundColor: '#fff',
                                    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
                                }}>
                                {/* Background Decorative Element */}
                                <div className="position-absolute top-50 start-50 translate-middle" style={{ opacity: 0.03, fontSize: '20rem', pointerEvents: 'none' }}>
                                    <i className="bi bi-shield-check"></i>
                                </div>

                                <div className="mb-4">
                                    <h4 className="fw-bold text-uppercase" style={{ color: '#0D9488', letterSpacing: '4px' }}>Certificate of Proper Disposal</h4>
                                    <p className="text-muted small">Smart E-Waste Management System</p>
                                </div>

                                <hr className="w-50 mx-auto mb-5" />

                                <div className="mb-5">
                                    <p className="fs-5 mb-1">This is to certify that the e-waste associated with</p>
                                    <h5 className="fw-bold mb-3">Request ID: #{certificate.requestId}</h5>
                                    <p className="fs-5">has been successfully collected and processed in an</p>
                                    <h4 className="fw-bold" style={{ color: '#0F766E' }}>Environmentally Responsible Manner</h4>
                                </div>

                                <div className="row g-4 mt-5">
                                    <div className="col-md-6">
                                        <p className="text-muted small mb-1">Certificate Number</p>
                                        <p className="fw-bold mb-0">{certificate.certificateNumber}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted small mb-1">Date of Issue</p>
                                        <p className="fw-bold mb-0">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="mt-5 pt-3">
                                    <div className="d-flex justify-content-center align-items-center gap-3">
                                        <div style={{ width: '80px', height: '1px', backgroundColor: '#e2e8f0' }}></div>
                                        <i className="bi bi-patch-check-fill fs-3" style={{ color: '#059669' }}></i>
                                        <div style={{ width: '80px', height: '1px', backgroundColor: '#e2e8f0' }}></div>
                                    </div>
                                    <p className="text-muted mt-2 small">Verified Sustainable Recycling Process</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                                    <i className="bi bi-patch-question fs-1 text-warning"></i>
                                </div>
                                <h4 className="fw-bold mb-2">Certificate Not Generated</h4>
                                <p className="text-muted px-4">This request is still in progress. Please check back after the recycler has completed the decomposition process.</p>
                                <button className="btn btn-sm btn-outline-secondary mt-3" onClick={onClose}>Understood</button>
                            </div>
                        )}
                    </div>
                    {certificate && (
                        <div className="modal-footer border-0 pt-0 pb-4 px-4 px-md-5 justify-content-center">
                            <button type="button" className="btn btn-light px-4 py-2 fw-medium me-2" style={{ borderRadius: '10px' }} onClick={onClose}>Close</button>
                            <button type="button" className="btn text-white px-4 py-2 fw-medium shadow-sm transition-all"
                                style={{ backgroundColor: '#0D9488', borderRadius: '10px' }}
                                onClick={handlePrint}
                                onMouseOver={(e) => e.target.style.filter = 'brightness(1.1)'}
                                onMouseOut={(e) => e.target.style.filter = 'none'}
                            >
                                <i className="bi bi-printer me-2"></i> Print Certificate
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>
                {`
                    .transition-all { transition: all 0.3s ease; }
                    .certificate-container { border-radius: 8px; box-shadow: inset 0 0 50px rgba(13, 148, 136, 0.05); }
                    @media print {
                        body * { visibility: hidden; }
                        #printable-certificate, #printable-certificate * { visibility: visible; }
                        #printable-certificate {
                            position: fixed;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            border: none !important;
                            padding: 20px !important;
                            margin: 0 !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default CertificateModal;
