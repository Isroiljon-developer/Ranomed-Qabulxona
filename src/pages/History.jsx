import { useState } from 'react';
import { History as HistoryIcon, Calendar, Filter, Search, User, Stethoscope, BedDouble, ArrowRight, DoorOpen } from 'lucide-react';
import Topbar from '../layout/Topbar';
import BranchSelector from '../components/BranchSelector';
import ExportButtons from '../components/ExportButtons';
import { useReception } from '../context/ReceptionContext';
import { exportHistoryData } from '../utils/exportUtils';

const doctors = ['Barchasi', 'Dr. Karimov', 'Dr. Nargiza', 'Dr. Jamshid', 'Dr. Shahzoda', 'Dr. Akmal'];

export default function History() {
  const { getBranchPatientHistory, currentBranch } = useReception();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('Barchasi');
  const [actionFilter, setActionFilter] = useState('all');

  const history = getBranchPatientHistory();

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesDate = !dateFilter || item.date === dateFilter;
    const matchesAction = actionFilter === 'all' || item.action.includes(actionFilter);
    return matchesSearch && matchesDate && matchesAction;
  });

  const getActionIcon = (action) => {
    if (action.includes('Navbat')) return <ArrowRight className="w-4 h-4" />;
    if (action.includes('Palata') || action.includes('yotqiz')) return <BedDouble className="w-4 h-4" />;
    if (action.includes('Chiq')) return <DoorOpen className="w-4 h-4" />;
    return <ArrowRight className="w-4 h-4" />;
  };

  const getActionColor = (action) => {
    if (action.includes('Navbat')) return 'badge-success';
    if (action.includes('Palata') || action.includes('yotqiz')) return 'badge-info';
    if (action.includes('Chiq')) return 'badge-warning';
    return 'badge-primary';
  };

  // Group by date
  const groupedHistory = filteredHistory.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const handleExportPDF = () => {
    exportHistoryData(filteredHistory, 'pdf');
  };

  const handleExportExcel = () => {
    exportHistoryData(filteredHistory, 'excel');
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar title="Tarix" />
      
      <div className="p-6 space-y-6">
        {/* Branch Selector & Export */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <BranchSelector />
          <ExportButtons 
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            label="Tarixni eksport qilish"
          />
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Bemor qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-field pl-10 w-44"
              />
            </div>
            
            {/* Action Filter */}
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'Barchasi' },
                { value: 'Navbat', label: 'Navbat' },
                { value: 'Palata', label: 'Palata' },
                { value: 'Chiq', label: 'Chiqish' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setActionFilter(option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    actionFilter === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-sm text-muted-foreground">
          {currentBranch} filiali: {filteredHistory.length} ta yozuv
        </div>

        {/* History Timeline */}
        <div className="space-y-6">
          {Object.keys(groupedHistory).length > 0 ? (
            Object.entries(groupedHistory)
              .sort(([a], [b]) => new Date(b) - new Date(a))
              .map(([date, items]) => (
              <div key={date} className="space-y-3 animate-fade-in">
                {/* Date Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {new Date(date).toLocaleDateString('uz-UZ', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <span className="badge badge-primary">{items.length} ta</span>
                </div>

                {/* Items */}
                <div className="ml-5 border-l-2 border-border pl-8 space-y-3">
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-card rounded-xl border border-border p-4 hover:shadow-card transition-all duration-200 relative"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute -left-[2.55rem] top-5 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                      
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{item.patientName}</h4>
                            {item.details && (
                              <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`badge ${getActionColor(item.action)} flex items-center gap-1`}>
                            {getActionIcon(item.action)}
                            {item.action}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <HistoryIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Tarix topilmadi</h3>
              <p className="text-muted-foreground mt-2">
                {currentBranch} filialida tanlangan filter bo'yicha ma'lumotlar yo'q
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
