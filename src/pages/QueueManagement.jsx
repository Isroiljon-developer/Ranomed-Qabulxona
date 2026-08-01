import { useState, useEffect } from 'react';
import { Phone, Send, X, ArrowUp, ArrowDown, Filter, Search, BedDouble, ArrowRight } from 'lucide-react';
import Topbar from '../layout/Topbar';
import PatientDetailModal from '../components/PatientDetailModal';
import ConfirmDialog from '../components/ConfirmDialog';
import AdmitToWardModal from '../components/AdmitToWardModal';
import BranchSelector from '../components/BranchSelector';
import ExportButtons from '../components/ExportButtons';
import { useReception } from '../context/ReceptionContext';
import { exportQueueData } from '../utils/exportUtils';

const statusConfig = {
  'waiting': { label: "Kutmoqda", class: 'badge-warning' },
  'called': { label: "Chaqirildi", class: 'badge-info' },
  'in-progress': { label: "Qabulda", class: 'badge-primary' },
  'payment': { label: "To'lov", class: 'badge-success' },
};

const sourceConfig = {
  'Bot': { class: 'badge-info' },
  'Reception': { class: 'badge-primary' },
};

export default function QueueManagement() {
  const { getBranchQueue, updatePatientStatus, removeFromQueue, selectedPatient, setSelectedPatient, currentBranch, getBranchName, fetchBranchData } = useReception();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBranchData();
  }, [currentBranch]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, patient: null, action: null });
  const [admitModal, setAdmitModal] = useState({ open: false, patient: null });

  const queue = getBranchQueue();

  const filteredQueue = queue.filter(patient => {
    const matchesSearch = (patient.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.doctor || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (patient, action) => {
    if (action === 'cancel') {
      setConfirmDialog({ open: true, patient, action: 'cancel' });
    } else {
      updatePatientStatus(patient.id, action);
    }
  };

  const confirmAction = () => {
    if (confirmDialog.action === 'cancel') {
      removeFromQueue(confirmDialog.patient.id);
    }
    setConfirmDialog({ open: false, patient: null, action: null });
  };

  const handleExportPDF = () => {
    exportQueueData(filteredQueue, 'pdf');
  };

  const handleExportExcel = () => {
    exportQueueData(filteredQueue, 'excel');
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar title="Navbat boshqaruvi" />

      <div className="p-6 space-y-6">
        {/* Branch Selector & Export */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BranchSelector />
            <span className="text-sm text-muted-foreground">
              {getBranchName(currentBranch)} filiali: {queue.length} ta bemor
            </span>
          </div>
          <ExportButtons
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            label="Navbatni eksport"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Bemor yoki shifokor qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-40"
            >
              <option value="all">Barchasi</option>
              <option value="waiting">Kutmoqda</option>
              <option value="in-progress">Qabulda</option>
              <option value="payment">To'lov</option>
            </select>
          </div>
        </div>

        {/* Queue Flow Visualization */}
        <div className="flex items-center gap-2 p-4 bg-card rounded-xl border border-border overflow-x-auto">
          <FlowStep label="Kutmoqda" count={queue.filter(q => q.status === 'waiting').length} status="waiting" />
          <FlowArrow />
          <FlowStep label="Chaqirildi" count={queue.filter(q => q.status === 'called').length} status="called" />
          <FlowArrow />
          <FlowStep label="Qabulda" count={queue.filter(q => q.status === 'in-progress').length} status="in-progress" />
          <FlowArrow />
          <FlowStep label="To'lov" count={queue.filter(q => q.status === 'payment').length} status="payment" />
          <FlowArrow />
          <FlowStep label="Palata/Chiqish" count={0} status="completed" />
        </div>

        {/* Queue Table */}
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Navbat</th>
                <th className="table-header">Bemor</th>
                <th className="table-header">Shifokor</th>
                <th className="table-header">Manba</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.map((patient, index) => {
                const status = statusConfig[patient.status] || statusConfig['waiting'];

                return (
                  <tr key={patient.id} className="table-row group">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black text-xs border border-primary/10">
                          #{patient.queueNumber || index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-col">
                        <button
                          onClick={() => setSelectedPatient(patient)}
                          className="font-bold text-slate-800 hover:text-primary transition-colors text-sm text-left uppercase tracking-tight"
                        >
                          {patient.name}
                        </button>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-2.5 h-2.5 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-400 tracking-tighter">{patient.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        <span className="text-xs font-bold text-slate-600 truncate max-w-[120px]">{patient.doctor}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${patient.source === 'telegram' ? 'bg-sky-50 text-sky-600 border border-sky-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                        {patient.source || 'Manual'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${status.class} !rounded-xl !px-3 !py-1.5 !text-[10px] !font-black !uppercase !tracking-widest`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleAction(patient, 'called')}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-info/5 text-info hover:bg-info hover:text-white transition-all shadow-sm"
                          title="Chaqirish"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAction(patient, 'in-progress')}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                          title="Doktorga yuborish"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setAdmitModal({ open: true, patient })}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-success/5 text-success hover:bg-success hover:text-white transition-all shadow-sm"
                          title="Palataga yotqizish"
                        >
                          <BedDouble className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAction(patient, 'cancel')}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-destructive/5 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                          title="Bekor qilish"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredQueue.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {getBranchName(currentBranch)} filialida navbatda bemor topilmadi
            </div>
          )}
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, patient: null, action: null })}
        onConfirm={confirmAction}
        title="Navbatdan chiqarish"
        message={`${confirmDialog.patient?.name} ni navbatdan chiqarishni xohlaysizmi?`}
        type="danger"
        confirmText="Ha, chiqarish"
        cancelText="Yo'q"
      />

      {/* Admit to Ward Modal */}
      {admitModal.open && (
        <AdmitToWardModal
          patient={admitModal.patient}
          onClose={() => setAdmitModal({ open: false, patient: null })}
          onSuccess={() => setAdmitModal({ open: false, patient: null })}
        />
      )}
    </div>
  );
}

function FlowStep({ label, count, status }) {
  const colorClasses = {
    'waiting': 'bg-warning-light text-warning',
    'called': 'bg-info-light text-info',
    'in-progress': 'bg-primary-light text-primary',
    'payment': 'bg-success-light text-success',
    'completed': 'bg-muted text-muted-foreground',
  };

  return (
    <div className={`flex flex-col items-center min-w-24 p-3 rounded-lg ${colorClasses[status]}`}>
      <span className="text-lg font-bold">{count}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

function FlowArrow() {
  return <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />;
}
