import React, { useEffect } from 'react';

const Notification = ({ show, message, type, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    const styles = {
        success: {
            bg: 'rgba(16, 185, 129, 0.95)',
            icon: 'bi-check2-circle',
            border: '#059669'
        },
        danger: {
            bg: 'rgba(239, 68, 68, 0.95)',
            icon: 'bi-exclamation-octagon',
            border: '#dc2626'
        },
        info: {
            bg: 'rgba(14, 165, 233, 0.95)',
            icon: 'bi-info-circle',
            border: '#0284c7'
        }
    };

    const currentStyle = styles[type] || styles.info;

    return (
        <div className="fixed-top mt-4 mx-auto px-3" style={{ zIndex: 99999, pointerEvents: 'none' }}>
            <div className="mx-auto shadow-lg d-flex align-items-center"
                style={{
                    maxWidth: '450px',
                    backgroundColor: currentStyle.bg,
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '16px',
                    borderLeft: `8px solid ${currentStyle.border}`,
                    pointerEvents: 'auto',
                    animation: 'notificationSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
                }}>
                <style>
                    {`
                        @keyframes notificationSlideIn {
                            from { transform: translateY(-100%) scale(0.9); opacity: 0; }
                            to { transform: translateY(0) scale(1); opacity: 1; }
                        }
                    `}
                </style>
                <div className="me-3 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className={`bi ${currentStyle.icon} fs-3`}></i>
                </div>
                <div className="flex-grow-1 fw-bold" style={{ fontSize: '0.95rem', letterSpacing: '0.3px' }}>
                    {message}
                </div>
                <button
                    type="button"
                    className="btn-close btn-close-white ms-3"
                    onClick={onClose}
                    style={{ filter: 'brightness(0) invert(1)', opacity: 0.8 }}
                ></button>
            </div>
        </div>
    );
};

export default Notification;
