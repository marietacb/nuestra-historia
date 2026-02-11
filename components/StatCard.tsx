
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  icon: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, icon, subtitle }) => {
  return (
    <div className="bg-surface-light p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="absolute -right-2 -top-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <span className="material-symbols-outlined text-7xl text-primary">{icon}</span>
      </div>
      <div className="w-12 h-12 rounded-xl bg-accent-rose flex items-center justify-center text-primary">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-text-muted font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-text-main">{value}</h3>
      </div>
      {trend && (
        <div className="text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          <span>{trend}</span>
        </div>
      )}
      {subtitle && (
        <div className="text-xs font-medium text-text-muted bg-gray-50 w-fit px-2 py-1 rounded-md">
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
