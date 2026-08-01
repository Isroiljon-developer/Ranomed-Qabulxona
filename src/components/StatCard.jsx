export default function StatCard({ icon: Icon, label, value, trend, trendUp, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-light text-primary',
    secondary: 'bg-secondary-light text-secondary',
    warning: 'bg-warning-light text-warning',
    success: 'bg-success-light text-success',
    destructive: 'bg-destructive/10 text-destructive',
    info: 'bg-info-light text-info',
  };

  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trendUp ? 'text-success' : 'text-destructive'}`}>
            {trendUp ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}
