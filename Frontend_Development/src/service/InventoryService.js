import axios from "axios";
const REST_API_URL = 'http://localhost:8081/FinalYearProject/Inventory';

export const listInventory = () => axios.get(REST_API_URL);
export const transactionInventory = (transactionRequest) => axios.put(`${REST_API_URL}/process-transaction`,transactionRequest)