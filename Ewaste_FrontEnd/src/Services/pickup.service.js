import axios from "axios";

// Using API Gateway (Port 8080) is the best practice.
// If your Gateway isn't running, use Port 8082 (Direct Pickup Service).
const API_URL = "http://localhost:8080/api/pickups"; 

const createPickupRequest = (pickupData) => {
  return axios.post(API_URL, pickupData);
};

const getPickupRequestById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export default {
  createPickupRequest,
  getPickupRequestById
};