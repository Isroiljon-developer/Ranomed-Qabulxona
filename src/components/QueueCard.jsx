import { User, Stethoscope, MapPin, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const statusConfig = {
  'waiting': { label: "Kutmoqda", class: 'badge-warning' },
  'in-progress': { label: "Qabulda", class: 'badge-info' },
  'payment': { label: "To'lov", class: 'badge-primary' },
  'completed': { label: "Tugadi", class: 'badge-success' },
};

const sourceConfig = {
  'Bot': { label: 'Bot', class: 'badge-info' },
  'Reception': { label: 'Reception', class: 'badge-primary' },
};

export default function QueueCard({ patient, onStatusChange, onViewDetails, onCall }) {
  const [showActions, setShowActions] = useState(false);

  const status = statusConfig[patient.status] || statusConfig['waiting'];
  const source = sourceConfig[patient.source] || sourceConfig['Reception'];

  return (
    <div className="bg-card rounded-xl border border-border p-4 hover:shadow-card transition-all duration-200 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Queue Number */}
          <div className="queue-number">
            {patient.queueNumber || '—'}
          </div>
          
          <div>
            <h3 
              className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={() => onViewDetails && onViewDetails(patient)}
            >
              {patient.name}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{patient.doctor}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{patient.branch}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`badge ${source.class}`}>{source.label}</span>
          <span className={`badge ${status.class}`}>{status.label}</span>
          
          <div className="relative">
            <button 
              onClick={() => setShowActions(!showActions)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg py-1 min-w-40 z-10 animate-scale-in">
                <button 
                  onClick={() => { onCall && onCall(patient); setShowActions(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                >
                  Chaqirish
                </button>
                <button 
                  onClick={() => { onStatusChange && onStatusChange(patient.id, 'in-progress'); setShowActions(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                >
                  Doktorga yuborish
                </button>
                <button 
                  onClick={() => { onStatusChange && onStatusChange(patient.id, 'payment'); setShowActions(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                >
                  To'lovga yuborish
                </button>
                <button 
                  onClick={() => { onViewDetails && onViewDetails(patient); setShowActions(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                >
                  Batafsil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}