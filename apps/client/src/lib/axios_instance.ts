
import axios from "axios";

// Create the Axios instance with the base URL
const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

export default api;
