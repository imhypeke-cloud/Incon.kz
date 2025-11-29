import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, trendUp, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    slate: "bg-slate-50 text-slate-600",
  };

  const selectedColorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${selectedColorClass}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trendUp ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <div className="mt-1 text-2xl font-bold text-slate-800">{value}</div>
    </div>
  );
};

export default StatsCard;
