import React, { useState } from 'react';
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
import dayjs, { Dayjs } from 'dayjs';
// import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
// const isMobile = useMediaQuery('(max-width: 768px)');

const tabItems = (filters: AnalyticsFiltersValues) => [
  {
    key: 'overview',
    label: 'Обзор',
    icon: <PieChartOutlined />,
    children: <OverviewTab filters={filters} />,
  },
  {
    key: 'script',
    label: 'Инструкция',
    icon: <FileTextOutlined />,
    children: <ScriptTab filters={filters} />,
  },
  {
    key: 'negations',
    label: 'Отрицания',
    icon: <WarningOutlined />,
    children: <NegationsTab filters={filters} />,
  },
  {
    key: 'reports',
    label: 'Отчеты',
    icon: <BarChartOutlined />,
    children: <ReportsTab />,
  },
];

const AnalyticsPage: React.FC = () => {
  const [filters, setFilters] = useState<AnalyticsFiltersValues>({
    dateRange: [null, null],
    restaurant: undefined,
  });
  const [activeKey, setActiveKey] = useState('overview');

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
      {/* Преобразуем dateRange из Dayjs в string для моковых API */}
      {(() => {
        const toStr = (d: Dayjs | null) => (d ? d.format('YYYY-MM-DD') : null);
        const apiFilters = {
          ...filters,
          dateRange: [
            toStr(filters.dateRange[0]),
            toStr(filters.dateRange[1]),
          ] as [string | null, string | null],
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
                  onClick={() => setActiveKey(tab.key)}
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
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AnalyticsPage;
