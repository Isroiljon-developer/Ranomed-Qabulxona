import axios from 'axios';

const API_URL = 'http://localhost:9000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// --- PATIENT ---
export const registerPatient = async (patientData, photoFile) => {
    const formData = new FormData();
    Object.keys(patientData).forEach(key => formData.append(key, patientData[key]));

    if (photoFile) formData.append('photo', photoFile);

    const response = await api.post('/reception/patients', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// --- APPOINTMENT ---
export const createAppointment = async (data) => {
    const response = await api.post('/reception/appointments', data);
    return response.data;
};

// --- WARD ---
export const admitPatient = async (data) => {
    const response = await api.post('/reception/admit', data);
    return response.data;
};

export const getImageUrl = (filename) => {
    return filename ? `${API_URL.replace('/api', '')}/uploads/${filename}` : null;
};

export default api;
