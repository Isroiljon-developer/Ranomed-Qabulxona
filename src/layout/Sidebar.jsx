import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  Clock, 
  Bot, 
  BedDouble, 
  DoorOpen, 
  History, 
  User,
  Activity,
  FlaskConical
} from 'lucide-react';
import BranchSelector from '../components/BranchSelector';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/add-patient', icon: UserPlus, label: 'Bemor qo\'shish' },
  { path: '/queue', icon: Clock, label: 'Navbat boshqaruvi' },
  { path: '/lab-order', icon: FlaskConical, label: 'Lab Buyurtma 🧪' },
  { path: '/ward-requests', icon: BedDouble, label: '🛏️ Palataga Yotqizish' },
  { path: '/wards', icon: BedDouble, label: 'Palata monitoring' },
  { path: '/discharge', icon: DoorOpen, label: 'Chiqish / Exit' },
  { path: '/history', icon: History, label: 'Tarix' },
  { path: '/profile', icon: User, label: 'Profil' },
];


export default function Sidebar() {
  return (
    <aside className="sidebar fixed left-0 top-0 h-screen w-64 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Ranomed -2 </h1>
            <p className="text-xs text-white/60">Reception Panel</p>
          </div>
        </div>
      </div>

      {/* Branch Selector */}
      <div className="p-4 border-b border-white/10">
        <BranchSelector />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-semibold">RK</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Rano Karimova</p>
            <p className="text-xs text-white/60">Receptionist</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
