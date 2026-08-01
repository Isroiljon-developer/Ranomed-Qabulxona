import { useEffect } from 'react';
import { Users, Bot, BedDouble, DoorOpen, CreditCard, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import Topbar from '../layout/Topbar';
import StatCard from '../components/StatCard';
import QueueCard from '../components/QueueCard';
import BotRequestCard from '../components/BotRequestCard';
import WardStatusCard from '../components/WardStatusCard';
import AlertBanner from '../components/AlertBanner';
import PatientDetailModal from '../components/PatientDetailModal';
import BranchSelector from '../components/BranchSelector';
import { useReception } from '../context/ReceptionContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const {
    getBranchQueue,
    getBranchBotRequests,
    getBranchWards,
    getBranchDischargeList,
    selectedPatient,
    setSelectedPatient,
    updatePatientStatus,
    approveBotRequest,
    rejectBotRequest,
    sendToQueue,
    currentBranch,
    getBranchName,
    stats: receptionStats,
    fetchBranchData
  } = useReception();

  useEffect(() => {
    if (currentBranch) {
      fetchBranchData();
    }
  }, [currentBranch]);

  const queue = getBranchQueue();
  const botRequests = getBranchBotRequests();
  const wards = getBranchWards();
  const dischargeList = getBranchDischargeList();

  const stats = [
    { icon: Clock, label: 'Bugungi navbat', value: receptionStats.todayQueue, color: 'primary', trend: 12, trendUp: true },
    { icon: Bot, label: 'Botdan kelgan', value: receptionStats.pendingBot, color: 'info' },
    { icon: BedDouble, label: 'Palatada yotgan', value: receptionStats.activeWards, color: 'secondary' },
    { icon: DoorOpen, label: 'Bugun chiqadigan', value: dischargeList.length, color: 'warning' },
    { icon: CreditCard, label: "To'lov kutyapti", value: dischargeList.filter(d => !d.paid).length, color: 'destructive' },
  ];

  const urgentWards = wards.filter(w => w.patients.some(p => p.daysLeft === 0));

  return (
    <div className="min-h-screen bg-background">
      <Topbar title="Dashboard" />

      <div className="p-6 space-y-6">
        {/* Branch Selector */}
        <div className="flex items-center justify-between">
          <BranchSelector />
          <span className="text-sm text-muted-foreground">
            {getBranchName(currentBranch)} filiali ma'lumotlari
          </span>
        </div>

        {/* Alerts */}
        {urgentWards.length > 0 && (
          <AlertBanner
            message={`${urgentWards.length} ta palatada bugun chiqadigan bemorlar bor. Diqqat bilan tekshiring!`}
            type="danger"
          />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Queue Flow - 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Navbat oqimi</h3>
              <Link to="/queue" className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                Barchasini ko'rish <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Flow Indicator */}
            <div className="flex items-center gap-2 p-4 bg-card rounded-xl border border-border overflow-x-auto">
              <FlowStep label="Kutmoqda" count={queue.filter(q => q.status === 'waiting').length} active />
              <FlowArrow />
              <FlowStep label="Chaqirildi" count={0} />
              <FlowArrow />
              <FlowStep label="Qabulda" count={queue.filter(q => q.status === 'in-progress').length} />
              <FlowArrow />
              <FlowStep label="To'lov" count={queue.filter(q => q.status === 'payment').length} />
              <FlowArrow />
              <FlowStep label="Palata/Chiqish" count={0} />
            </div>

            {/* Queue Cards */}
            <div className="space-y-3">
              {queue.slice(0, 4).map((patient) => (
                <QueueCard
                  key={patient.id}
                  patient={patient}
                  onViewDetails={setSelectedPatient}
                  onStatusChange={updatePatientStatus}
                />
              ))}
              {queue.length === 0 && (
                <div className="text-center py-8 text-muted-foreground bg-card rounded-xl border border-border">
                  {getBranchName(currentBranch)} filialida hozircha navbatda hech kim yo'q
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Bot Requests & Ward Alerts */}
          <div className="space-y-6">
            {/* Bot Requests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Telegram so'rovlar</h3>
                <Link to="/bot-requests" className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                  Barchasi <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {botRequests.slice(0, 2).map((request) => (
                  <BotRequestCard
                    key={request.id}
                    request={request}
                    onApprove={approveBotRequest}
                    onReject={rejectBotRequest}
                    onSendToQueue={sendToQueue}
                  />
                ))}
                {botRequests.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground bg-card rounded-xl border border-border">
                    {currentBranch} filialida yangi so'rovlar yo'q
                  </div>
                )}
              </div>
            </div>

            {/* Ward Alerts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Palata ogohlantirishlari
                </h3>
                <Link to="/wards" className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                  Barchasi <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {urgentWards.slice(0, 2).map((ward) => (
                  <WardStatusCard key={ward.id} ward={ward} />
                ))}
                {urgentWards.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground bg-card rounded-xl border border-border">
                    {currentBranch} filialida shoshilinch holatlar yo'q
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}

function FlowStep({ label, count, active }) {
  return (
    <div className={`flex flex-col items-center min-w-20 p-3 rounded-lg ${active ? 'bg-primary-light' : 'bg-muted'}`}>
      <span className={`text-lg font-bold ${active ? 'text-primary' : 'text-muted-foreground'}`}>{count}</span>
      <span className={`text-xs ${active ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
    </div>
  );
}

function FlowArrow() {
  return <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />;
}
