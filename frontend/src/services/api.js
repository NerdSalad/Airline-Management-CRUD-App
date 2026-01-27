import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getFlights = async () => {
  const res = await api.get("/flights");
  return res.data;
};

export const getAllFlights = async () => {
  const res = await api.get("/flights");
  return res.data;
};

export const addFlight = async (data) => {
  const res = await api.post("/flights", data);
  return res.data;
};

export const updateFlight = async (code, data) => {
  const res = await api.put(`/flights/${code}`, data);
  return res.data;
};

export const deleteFlight = async (code) => {
  const res = await api.delete(`/flights/${code}`);
  return res.data;
};

export const getPassengers = async () => {
  const res = await api.get("/passengers");
  return res.data;
};

export const addPassenger = async (data) => {
  const res = await api.post("/passengers", data);
  return res.data;
};

export const updatePassenger = async (aadhar, data) => {
  const res = await api.put(`/passengers/${aadhar}`, data);
  return res.data;
};

export const deletePassenger = async (aadhar) => {
  const res = await api.delete(`/passengers/${aadhar}`);
  return res.data;
};

export const getPassengerByAadhar = async (aadhar) => {
  const res = await api.get(`/reservations/passenger/${aadhar}`);
  return res.data;
};

export const getFlightByRoute = async (src, des) => {
  const res = await api.get(`/reservations/flight?src=${src}&des=${des}`);
  return res.data;
};

export const bookFlight = async (data) => {
  const res = await api.post(`/reservations/book`, data);
  return res.data;
};

export const getAllReservations = async () => {
  const res = await api.get(`/reservations/all`);
  return res.data;
};

export const getReservationByPNR = async (pnr) => {
  const res = await api.get(`/cancellations/${pnr}`);
  return res.data;
};

export const cancelTicket = async (pnr) => {
  const res = await api.delete(`/cancellations/${pnr}`);
  return res.data;
};

export const getBoardingPassByPNR = async (pnr) => {
  const cleanPnr = pnr.replace("PNR-", "");
  const response = await api.get(`/boarding-pass/${cleanPnr}`);
  return response.data;
};

export const loginAdmin = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export default api;