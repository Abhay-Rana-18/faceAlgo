import axios from "axios";

// Axios interceptor
const API = axios.create({ baseURL: 'http://localhost:3000/api/' });
API.defaults.withCredentials = true;

export default API;
