import axios from "axios";

const API_URL = "http://localhost:8082/api/pickups";

const createPickup = (pickupData) => {
  return axios.post(API_URL, pickupData);
};

const getPickupById = (requestId) => {
  return axios.get(`${API_URL}/${requestId}`);
};

export default {
  createPickup,
  getPickupById
};
