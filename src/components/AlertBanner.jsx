import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function AlertBanner({ message, type = 'warning', dismissible = true }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const typeClasses = {
    warning: 'bg-warning-light border-warning text-warning-foreground',
    danger: 'bg-destructive/10 border-destructive text-destructive',
    info: 'bg-info-light border-info text-info',
    success: 'bg-success-light border-success text-success',
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border-l-4 ${typeClasses[type]} animate-fade-in`}>
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      {dismissible && (
        <button 
          onClick={() => setVisible(false)}
          className="p-1 rounded hover:bg-foreground/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
