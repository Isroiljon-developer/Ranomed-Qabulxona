import { X, User, Phone, Calendar, Clock, FileText, Plus, History, BedDouble, Printer } from 'lucide-react';
import { useState } from 'react';
import { useReception } from '../context/ReceptionContext';
import Receipt from './Receipt';

export default function WardDetailModal({ ward, onClose }) {
  const {
    updateWardPatientHistory,
    removePatientFromWard,
    currentBranch,
    addHistoryEntry,
    patients,
    doctors,
    nurses,
    admitToWard,
    dischargePatient,
    extendWardStay
  } = useReception();
  const [showAdmitForm, setShowAdmitForm] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState(null);

  const [formData, setFormData] = useState({
    patientId: '',
    shifokorId: '',
    nurseId: '',
    expectedDays: 1,
    admissionDate: new Date().toISOString().split('T')[0]
  });

  const handleAdmit = async (e) => {
    e.preventDefault();
    try {
      const res = await admitToWard({
        ...formData,
        wardId: ward.id,
        expectedDays: parseInt(formData.expectedDays)
      });

      const patient = patients.find(p => p.id === parseInt(formData.patientId));

      setReceiptData({
        patientName: patient ? patient.ism : 'Bemor',
        patientId: formData.patientId,
        roomNumber: ward.roomNumber,
        pricePerDay: ward.pricePerDay,
        days: formData.expectedDays,
        totalAmount: ward.pricePerDay * formData.expectedDays
      });

      setShowReceipt(true);
      setShowAdmitForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const occupancy = ward.patients.length;
  const capacity = ward.capacity;
  const hasSpace = occupancy < capacity;

  const handleAddNote = (patient) => {
    const note = prompt('Yozuv qo\'shing:');
    if (note) {
      updateWardPatientHistory(ward.id, patient.id, note, currentBranch);
    }
  };

  const handleDischarge = async (patient) => {
    if (confirm(`${patient.name}ni chiqarishni xohlaysizmi?`)) {
      await dischargePatient(patient.id);
      addHistoryEntry(patient.id, patient.name, 'Palatadan chiqarildi', currentBranch, `${ward.roomNumber}`);
      onClose();
    }
  };

  const handleExtend = async (patient) => {
    const days = prompt("Necha kunga uzaytirmoqchisiz?", "1");
    if (days && !isNaN(days) && parseInt(days) > 0) {
      await extendWardStay(patient.id, parseInt(days));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={e => e.stopPropagation()}>
        {showReceipt && receiptData && (
          <Receipt
            data={receiptData}
            onClose={() => {
              setShowReceipt(false);
              onClose();
            }}
          />
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
              {ward.image ? (
                <img
                  src={ward.image.startsWith('http') ? ward.image : `http://${window.location.hostname || 'localhost'}:9000${ward.image.startsWith('/') ? '' : '/'}${ward.image}`}
                  alt={ward.roomNumber}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                  <BedDouble className="w-10 h-10" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{ward.roomNumber}</h2>
              <p className="text-sm text-muted-foreground">
                {ward.type} palata • {occupancy}/{capacity} joy band
              </p>
              <p className="text-xs font-semibold text-primary mt-1">
                {new Intl.NumberFormat('uz-UZ').format(ward.pricePerDay)} so'm/kun
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showAdmitForm ? (
          <>
            {/* Occupancy Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Bandlik</span>
                <span className="font-medium text-foreground">{Math.round((occupancy / capacity) * 100)}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${occupancy === capacity ? 'bg-destructive' :
                    occupancy > capacity / 2 ? 'bg-warning' : 'bg-success'
                    }`}
                  style={{ width: `${(occupancy / capacity) * 100}%` }}
                />
              </div>
            </div>

            {/* Patients List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Bemorlar</h3>

              {ward.patients.length > 0 ? (
                <div className="space-y-3">
                  {ward.patients.map((patient) => (
                    <div key={patient.id} className="bg-muted rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{patient.name}</h4>
                            <p className="text-sm text-muted-foreground">{patient.diagnosis || 'Tekshiruv'}</p>
                          </div>
                        </div>
                        <div className={`badge ${patient.daysLeft === 0 ? 'badge-danger' :
                          patient.daysLeft === 1 ? 'badge-warning' : 'badge-success'
                          }`}>
                          {patient.daysLeft === 0 ? 'Bugun chiqadi' : `${patient.daysLeft} kun qoldi`}
                        </div>
                      </div>

                      {/* Patient Details */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{patient.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{patient.admitDate}</span>
                        </div>
                      </div>

                      {/* Patient History */}
                      {patient.history && patient.history.length > 0 && (
                        <div className="mb-4">
                          <button
                            onClick={() => setSelectedPatientForHistory(
                              selectedPatientForHistory === patient.id ? null : patient.id
                            )}
                            className="flex items-center gap-2 text-sm text-primary font-medium mb-2"
                          >
                            <History className="w-4 h-4" />
                            Tarix ({patient.history.length})
                          </button>

                          {selectedPatientForHistory === patient.id && (
                            <div className="space-y-2 mt-2 pl-4 border-l-2 border-primary-light">
                              {patient.history.map((entry, idx) => (
                                <div key={idx} className="history-item">
                                  <div className={`history-dot history-dot-${entry.type}`} />
                                  <div className="flex-1">
                                    <p className="text-sm text-foreground">{entry.action}</p>
                                    <p className="text-xs text-muted-foreground">{entry.date}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => handleExtend(patient)} className="btn-primary text-sm flex-1 bg-indigo-500 hover:bg-indigo-600">
                          <Clock className="w-4 h-4 mr-1 inline" />
                          Uzaytirish
                        </button>
                        <button onClick={() => handleAddNote(patient)} className="btn-outline text-sm flex-1">
                          <FileText className="w-4 h-4 mr-1 inline" />
                          Yozuv
                        </button>
                        <button onClick={() => handleDischarge(patient)} className="btn-danger text-sm flex-1">
                          Chiqarish
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted rounded-xl">
                  <p className="text-muted-foreground">Bu palata bo'sh</p>
                </div>
              )}
            </div>

            {/* Add Patient Button */}
            {hasSpace && (
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Bo'sh joy: {capacity - occupancy} ta
                </p>
                <button
                  onClick={() => setShowAdmitForm(true)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Bemor yotqizish
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleAdmit} className="space-y-4">
            <h3 className="font-semibold text-foreground mb-4">Bemor yotqizish formasi</h3>

            <div>
              <label className="block text-sm font-medium mb-1">Bemorni tanlang</label>
              <select
                className="input-field"
                required
                value={formData.patientId}
                onChange={e => setFormData({ ...formData, patientId: e.target.value })}
              >
                <option value="">Tanlang</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.ism} ({p.telefon})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Shifokor</label>
                <select
                  className="input-field"
                  required
                  value={formData.shifokorId}
                  onChange={e => setFormData({ ...formData, shifokorId: e.target.value })}
                >
                  <option value="">Tanlang</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hamshira</label>
                <select
                  className="input-field"
                  required
                  value={formData.nurseId}
                  onChange={e => setFormData({ ...formData, nurseId: e.target.value })}
                >
                  <option value="">Tanlang</option>
                  {nurses.map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kunlar soni</label>
                <input
                  type="number"
                  min="1"
                  className="input-field"
                  value={formData.expectedDays}
                  onChange={e => setFormData({ ...formData, expectedDays: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Keltirilgan sana</label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.admissionDate}
                  onChange={e => setFormData({ ...formData, admissionDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
              <div className="flex justify-between items-center font-bold">
                <span>Umumiy summa:</span>
                <span className="text-lg text-primary">
                  {new Intl.NumberFormat('uz-UZ').format(ward.pricePerDay * formData.expectedDays)} so'm
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowAdmitForm(false)}
                className="btn-outline flex-1"
              >
                Bekor qilish
              </button>
              <button type="submit" className="btn-primary flex-1">
                Yotqizish va Chek
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
