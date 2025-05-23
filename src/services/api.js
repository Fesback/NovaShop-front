import axios from 'axios';

const API_BASE = "http://localhost:8080/api";

export const fetchProducts = async () => {
    const response = await axios.get(`${API_BASE}/productos`);
    return response.data;
}