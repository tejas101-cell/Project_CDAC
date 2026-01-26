import axios from "axios";

const API_URL = "http://localhost:8081/api/users";

const register = (name, email, roleName) => {
  return axios.post(`${API_URL}/register`, {
    name,
    email,
    roleName
  });
};

const login = (email) => {
  return axios.post(`${API_URL}/login`, {
    email
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

export default {
  register,
  login,
  setCurrentUser,
  getCurrentUser,
  logout
};
