import { X, User, Phone, Calendar, MapPin, Stethoscope, Building2, Clock } from 'lucide-react';

export default function PatientDetailModal({ patient, onClose }) {
  if (!patient) return null;

  const statusConfig = {
    'waiting': { label: "Kutmoqda", class: 'badge-warning' },
    'in-progress': { label: "Qabulda", class: 'badge-info' },
    'payment': { label: "To'lov", class: 'badge-primary' },
    'completed': { label: "Tugadi", class: 'badge-success' },
  };

  const status = statusConfig[patient.status] || statusConfig['waiting'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{patient.name}</h2>
              <span className={`badge ${status.class} mt-1`}>{status.label}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <InfoItem icon={Phone} label="Telefon" value={patient.phone} />
          <InfoItem icon={Calendar} label="Tug'ilgan sana" value={patient.birthDate} />
          <InfoItem icon={User} label="Jinsi" value={patient.gender} />
          <InfoItem icon={MapPin} label="Manzil" value={patient.address} />
          <InfoItem icon={Building2} label="Filial" value={patient.branch} />
          <InfoItem icon={Stethoscope} label="Shifokor" value={patient.doctor} />
          <InfoItem icon={Clock} label="Kelgan vaqti" value={new Date(patient.createdAt).toLocaleString('uz-UZ')} />
          <InfoItem icon={User} label="Manba" value={patient.source} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-border">
          <button className="btn-primary flex-1">Doktorga yuborish</button>
          <button className="btn-outline flex-1">To'lovga yuborish</button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
      <Icon className="w-5 h-5 text-primary mt-0.5" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || 'N/A'}</p>
      </div>
    </div>
  );
}
