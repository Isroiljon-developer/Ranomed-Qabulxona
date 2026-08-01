import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'sonner';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:9000');

const ReceptionContext = createContext();

export function ReceptionProvider({ children }) {
  const [currentBranch, setCurrentBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [queue, setQueue] = useState([]);
  const [botRequests, setBotRequests] = useState([]);
  const [wards, setWards] = useState([]);
  const [dischargeList, setDischargeList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [patients, setPatients] = useState([]);
  const [nurses, setNurses] = useState([]);

  const getBranchName = (id) => {
    const branch = branches.find(b => b.id === Number(id));
    return branch ? branch.name : (id || 'Markaziy');
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (currentBranch) {
      fetchBranchData();
      socket.emit('join_branch', currentBranch);
    }

    socket.on('new_appointment', (data) => {
      if (data.filialId == currentBranch) {
        fetchBranchData();
      }
    });

    return () => socket.off('new_appointment');
  }, [currentBranch]);

  const fetchInitialData = async () => {
    try {
      const branchRes = await api.get('/admin/branch');
      const branchesData = Array.isArray(branchRes) ? branchRes : (branchRes.data || []);
      setBranches(branchesData);
      if (branchesData.length > 0) {
        setCurrentBranch(Number(branchesData[0].id));
      }

      const doctorRes = await api.get('/admin/user?role=doctor');
      setDoctors(Array.isArray(doctorRes) ? doctorRes : (doctorRes.data || []));

      const nurseRes = await api.get('/admin/user?role=nurse');
      setNurses(Array.isArray(nurseRes) ? nurseRes : (nurseRes.data || []));

      const patientRes = await api.get('/reception/patients');
      setPatients(Array.isArray(patientRes) ? patientRes : (patientRes.data || []));
    } catch (err) {
      console.error(err);
    }
  };

  const [stats, setStats] = useState({ todayQueue: 0, pendingBot: 0, activeWards: 0 });

  const fetchBranchData = async () => {
    if (!currentBranch) return;
    try {
      console.log(`Fetching data for branch: ${currentBranch}`);
      const [appRes, wardRes, botRes, dischargeRes, statsRes] = await Promise.all([
        api.get(`/reception/appointments?filialId=${currentBranch}`),
        api.get(`/reception/wards?filialId=${currentBranch}`),
        api.get(`/reception/bot-requests?filialId=${currentBranch}`),
        api.get(`/reception/discharge-list?filialId=${currentBranch}`),
        api.get(`/reception/stats?filialId=${currentBranch}`)
      ]);

      const rawWards = Array.isArray(wardRes) ? wardRes : (wardRes.data || []);
      const apps = Array.isArray(appRes) ? appRes : (appRes.data || []);
      console.log('Fetched appointments:', apps);
      const formattedQueue = apps.map(app => {
        console.log('Mapping app:', app.id, 'Doctor:', app.doctor?.name);
        return {
          id: app.id,
          patientId: app.patientId,
          name: app.Patient?.ism || 'Noma\'lum',
          phone: app.Patient?.telefon || '-',
          doctor: app.doctor?.name || 'Noma\'lum',
          status: app.status,
          queueNumber: app.navbat,
          time: app.vaqt,
          date: app.sana,
          filialId: app.filialId
        };
      });

      const formattedWards = rawWards.map(ward => ({
        id: ward.id,
        roomNumber: ward.name || ward.roomNumber || `Palata #${ward.id}`,
        type: ward.type,
        capacity: parseInt(ward.capacity) || 1,
        pricePerDay: parseFloat(ward.price_per_day) || 0,
        image: ward.image,
        patients: (ward.Occupants || []).map(adm => {
          const admissionDate = new Date(adm.admissionDate);
          const today = new Date();
          const expectedEnd = new Date(admissionDate.getTime() + (adm.expectedDays * 24 * 60 * 60 * 1000));
          const diffTime = expectedEnd.getTime() - today.getTime();
          const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
          return {
            id: adm.id,
            name: adm.Patient?.ism || 'Bemor',
            phone: adm.Patient?.telefon || '-',
            admissionDate: adm.admissionDate,
            expectedDays: adm.expectedDays,
            daysLeft: daysLeft,
            paid: adm.totalAmount > 0
          };
        })
      }));

      console.log('Formatted Wards:', formattedWards);

      const formattedDischarge = (Array.isArray(dischargeRes) ? dischargeRes : (dischargeRes.data || [])).map(adm => ({
        id: adm.id,
        patient: adm.Patient?.ism,
        room: adm.Ward?.name,
        daysStayed: Math.ceil((new Date() - new Date(adm.admissionDate)) / (1000 * 60 * 60 * 24)),
        totalDays: adm.expectedDays,
        paid: adm.totalAmount > 0,
        status: adm.status === 'admitted' ? 'ready' : 'blocked'
      }));

      setQueue(formattedQueue);
      setWards(formattedWards);
      setBotRequests((Array.isArray(botRes) ? botRes : (botRes.data || [])).map(req => ({
        id: req.id,
        telegramUser: req.ism,
        status: req.holat === 'yangi' ? 'new' : 'processing',
        paid: false,
        location: 'Belgilanmagan',
        doctor: 'Navbatda aniqlanadi',
        time: new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        phone: req.tel
      })));
      setDischargeList(formattedDischarge);
      setStats(statsRes);
    } catch (err) {
      console.error("Fetch Branch Data Error:", err);
    }
  };

  const addPatient = async (patientData) => {
    try {
      const res = await api.post('/reception/register', {
        ...patientData,
        filialId: currentBranch
      });
      toast.success("Bemor ro'yxatga olindi");
      fetchBranchData();
      return res;
    } catch (err) {
      toast.error(err.message);
    }
  };

  const createAppointment = async (appData) => {
    try {
      await api.post('/reception/appointments', {
        ...appData,
        filialId: currentBranch
      });
      toast.success("Navbatga qo'shildi");
      fetchBranchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updatePatientStatus = async (id, status) => {
    try {
      await api.put(`/admin/appointment/${id}`, { status });
      fetchBranchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const approveBotRequest = async (id) => {
    try {
      await api.put(`/reception/bot-requests/${id}`, { status: 'qabul_qilindi' });
      toast.success("So'rov qabul qilindi");
      fetchBranchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const rejectBotRequest = async (id) => {
    try {
      await api.put(`/reception/bot-requests/${id}`, { status: 'rad_etildi' });
      toast.success("So'rov rad etildi");
      fetchBranchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const removeFromQueue = async (id) => {
    try {
      await api.delete(`/admin/appointment/${id}`);
      toast.success("Navbatdan o'chirildi");
      fetchBranchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const sendToQueue = async (request) => {
    try {
      await createAppointment({
        patientId: request.patientId, // Assuming we linked it, otherwise we need to link/create patient
        shifokorId: 1, // Default or selector
        sana: new Date().toISOString().split('T')[0],
        vaqt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      await approveBotRequest(request.id);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const admitToWard = async (admissionData) => {
    try {
      const res = await api.post('/reception/admit', {
        ...admissionData,
        filialId: currentBranch
      });
      toast.success("Bemor palataga yotqizildi");
      fetchBranchData();
      return res;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const dischargePatient = async (id) => {
    try {
      await api.put(`/reception/discharge/${id}`);
      toast.success("Bemor chiqarildi");
      fetchBranchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const extendWardStay = async (id, additionalDays) => {
    try {
      await api.put(`/reception/ward-admission/${id}/extend`, { additionalDays });
      toast.success("Palata muddati uzaytirildi");
      fetchBranchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const value = {
    branches,
    doctors,
    currentBranch,
    setCurrentBranch,
    queue,
    botRequests,
    wards,
    dischargeList,
    stats,
    selectedPatient,
    setSelectedPatient,
    patientHistory,
    patients,
    nurses,
    addPatient,
    admitToWard,
    createAppointment,
    updatePatientStatus,
    removeFromQueue,
    approveBotRequest,
    rejectBotRequest,
    sendToQueue,
    dischargePatient,
    extendWardStay,
    fetchBranchData,
    getBranchName,
    getBranchQueue: () => queue,
    getBranchWards: () => wards,
    getBranchDischargeList: () => dischargeList,
    getBranchBotRequests: () => botRequests,
    getBranchPatientHistory: () => patientHistory,
  };

  return (
    <ReceptionContext.Provider value={value}>
      {children}
    </ReceptionContext.Provider>
  );
}

export function useReception() {
  const context = useContext(ReceptionContext);
  if (!context) {
    throw new Error('useReception must be used within ReceptionProvider');
  }
  return context;
}
