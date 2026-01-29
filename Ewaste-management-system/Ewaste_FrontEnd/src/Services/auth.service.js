import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

const register = (name, email, roleName) => {
  return axios.post(`${API_URL}/register`, {
    name,
    email,
    roleName
  });
};

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, {
    email,
    password
  });
};

const setCurrentUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const logout = () => {
  localStorage.removeItem("user");
};

const getAllUsers = () => {
  return axios.get(API_URL).then(response => response.data);
};

const updateUserStatus = (userId, status) => {
  return axios.put(`${API_URL}/${userId}/status`, null, {
    params: { status }
  });
};

export default {
  register,
  login,
  setCurrentUser,
  getCurrentUser,
  logout,
  getAllUsers,
  updateUserStatus
};
