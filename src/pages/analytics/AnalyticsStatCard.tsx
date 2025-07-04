import React from 'react';

interface AnalyticsStatCardProps {
  value: React.ReactNode;
  label: string;
  icon: React.ReactNode;
  iconBg?: string;
}

const AnalyticsStatCard: React.FC<AnalyticsStatCardProps> = ({
  value,
  label,
  icon,
  iconBg = '#e6f7ff',
}) => {
  return (
    <div className="analytics-stat-card">
      <div className="analytics-stat-card-content">
        <div className="analytics-stat-card-label">{label}</div>
        <div className="analytics-stat-card-value">{value}</div>
      </div>
      <div className="analytics-stat-card-icon" style={{ background: iconBg }}>
        {icon}
      </div>
    </div>
  );
};

export default AnalyticsStatCard;
