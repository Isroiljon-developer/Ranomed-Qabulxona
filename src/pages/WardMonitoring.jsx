import { useState } from 'react';
import { BedDouble, AlertTriangle, User, Clock, Filter } from 'lucide-react';
import Topbar from '../layout/Topbar';
import WardStatusCard from '../components/WardStatusCard';
import WardDetailModal from '../components/WardDetailModal';
import BranchSelector from '../components/BranchSelector';
import { useReception } from '../context/ReceptionContext';

export default function WardMonitoring() {
  const { getBranchWards, currentBranch } = useReception();
  const [filter, setFilter] = useState('all');
  const [selectedWard, setSelectedWard] = useState(null);

  const wards = getBranchWards();

  const totalCapacity = wards.reduce((acc, w) => acc + w.capacity, 0);
  const totalOccupied = wards.reduce((acc, w) => acc + w.patients.length, 0);
  const urgentCount = wards.reduce((acc, w) => acc + w.patients.filter(p => p.daysLeft === 0).length, 0);
  const warningCount = wards.reduce((acc, w) => acc + w.patients.filter(p => p.daysLeft === 1).length, 0);

  const filteredWards = wards.filter(ward => {
    if (filter === 'all') return true;
    if (filter === 'empty') return ward.patients.length === 0;
    if (filter === 'full') return ward.patients.length === ward.capacity;
    if (filter === 'urgent') return ward.patients.some(p => p.daysLeft === 0);
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Topbar title="Palatalar nazorati" />
      
      <div className="p-6 space-y-6">
        {/* Branch Selector */}
        <div className="flex items-center justify-between">
          <BranchSelector />
          <span className="text-sm text-muted-foreground">
            {currentBranch} filiali ma'lumotlari
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <BedDouble className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalOccupied}/{totalCapacity}</p>
                <p className="text-sm text-muted-foreground">Jami bandlik</p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${totalCapacity ? (totalOccupied / totalCapacity) * 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{urgentCount}</p>
                <p className="text-sm text-muted-foreground">Bugun chiqadi</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-warning-light flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{warningCount}</p>
                <p className="text-sm text-muted-foreground">1 kun qoldi</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success-light flex items-center justify-center">
                <User className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{wards.filter(w => w.patients.length === 0).length}</p>
                <p className="text-sm text-muted-foreground">Bo'sh palatalar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Barchasi' },
              { value: 'empty', label: "Bo'sh" },
              { value: 'full', label: "To'liq" },
              { value: 'urgent', label: 'Shoshilinch' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ward Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWards.map((ward) => (
            <WardStatusCard 
              key={ward.id} 
              ward={ward} 
              onClick={setSelectedWard}
            />
          ))}
          {filteredWards.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
              Bu filialda palata topilmadi
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Ranglar ma'nosi:</h4>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success" />
              <span className="text-sm text-muted-foreground">OK - Hech qanday muammo yo'q</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning" />
              <span className="text-sm text-muted-foreground">1 kun qoldi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-destructive" />
              <span className="text-sm text-muted-foreground">Bugun chiqadi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <span className="text-sm text-muted-foreground">Bo'sh palata</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ward Detail Modal */}
      {selectedWard && (
        <WardDetailModal 
          ward={selectedWard} 
          onClose={() => setSelectedWard(null)} 
        />
      )}
    </div>
  );
}
