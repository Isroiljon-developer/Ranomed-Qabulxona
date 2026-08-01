import { useState } from 'react';
import { Bot, Filter } from 'lucide-react';
import Topbar from '../layout/Topbar';
import BotRequestCard from '../components/BotRequestCard';
import { useReception } from '../context/ReceptionContext';

export default function BotRequests() {
  const { botRequests, approveBotRequest, rejectBotRequest, sendToQueue } = useReception();
  const [filter, setFilter] = useState('all');

  const filteredRequests = botRequests.filter(request => {
    if (filter === 'all') return true;
    if (filter === 'new') return request.status === 'new';
    if (filter === 'paid') return request.paid;
    if (filter === 'unpaid') return !request.paid;
    return true;
  });

  const stats = {
    total: botRequests.length,
    new: botRequests.filter(r => r.status === 'new').length,
    paid: botRequests.filter(r => r.paid).length,
    unpaid: botRequests.filter(r => !r.paid).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar title="Telegram so'rovlari" />
      
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Jami so'rovlar" value={stats.total} color="primary" />
          <StatCard label="Yangi" value={stats.new} color="info" />
          <StatCard label="To'langan" value={stats.paid} color="success" />
          <StatCard label="To'lanmagan" value={stats.unpaid} color="destructive" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Barchasi' },
              { value: 'new', label: 'Yangi' },
              { value: 'paid', label: "To'langan" },
              { value: 'unpaid', label: "To'lanmagan" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Request Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((request) => (
            <BotRequestCard
              key={request.id}
              request={request}
              onApprove={approveBotRequest}
              onReject={rejectBotRequest}
              onSendToQueue={sendToQueue}
            />
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Bot className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">So'rovlar topilmadi</h3>
            <p className="text-muted-foreground mt-2">Tanlangan filter bo'yicha so'rovlar yo'q</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorClasses = {
    primary: 'bg-primary-light text-primary',
    info: 'bg-info-light text-info',
    success: 'bg-success-light text-success',
    destructive: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="stat-card">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${colorClasses[color].split(' ')[1]}`}>{value}</p>
    </div>
  );
}
