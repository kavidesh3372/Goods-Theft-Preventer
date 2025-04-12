import axios from "axios";

const API_URL = "http://localhost:8081/FinalYearProject/Rfid"; 

export const fetchAllRfids =  () => axios.get(API_URL);
export const addRfid = (rfidData) => axios.post(`${API_URL}/addRfid`, rfidData);
export const updateRfid = (uId, rfidData) => axios.put(`${API_URL}/updateRfid/${uId}`, rfidData);
export const checkRfid = (uId) => axios.get(`${API_URL}/check`, { params: { uId } });
export const checkExpiry = () => axios.get(`${API_URL}/checkExpiry`);
export const updateRfidStatus = (uid, status) => axios.put(`${API_URL}/rfid/updateStatus`, { uid, status });