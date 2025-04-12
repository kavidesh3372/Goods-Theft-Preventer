import axios from "axios";
const REST_API_URL = 'http://localhost:8081/FinalYearProject/Gps';

export const listLocation = () => axios.get(REST_API_URL);