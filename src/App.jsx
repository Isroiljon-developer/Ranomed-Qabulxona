import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReceptionProvider } from './context/ReceptionContext';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import AddPatient from './pages/AddPatient';
import QueueManagement from './pages/QueueManagement';
import BotRequests from './pages/BotRequests';
import WardMonitoring from './pages/WardMonitoring';
import Discharge from './pages/Discharge';
import History from './pages/History';
import Profile from './pages/Profile';
import Login from './pages/Login';
import LabOrder from './pages/LabOrder';
import WardRequests from './pages/WardRequests';

// Boshqa paneldan redirect bo'lib kelsa URL'dagi tokenni o'qib saqlash
(function readTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('_token');
  const user = params.get('_user');
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
    if (user) localStorage.setItem('user', user);
    window.history.replaceState({}, '', window.location.pathname);
  }
})();

const isAuthenticated = () => localStorage.getItem('isLoggedIn') === 'true';
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return null;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <ReceptionProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="add-patient" element={<AddPatient />} />
            <Route path="queue" element={<QueueManagement />} />
            <Route path="lab-order" element={<LabOrder />} />
            <Route path="bot-requests" element={<BotRequests />} />
            <Route path="wards" element={<WardMonitoring />} />
            <Route path="discharge" element={<Discharge />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
            <Route path="ward-requests" element={<WardRequests />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ReceptionProvider>
    </BrowserRouter>
  );
}
