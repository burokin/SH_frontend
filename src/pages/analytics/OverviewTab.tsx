import React, { useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';

import { Column, Pie } from '@ant-design/plots';
import { Phone, PhoneOff, AlertTriangle, FileWarning } from 'lucide-react';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import AnalyticsStatCard from './AnalyticsStatCard';
import { getAnalyticsOverview } from '../../shared/api';

// Цвета для тем звонков и динамики
const callTypeColorMap: Record<string, string> = {
  Бронирование: '#faad14',
  Самовывоз: '#52c41a',
  Жалоба: '#722ed1',
  Пропущено: '#ff4d4f',
  Прочее: '#8c8c8c',
};

interface OverviewTabProps {
  filters: {
    dateRange: [string | null, string | null];
    restaurant?: string;
  };
}

const OverviewTab: React.FC<OverviewTabProps> = ({ filters }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    totalCalls: number;
    missedCalls: number;
    negations: number;
    scriptErrors: number;
    topics: { type: string; value: number }[];
    dynamic: {
      date: string;
      other: number;
      missed: number;
      booking: number;
      pickup: number;
      complaint: number;
    }[];
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    getAnalyticsOverview({
      dateRange: filters.dateRange,
      restaurant: filters.restaurant,
    })
      .then(setData)
      .finally(() => setLoading(false));
  }, [filters.dateRange, filters.restaurant]);

  if (loading || !data) {
    return (
      <div
        style={{
          minHeight: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const pieConfig = {
    data: data.topics,
    angleField: 'value',
    colorField: 'type',
    color: ({ type }: { type: string }) => callTypeColorMap[type] || '#bfbfbf',
    label: {
      text: 'value',
      style: { fontWeight: 'bold' },
    },
    legend: {
      color: { title: false, position: 'right', rowPadding: 5 },
    },
  };

  // Преобразуем динамику для Column
  const columnData: { date: string; type: string; value: number }[] =
    data.dynamic.flatMap((d) => [
      { date: d.date.slice(5), type: 'Бронирование', value: d.booking },
      { date: d.date.slice(5), type: 'Самовывоз', value: d.pickup },
      { date: d.date.slice(5), type: 'Жалоба', value: d.complaint },
      { date: d.date.slice(5), type: 'Пропущено', value: d.missed },
      { date: d.date.slice(5), type: 'Прочее', value: d.other },
    ]);

  return (
    <div>
      <Row
        gutter={[isMobile ? 8 : 24, isMobile ? 8 : 24]}
        style={{ marginBottom: isMobile ? 8 : 32 }}
      >
        <Col xs={24} md={6}>
          <AnalyticsStatCard
            label="Всего звонков"
            value={data.totalCalls}
            icon={<Phone size={24} color="#1677ff" />}
            iconBg="#e6f7ff"
          />
        </Col>
        <Col xs={24} md={6}>
          <AnalyticsStatCard
            label="Пропущенных звонков"
            value={data.missedCalls}
            icon={<PhoneOff size={24} color="#ff4d4f" />}
            iconBg="#fff1f0"
          />
        </Col>
        <Col xs={24} md={6}>
          <AnalyticsStatCard
            label="Звонков с отрицанием"
            value={data.negations}
            icon={<AlertTriangle size={24} color="#faad14" />}
            iconBg="#fffbe6"
          />
        </Col>
        <Col xs={24} md={6}>
          <AnalyticsStatCard
            label="Звонков с нарушением инструкции"
            value={data.scriptErrors}
            icon={<FileWarning size={24} color="#722ed1" />}
            iconBg="#f9f0ff"
          />
        </Col>
      </Row>
      <Row gutter={[isMobile ? 8 : 24, isMobile ? 8 : 24]}>
        <Col xs={24} md={7}>
          <div
            className="analytics-card analytics-chart-block"
            style={{ marginBottom: isMobile ? 10 : 24 }}
          >
            <div
              className="analytics-section-title"
              style={{ marginBottom: 8 }}
            >
              Темы звонков
            </div>
            <Pie {...pieConfig} />
          </div>
        </Col>
        <Col xs={24} md={17}>
          <div
            className="analytics-card analytics-chart-block"
            style={{ marginBottom: isMobile ? 10 : 24 }}
          >
            <div
              className="analytics-section-title"
              style={{ marginBottom: 8 }}
            >
              Динамика звонков
            </div>
            <Column
              data={columnData}
              xField="date"
              yField="value"
              colorField="type"
              color={({ type }: { type: string }) =>
                callTypeColorMap[type] || '#bfbfbf'
              }
              stack={true}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default OverviewTab;
