import { useState } from 'react';
import { X, BedDouble, Calendar, User, Check } from 'lucide-react';
import { useReception } from '../context/ReceptionContext';

export default function AdmitToWardModal({ patient, onClose, onSuccess }) {
  const { wards, admitPatientToWard } = useReception();
  const [selectedWard, setSelectedWard] = useState(null);
  const [daysToStay, setDaysToStay] = useState(3);

  const availableWards = wards.filter(ward => ward.patients.length < ward.capacity);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedWard) return;

    admitPatientToWard(patient, selectedWard.id, daysToStay);
    onSuccess?.();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
              <BedDouble className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Palataga joylashtirish</h2>
              <p className="text-sm text-muted-foreground">{patient.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Days to Stay */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Yotish muddati (kun)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={daysToStay}
              onChange={(e) => setDaysToStay(parseInt(e.target.value) || 1)}
              className="input-field"
            />
          </div>

          {/* Ward Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              <BedDouble className="w-4 h-4 inline mr-2" />
              Palata tanlang
            </label>
            
            {availableWards.length === 0 ? (
              <div className="text-center py-8 bg-muted rounded-xl">
                <BedDouble className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Hozirda bo'sh palata yo'q</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {availableWards.map((ward) => {
                  const isSelected = selectedWard?.id === ward.id;
                  const availableBeds = ward.capacity - ward.patients.length;
                  
                  return (
                    <button
                      key={ward.id}
                      type="button"
                      onClick={() => setSelectedWard(ward)}
                      className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected 
                          ? 'border-primary bg-primary-light' 
                          : 'border-border hover:border-primary/50 bg-background'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <BedDouble className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-semibold text-foreground">{ward.roomNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {ward.patients.length}/{ward.capacity} band
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="badge badge-success">{availableBeds} joy bo'sh</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            <button 
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Bekor qilish
            </button>
            <button 
              type="submit"
              disabled={!selectedWard}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BedDouble className="w-4 h-4 mr-2" />
              Joylashtirish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
