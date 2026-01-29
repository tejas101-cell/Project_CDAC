import axios from "axios";

const API_URL = "http://localhost:8080/api/requests";

const createRequest = (requestData) => {
    return axios.post(API_URL, requestData);
};

const getUserRequests = (userId) => {
    return axios.get(`${API_URL}/user/${userId}`);
};

const getCollectorRequests = (collectorId) => {
    return axios.get(`${API_URL}/collector/${collectorId}`).then(response => response.data);
};

const getAllRequests = () => {
    return axios.get(API_URL).then(response => response.data);
};

const getRequestById = (requestId) => {
    return axios.get(`${API_URL}/${requestId}`);
};

const deleteRequest = (requestId) => {
    return axios.delete(`${API_URL}/${requestId}`);
};

const updateRequestStatus = (requestId, status) => {
    return axios.put(`${API_URL}/${requestId}/status`, null, {
        params: { status }
    });
};

const assignCollector = (requestId, collectorId) => {
    return axios.put(`${API_URL}/${requestId}/assign-collector`, null, {
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
