import { useState } from 'react';
import { DoorOpen, CreditCard, Check, AlertTriangle, Send, Clock, BedDouble } from 'lucide-react';
import Topbar from '../layout/Topbar';
import ConfirmDialog from '../components/ConfirmDialog';
import { useReception } from '../context/ReceptionContext';

export default function Discharge() {
  const { dischargeList, dischargePatient } = useReception();
  const [confirmDialog, setConfirmDialog] = useState({ open: false, patient: null });

  const handleDischarge = (patient) => {
    if (patient.paid) {
      setConfirmDialog({ open: true, patient });
    }
  };

  const confirmDischarge = () => {
    dischargePatient(confirmDialog.patient.id);
    setConfirmDialog({ open: false, patient: null });
  };

  const readyCount = dischargeList.filter(p => p.paid && p.status === 'ready').length;
  const blockedCount = dischargeList.filter(p => !p.paid).length;

  return (
    <div className="min-h-screen bg-background">
      <Topbar title="Chiqish boshqaruvi" />
      
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <DoorOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dischargeList.length}</p>
                <p className="text-sm text-muted-foreground">Jami chiqish kutmoqda</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success-light flex items-center justify-center">
                <Check className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{readyCount}</p>
                <p className="text-sm text-muted-foreground">Chiqishga tayyor</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{blockedCount}</p>
                <p className="text-sm text-muted-foreground">To'lov kutmoqda</p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        {blockedCount > 0 && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-warning-light border-l-4 border-warning">
            <AlertTriangle className="w-6 h-6 text-warning" />
            <div>
              <p className="font-semibold text-warning-foreground">Diqqat!</p>
              <p className="text-sm text-warning-foreground/80">
                {blockedCount} ta bemor to'lov qilmagani uchun chiqarib yuborilmaydi. Kassirga yuborish kerak.
              </p>
            </div>
          </div>
        )}

        {/* Discharge Table */}
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Bemor</th>
                <th className="table-header">Palata</th>
                <th className="table-header">Kunlar</th>
                <th className="table-header">To'lov</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {dischargeList.map((patient) => (
                <tr key={patient.id} className="table-row">
                  <td className="table-cell">
                    <span className="font-medium text-foreground">{patient.patient}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-muted-foreground" />
                      <span>{patient.room}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{patient.daysStayed}/{patient.totalDays}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${patient.paid ? 'badge-success' : 'badge-danger'}`}>
                      <CreditCard className="w-3.5 h-3.5 mr-1" />
                      {patient.paid ? "To'langan" : "To'lanmagan"}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${patient.status === 'ready' ? 'badge-success' : 'badge-warning'}`}>
                      {patient.status === 'ready' ? 'Tayyor' : 'Bloklangan'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center justify-end gap-2">
                      {!patient.paid && (
                        <button className="btn-warning flex items-center gap-2 py-2 px-3">
                          <Send className="w-4 h-4" />
                          <span>Kassirga</span>
                        </button>
                      )}
                      <button 
                        onClick={() => handleDischarge(patient)}
                        disabled={!patient.paid}
                        className={`flex items-center gap-2 py-2 px-3 rounded-lg font-medium transition-all ${
                          patient.paid 
                            ? 'btn-success' 
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        <DoorOpen className="w-4 h-4" />
                        <span>Chiqarish</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {dischargeList.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <DoorOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Chiqish kutayotganlar yo'q</h3>
              <p className="text-muted-foreground mt-2">Hozircha chiqish ro'yxatida hech kim yo'q</p>
            </div>
          )}
        </div>

        {/* Process Flow */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">Chiqish jarayoni:</h4>
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <ProcessStep number={1} label="Kun tugadi" active />
            <ProcessArrow />
            <ProcessStep number={2} label="To'lov tekshiruvi" />
            <ProcessArrow />
            <ProcessStep number={3} label="Kassirga yuborish" />
            <ProcessArrow />
            <ProcessStep number={4} label="To'lov tasdiqlash" />
            <ProcessArrow />
            <ProcessStep number={5} label="Bemorni chiqarish" />
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, patient: null })}
        onConfirm={confirmDischarge}
        title="Bemorni chiqarish"
        message={`${confirmDialog.patient?.patient} ni palatadan chiqarishni tasdiqlaysizmi?`}
        type="success"
        confirmText="Ha, chiqarish"
        cancelText="Yo'q"
      />
    </div>
  );
}

function ProcessStep({ number, label, active }) {
  return (
    <div className={`flex flex-col items-center min-w-28 ${active ? 'opacity-100' : 'opacity-60'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
        active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      }`}>
        {number}
      </div>
      <span className="text-xs text-center mt-2 text-muted-foreground">{label}</span>
    </div>
  );
}

function ProcessArrow() {
  return <div className="w-12 h-0.5 bg-border flex-shrink-0" />;
}
