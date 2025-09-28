import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Backend runs on port 8080
});

// Employee PTO submission
export const submitPTO = (ptoData) => api.post("/pto", ptoData);

// Manager coverage query
export const getCoverage = (team, from, to) => api.get(`/coverage?team=${team}&from=${from}&to=${to}`);

// User management
export const getAllUsers = () => api.get("/users");
export const createUser = (userData) => api.post("/users", userData);

// PTO management
export const getAllPTORequests = () => api.get("/pto");
export const updatePTOStatus = (id, status) => api.patch(`/pto/${id}/status`, { status });

// HR leave management
export const getLeaveBalances = (year) => api.get(`/hr/leave-balances?year=${year}`);

// Chatbot (Athena)
export const getChatbotResponse = (userEmail, message) =>
  api.post("/chatbot/chat", { userEmail, message });

export default api;
