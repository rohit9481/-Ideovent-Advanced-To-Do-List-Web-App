// client/src/components/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/tasks',
});

export default API;
