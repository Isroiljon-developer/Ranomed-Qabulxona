import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Tasdiqlash", 
  message = "Bu amalni bajarishni xohlaysizmi?",
  confirmText = "Ha",
  cancelText = "Yo'q",
  type = "warning"
}) {
  if (!isOpen) return null;

  const iconColors = {
    warning: 'bg-warning-light text-warning',
    danger: 'bg-destructive/10 text-destructive',
    info: 'bg-info-light text-info',
    success: 'bg-success-light text-success',
  };

  const confirmButtonClasses = {
    warning: 'btn-warning',
    danger: 'btn-danger',
    info: 'btn-primary',
    success: 'btn-success',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-sm animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full ${iconColors[type]} flex items-center justify-center mb-4`}>
            <AlertTriangle className="w-8 h-8" />
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6">{message}</p>
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={onClose}
              className="btn-outline flex-1"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }}
              className={`${confirmButtonClasses[type]} flex-1`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
