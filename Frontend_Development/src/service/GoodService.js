import axios from "axios";
const REST_API_URL = 'http://localhost:8081/FinalYearProject';

export const listGoods = () => axios.get(REST_API_URL);