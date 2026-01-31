import apiClient from './api.config';

/**
 * REQUEST SERVICE
 * Handles E-Waste Pickup Requests (via PICKUP-SERVICE on Port 8082 through Gateway)
 */

const createRequest = (requestData) => {
    // Note: The backend controller is mapped to @RequestMapping("/api") and @PostMapping("/pickups")
    // Gateway routes /api/pickups/** to PICKUP-SERVICE
    return apiClient.post('/api/pickups', requestData);
};

const getUserRequests = (userId) => {
    return apiClient.get(`/api/pickups/user/${userId}`).then(response => {
        if (Array.isArray(response.data)) {
            response.data = response.data.map(req => ({
                ...req,
                requestId: req.requestId || req.requestID
            }));
        }
        return response;
    });
};

const getCollectorRequests = (collectorId) => {
    return apiClient.get(`/api/pickups/collector/${collectorId}`).then(response => {
        if (Array.isArray(response.data)) {
            return response.data.map(req => ({
                ...req,
                requestId: req.requestId || req.requestID
            }));
        }
        return response.data;
    });
};

const getAllRequests = () => {
    return apiClient.get('/api/pickups').then(response => {
        if (Array.isArray(response.data)) {
            return response.data.map(req => ({
                ...req,
                requestId: req.requestId || req.requestID
            }));
        }
        return response.data;
    });
};

const getRequestById = (requestId) => {
    return apiClient.get(`/api/pickups/${requestId}`).then(response => {
        // Normalize ID casing if needed
        if (response.data && response.data.requestID) {
            response.data.requestId = response.data.requestID;
        }
        return response;
    });
};

const deleteRequest = (requestId) => {
    return apiClient.delete(`/api/pickups/${requestId}`);
};

const updateRequestStatus = (requestId, status) => {
    return apiClient.put(`/api/pickups/${requestId}/status`, null, {
        params: { status }
    });
};

const assignCollector = (requestId, collectorId) => {
    return apiClient.put(`/api/pickups/${requestId}/assign-collector`, null, {
        params: { collectorId }
    });
};

export default {
    createRequest,
    getUserRequests,
    getCollectorRequests,
    getAllRequests,
    getRequestById,
    deleteRequest,
    updateStatus: updateRequestStatus,
    assignCollector
};
