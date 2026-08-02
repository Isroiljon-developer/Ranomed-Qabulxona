import { BedDouble, User, Clock, AlertTriangle } from 'lucide-react';

export default function WardStatusCard({ ward, onClick }) {
  const occupancy = ward.patients.length;
  const capacity = ward.capacity;
  const occupancyPercent = (occupancy / capacity) * 100;

  const hasUrgent = ward.patients.some(p => p.daysLeft === 0);
  const hasWarning = ward.patients.some(p => p.daysLeft === 1);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `https://ranomed-2.onrender.com${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const imgUrl = getImageUrl(ward.image);

  const getStatusColor = () => {
    if (hasUrgent) return 'border-l-destructive';
    if (hasWarning) return 'border-l-warning';
    if (occupancy === 0) return 'border-l-muted';
    return 'border-l-success';
  };

  const getOccupancyBadge = () => {
    if (occupancy === 0) return { label: "Bo'sh", class: 'badge bg-muted text-muted-foreground' };
    if (occupancy === capacity) return { label: "To'liq", class: 'badge-danger' };
    return { label: `${occupancy}/${capacity}`, class: 'badge-success' };
  };

  const badge = getOccupancyBadge();

  return (
    <div
      className={`ward-card border-l-4 ${getStatusColor()} animate-fade-in p-0 overflow-hidden`}
      onClick={() => onClick && onClick(ward)}
    >
      {/* Image if available */}
      <div className="h-32 w-full bg-muted overflow-hidden relative">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={ward.roomNumber}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <BedDouble className="w-8 h-8 opacity-20" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={badge.class}>{badge.label}</span>
        </div>
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-semibold text-foreground text-lg">{ward.roomNumber}</h3>
              <p className="text-xs text-muted-foreground">{ward.type} palata</p>
            </div>
          </div>
          {hasUrgent && (
            <div className="flex items-center gap-1 text-destructive animate-pulse-soft">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Occupancy Bar */}
        <div className="mb-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${hasUrgent ? 'bg-destructive' : hasWarning ? 'bg-warning' : 'bg-success'
                }`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        {/* Patients */}
        {ward.patients.length > 0 ? (
          <div className="space-y-3">
            {ward.patients.map((patient, index) => (
              <div
                key={patient.id || index}
                className={`flex items-center justify-between p-3 rounded-lg ${patient.daysLeft === 0 ? 'bg-destructive/10' :
                  patient.daysLeft === 1 ? 'bg-warning-light' : 'bg-muted'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{patient.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className={`text-sm font-medium ${patient.daysLeft === 0 ? 'text-destructive' :
                    patient.daysLeft === 1 ? 'text-warning' : 'text-muted-foreground'
                    }`}>
                    {patient.daysLeft === 0 ? 'Bugun chiqadi' : `${patient.daysLeft} kun`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Palata bo'sh</p>
        )}

        {/* Click hint */}
        <p className="text-xs text-primary text-center mt-4">Batafsil ko'rish uchun bosing</p>
      </div>
    </div>
  );
}
