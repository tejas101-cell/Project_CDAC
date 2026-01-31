import apiClient from './api.config';

/**
 * RECYCLER SERVICE
 * Handles communication with the Recycler-Service via API Gateway
 */

const deliverWaste = (requestId, collectorId, recyclerId) => {
    return apiClient.post('/api/recycle/deliver', {
        requestId,
        collectorId,
        recyclerId
    });
};

const getPendingArrivals = (recyclerId) => {
    // This calls the proposed backend endpoint: GET /api/recycle/pending/{recyclerId}
    return apiClient.get(`/api/recycle/pending/${recyclerId}`).then(res => res.data);
};

const getInventory = (recyclerId) => {
    // This calls the proposed backend endpoint: GET /api/recycle/inventory/{recyclerId}
    return apiClient.get(`/api/recycle/inventory/${recyclerId}`).then(res => res.data);
};

const markReceived = (requestId) => {
    return apiClient.post(`/api/recycle/receive/${requestId}`);
};

const markDecomposed = (requestId) => {
    return apiClient.post(`/api/recycle/decompose/${requestId}`);
};

const getCertificate = (requestId) => {
    return apiClient.get(`/api/recycle/certificate/${requestId}`).then(res => res.data);
};

export default {
    deliverWaste,
    getPendingArrivals,
    getInventory,
    markReceived,
    markDecomposed,
    getCertificate
};
