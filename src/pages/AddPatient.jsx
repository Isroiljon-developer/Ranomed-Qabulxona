import { useState, useEffect } from 'react';
import { UserPlus, Check, Printer } from 'lucide-react';
import Topbar from '../layout/Topbar';
import { useNavigate } from 'react-router-dom';
import { useReception } from '../context/ReceptionContext';
import Receipt from '../components/Receipt';
import api from '../api';

export default function AddPatient() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchSelects = async () => {
      try {
        const drsRes = await api.get('/admin/user?role=doctor');
        setDoctors(drsRes || []);
        const brsRes = await api.get('/admin/branch');
        setBranches(brsRes || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSelects();
  }, []);

  const { addPatient, createAppointment, fetchBranchData, currentBranch, queue } = useReception();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthDate: '',
    gender: '',
    address: '',
    branch: currentBranch || '',
    doctor: ''
  });

  useEffect(() => {
    if (currentBranch && !formData.branch) {
      setFormData(prev => ({ ...prev, branch: currentBranch }));
    }
  }, [currentBranch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const patientDataSpec = {
        ism: formData.name,
        phone: formData.phone,
        birthDate: formData.birthDate,
        gender: formData.gender === 'Erkak' ? 'male' : 'female',
        address: formData.address,
        filialId: parseInt(formData.branch)
      };

      const pRes = await api.post('/reception/register', patientDataSpec);
      const p = pRes.data || pRes;

      const appRes = await api.post('/reception/appointments', {
        patientId: p.id,
        shifokorId: parseInt(formData.doctor),
        filialId: parseInt(formData.branch),
        sana: new Date().toISOString().split('T')[0],
        vaqt: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)
      });
      const app = appRes.data || appRes;

      const selectedDoctor = doctors.find(d => d.id === parseInt(formData.doctor));

      setReceiptData({
        patientName: formData.name,
        patientId: p.id,
        doctorName: selectedDoctor ? selectedDoctor.name : 'Shifokor',
        queueNumber: app.navbat || '-',
        branchId: formData.branch
      });

      // Refresh data in context
      await fetchBranchData();

      setShowSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Xatolik yuz berdi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name && formData.phone && formData.branch && formData.doctor;

  return (
    <div className="min-h-screen bg-background">
      <Topbar title="Yangi bemor qo'shish" />

      <div className="p-6 max-w-2xl mx-auto">
        {showSuccess && receiptData && (
          <Receipt
            data={receiptData}
            onClose={() => {
              setShowSuccess(false);
              navigate('/queue');
            }}
          />
        )}

        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
              <UserPlus className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Yangi bemor ro'yxatdan o'tkazish</h2>
              <p className="text-muted-foreground">Barcha maydonlarni to'ldiring</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Ism Familiya *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Aliyev Sardor" className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Telefon raqam *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+998 90 123 45 67" className="input-field" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tug'ilgan sana</label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Jinsi</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                  <option value="">Tanlang</option>
                  <option value="Erkak">Erkak</option>
                  <option value="Ayol">Ayol</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Manzil</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Toshkent, Yunusobod..." className="input-field" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Filial *</label>
                <select name="branch" value={formData.branch} onChange={handleChange} className="input-field" required>
                  <option value="">Filialni tanlang</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Shifokor *</label>
                <select name="doctor" value={formData.doctor} onChange={handleChange} className="input-field" required>
                  <option value="">Shifokorni tanlang</option>
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>{doctor.name} ({doctor.specialization || 'Shifokor'})</option>
                    ))
                  ) : (
                    <option value="" disabled>Shifokorlar topilmadi</option>
                  )}
                </select>
                {doctors.length === 0 && (
                  <p className="text-[10px] text-destructive mt-1 font-bold">⚠️ Tizimda shifokorlar mavjud emas!</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 mt-8 ${isFormValid && !loading
                ? 'gradient-primary text-primary-foreground hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
            >
              <UserPlus className="w-5 h-5" />
              {loading ? "Yuborilmoqda..." : "Qo'shish va Navbatga yuborish"}
            </button>
          </form>
        </div>

        {/* --- ADDED QUEUE LIST SECTION --- */}
        <div className="mt-8 bg-card rounded-2xl border border-border overflow-hidden shadow-card">
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-6 bg-primary rounded-full"></span>
              Filialdagi joriy navbat
            </h3>
            <span className="badge badge-primary">{queue.filter(p => !formData.branch || p.filialId == formData.branch).length} ta bemor</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-4">Navbat</th>
                  <th className="px-6 py-4">Bemor</th>
                  <th className="px-6 py-4">Shifokor</th>
                  <th className="px-6 py-4">Vaqt</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {queue.filter(p => !formData.branch || p.filialId == formData.branch).length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                      Bu filialda hozircha navbat yo'q
                    </td>
                  </tr>
                ) : (
                  queue
                    .filter(p => !formData.branch || p.filialId == formData.branch)
                    .sort((a, b) => b.queueNumber - a.queueNumber) // Show latest first
                    .slice(0, 10) // Show last 10
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm">
                            {item.queueNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {item.doctor}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {item.time}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge ${item.status === 'waiting' ? 'badge-warning' :
                            item.status === 'in-progress' ? 'badge-primary' :
                              'badge-success'
                            }`}>
                            {item.status === 'waiting' ? 'Kutmoqda' :
                              item.status === 'in-progress' ? 'Qabulda' : 'Bajarildi'}
                          </span>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
