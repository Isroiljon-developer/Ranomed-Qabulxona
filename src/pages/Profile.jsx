import { useState, useEffect } from 'react';
import { User as UserIcon, Building2, Clock, LogOut, Edit2, Save, X, Phone, Mail, Calendar } from 'lucide-react';
import Topbar from '../layout/Topbar';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../api';
import { toast } from 'sonner';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const [user, setUser] = useState({
    name: '',
    role: '',
    username: '',
    phone: '',
    photo: '',
    Branch: { name: '' },
    createdAt: ''
  });

  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.get('/auth/me');
      setUser(data);
      setEditData({
        name: data.name,
        phone: data.phone || '',
        password: ''
      });
    } catch (error) {
      toast.error('Profilni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/auth/profile', editData);
      toast.success('Profil muvaffaqiyatli yangilandi');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error(error.message || 'Yangilashda xatolik');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'http://localhost:5173/login';
  };

  if (loading) return <div className="min-h-screen bg-background"><Topbar title="Profil" /><div className="p-6">Yuklanmoqda...</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <Topbar title="Profil" />
      
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
          {/* Header Background */}
          <div className="h-32 bg-primary/10 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 rounded-full bg-card border-4 border-card flex items-center justify-center shadow-lg overflow-hidden">
                {user.photo ? (
                  <img src={`http://localhost:9000/uploads/${user.photo}`} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-primary">{user.name[0]}</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="pt-16 pb-6 px-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                <p className="text-muted-foreground uppercase text-xs font-semibold tracking-wider font-mono">{user.role}</p>
              </div>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn-outline flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Tahrirlash
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="btn-outline flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Bekor
                  </button>
                  <button onClick={handleSave} className="btn-success flex items-center gap-2" disabled={saving}>
                    <Save className="w-4 h-4" />
                    {saving ? 'Saqlash...' : 'Saqlash'}
                  </button>
                </div>
              )}
            </div>

            {/* Info Grid */}
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <InfoField 
                  icon={Building2} 
                  label="Filial" 
                  value={user.Branch?.name || 'Markaziy'}
                  isEditing={false}
                />
                <InfoField 
                  icon={UserIcon} 
                  label="Login" 
                  value={user.username}
                  isEditing={false}
                />
                <InfoField 
                  icon={Phone} 
                  label="Telefon" 
                  value={isEditing ? editData.phone : user.phone || 'Kiritilmagan'}
                  isEditing={isEditing}
                  inputType="tel"
                  onChange={(val) => setEditData(prev => ({ ...prev, phone: val }))}
                />
                <InfoField 
                  icon={Calendar} 
                  label="Qo'shilgan sana" 
                  value={new Date(user.createdAt).toLocaleDateString('uz-UZ')}
                  isEditing={false}
                />
                {isEditing && (
                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-xs text-muted-foreground ml-1">To'liq ism</label>
                    <input 
                      type="text" 
                      className="form-control w-full p-3 bg-muted rounded-xl border-none"
                      value={editData.name} 
                      onChange={e => setEditData({...editData, name: e.target.value})}
                      required
                    />
                  </div>
                )}
                {isEditing && (
                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-xs text-muted-foreground ml-1">Yangi parol (ixtiyoriy)</label>
                    <input 
                      type="password" 
                      className="form-control w-full p-3 bg-muted rounded-xl border-none"
                      placeholder="O'zgartirmaslik uchun bo'sh qoldiring"
                      value={editData.password} 
                      onChange={e => setEditData({...editData, password: e.target.value})}
                    />
                  </div>
                )}
            </form>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Ish statistikasi</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem label="Rol" value={user.role} />
            <StatItem label="Filial" value={user.Branch?.name || '-'} />
            <StatItem label="Bugun" value="0" />
            <StatItem label="Sana" value={new Date().toLocaleDateString('uz-UZ')} />
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full btn-danger flex items-center justify-center gap-2 py-4 rounded-xl font-bold"
        >
          <LogOut className="w-5 h-5" />
          Tizimdan chiqish
        </button>
      </div>

      {/* Logout Confirm */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Chiqish"
        message="Haqiqatan ham tizimdan chiqmoqchimisiz?"
        type="danger"
        confirmText="Ha, chiqish"
        cancelText="Yo'q"
      />
    </div>
  );
}

function InfoField({ icon: Icon, label, value, isEditing, options, inputType, onChange }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-muted rounded-xl">
      <Icon className="w-5 h-5 text-primary mt-0.5" />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {isEditing ? (
          options ? (
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="bg-transparent w-full font-medium"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={inputType || 'text'}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="bg-transparent w-full font-medium border-none p-0 focus:ring-0"
            />
          )
        ) : (
          <p className="text-sm font-medium text-foreground">{value}</p>
        )}
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="text-center p-4 bg-muted rounded-xl">
      <p className="text-lg font-bold text-primary truncate">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">{label}</p>
    </div>
  );
}

