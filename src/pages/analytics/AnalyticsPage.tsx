import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
// import { Tabs } from 'antd';
import {
  PieChartOutlined,
  FileTextOutlined,
  WarningOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import './AnalyticsPage.scss';
import OverviewTab from './OverviewTab';
import ScriptTab from './ScriptTab';
import NegationsTab from './NegationsTab';
import ReportsTab from './ReportsTab';
import AnalyticsFilters, {
  type AnalyticsFiltersValues,
} from './AnalyticsFilters';
import { Typography } from 'antd';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
// import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
// const isMobile = useMediaQuery('(max-width: 768px)');

const tabItems = (apiFilters: {
  dateRange: [string | null, string | null];
  restaurant?: string;
}) => [
  {
    key: 'overview',
    label: 'Обзор',
    icon: <PieChartOutlined />,
    children: <OverviewTab filters={apiFilters} />,
  },
  {
    key: 'script',
    label: 'Инструкция',
    icon: <FileTextOutlined />,
    children: <ScriptTab filters={apiFilters} />,
  },
  {
    key: 'negations',
    label: 'Отрицания',
    icon: <WarningOutlined />,
    children: <NegationsTab filters={apiFilters} />,
  },
  {
    key: 'reports',
    label: 'Отчеты',
    icon: <BarChartOutlined />,
    children: <ReportsTab />,
  },
];

const tabKeys = ['overview', 'script', 'negations', 'reports'];

const AnalyticsPage: React.FC = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const defaultEnd = dayjs();
  const defaultStart = dayjs().subtract(3, 'month');
  const [filters, setFilters] = useState<AnalyticsFiltersValues>({
    dateRange: [defaultStart, defaultEnd],
    restaurant: undefined,
  });
  // Если url не содержит таб или таб невалидный — редиректим на overview
  useEffect(() => {
    if (!tab || !tabKeys.includes(tab)) {
      navigate('/dashboard/analytics/overview', { replace: true });
    }
  }, [tab, navigate]);
  const activeKey = tabKeys.includes(tab || '') ? tab! : 'overview';

  // Заглушки для опций ресторанов
  const restaurantOptions = [
    { label: 'Ресторан 1', value: 'rest1' },
    { label: 'Ресторан 2', value: 'rest2' },
  ];

  const handleFiltersChange = (newFilters: AnalyticsFiltersValues) => {
    setFilters(newFilters);
  };

  const handleFiltersReset = () => {
    setFilters({ dateRange: [null, null], restaurant: undefined });
  };

  return (
    <div className="analytics-page">
      <Typography.Title level={2} className="dashboard-title">
        Аналитика звонков
      </Typography.Title>
      <AnalyticsFilters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleFiltersReset}
        restaurantOptions={restaurantOptions}
      />
      {(() => {
        const toStr = (d: Dayjs | null) => (d ? d.format('YYYY-MM-DD') : null);
        const apiFilters = {
          dateRange: [
            toStr(filters.dateRange[0]),
            toStr(filters.dateRange[1]),
          ] as [string | null, string | null],
          restaurant: filters.restaurant,
        };
        return (
          <div className="analytics-custom-tabs">
            <div className="analytics-custom-tabs-list">
              {tabItems(apiFilters).map((tab) => (
                <button
                  key={tab.key}
                  className={`analytics-custom-tab${
                    activeKey === tab.key ? ' active' : ''
                  }`}
                  onClick={() => navigate(`/dashboard/analytics/${tab.key}`)}
                  type="button"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="analytics-custom-tab-content">
              {
                tabItems(apiFilters).find((tab) => tab.key === activeKey)
                  ?.children
              }
              <Outlet />
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AnalyticsPage;
