import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://hrms-lite-backend-8xqp.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
