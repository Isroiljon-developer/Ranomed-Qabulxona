import { User, MapPin, Stethoscope, Clock, CreditCard, Check, X, Phone, Send } from 'lucide-react';

export default function BotRequestCard({ request, onApprove, onReject, onCall, onSendToQueue }) {
  const isPaid = request.paid;

  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:shadow-card transition-all duration-200 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-info-light flex items-center justify-center">
            <User className="w-6 h-6 text-info" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{request.telegramUser}</h3>
            <span className={`badge ${request.status === 'new' ? 'badge-primary' : 'badge-warning'}`}>
              {request.status === 'new' ? 'Yangi' : 'Kutilmoqda'}
            </span>
          </div>
        </div>
        <div className={`badge ${isPaid ? 'badge-success' : 'badge-danger'}`}>
          <CreditCard className="w-3.5 h-3.5 mr-1" />
          {isPaid ? "To'langan" : "To'lanmagan"}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{request.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Stethoscope className="w-4 h-4" />
          <span>{request.doctor}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{request.time}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <button 
          onClick={() => onApprove && onApprove(request.id)}
          className="btn-success flex-1 flex items-center justify-center gap-2 py-2"
        >
          <Check className="w-4 h-4" />
          <span>Tasdiqlash</span>
        </button>
        <button 
          onClick={() => onReject && onReject(request.id)}
          className="btn-danger flex-1 flex items-center justify-center gap-2 py-2"
        >
          <X className="w-4 h-4" />
          <span>Rad etish</span>
        </button>
      </div>
      
      <div className="flex gap-2 mt-2">
        <button 
          onClick={() => onCall && onCall(request)}
          className="btn-outline flex-1 flex items-center justify-center gap-2 py-2"
        >
          <Phone className="w-4 h-4" />
          <span>Qo'ng'iroq</span>
        </button>
        <button 
          onClick={() => onSendToQueue && onSendToQueue(request)}
          className="btn-primary flex-1 flex items-center justify-center gap-2 py-2"
          disabled={!isPaid}
        >
          <Send className="w-4 h-4" />
          <span>Navbatga</span>
        </button>
      </div>
      
      {!isPaid && (
        <p className="text-xs text-destructive mt-3 text-center">
          ⚠️ To'lov qilinmagan. Kassirga yuborish kerak.
        </p>
      )}
    </div>
  );
}
