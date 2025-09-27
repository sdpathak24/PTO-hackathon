import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // change if your backend runs on another port
});

// Employee PTO submission
export const submitPTO = (ptoData) => api.post("/pto", ptoData);

// Manager coverage query
export const getCoverage = (team, from, to) => api.get(`/coverage?team=${team}&from=${from}&to=${to}`);

// AI recommendation call
export const getAIRecommendation = (ptoId) => api.get(`/ai/recommendation/${ptoId}`);

export default api;
