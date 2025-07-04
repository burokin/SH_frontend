import React, { useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { Pie, Column } from '@ant-design/plots';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import { getAnalyticsNegations } from '../../shared/api';
import { Percent, ThumbsDown, User } from 'lucide-react';

// Тип для данных по сотрудникам
interface StaffNegationDatum {
  name: string;
  count: number;
  type: string; // тип отрицания
}

// Цвета для причин отрицаний
const negationReasonColorMap: Record<string, string> = {
  Грубость: '#ff4d4f',
  'Долгое ожидание': '#faad14',
  'Не помогли': '#1677ff',
  'Ошибки в заказе': '#52c41a',
};

interface NegationsTabProps {
  filters: {
    dateRange: [string | null, string | null];
    restaurant?: string;
  };
}

const NegationsTab: React.FC<NegationsTabProps> = ({ filters }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    percentWithNeg: number;
    totalNegations: number;
    minNegStaff: { name: string; count: number } | null;
    topNegations: { reason: string; count: number }[];
    staffNegations: StaffNegationDatum[];
    staffNegationsStacked: StaffNegationDatum[];
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    getAnalyticsNegations({
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

  const negationStats = [
    {
      label: '% звонков с отрицаниями',
      value: data.percentWithNeg + '%',
      icon: <Percent size={24} color="#1677ff" />,
      bg: '#e6f7ff',
    },
    {
      label: 'Всего отрицаний',
      value: data.totalNegations,
      icon: <ThumbsDown size={24} color="#ff4d4f" />,
      bg: '#fff1f0',
    },
    {
      label: 'Сотрудник с мин. отрицаниями',
      value: data.minNegStaff
        ? `${data.minNegStaff.name} (${data.minNegStaff.count})`
        : '-',
      icon: <User size={24} color="#52c41a" />,
      bg: '#f6ffed',
    },
  ];

  return (
    <div>
      <Row
        gutter={[isMobile ? 8 : 24, isMobile ? 8 : 32]}
        style={{ marginBottom: isMobile ? 8 : 32 }}
      >
        {negationStats.map((stat) => (
          <Col xs={24} md={8} key={stat.label}>
            <div className="analytics-stat-card">
              <div className="analytics-stat-card-content">
                <div className="analytics-stat-card-label">{stat.label}</div>
                <div className="analytics-stat-card-value">{stat.value}</div>
              </div>
              <div
                className="analytics-stat-card-icon"
                style={{ background: stat.bg }}
              >
                {stat.icon}
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <Row gutter={[isMobile ? 8 : 24, isMobile ? 8 : 24]}>
        <Col xs={24} md={7}>
          <div
            className="analytics-card analytics-chart-block"
            style={{ marginBottom: isMobile ? 10 : 0 }}
          >
            <div
              className="analytics-section-title"
              style={{ marginBottom: 8 }}
            >
              Топ причин отрицаний
            </div>
            <Pie
              data={data.topNegations}
              angleField="count"
              colorField="reason"
              color={({ reason }: { reason: string }) =>
                negationReasonColorMap[reason] || '#bfbfbf'
              }
              label={{
                text: 'count',
                style: {
                  fontWeight: 'bold',
                },
              }}
              legend={{
                color: {
                  title: false,
                  position: 'right',
                  rowPadding: 5,
                },
              }}
            />
          </div>
        </Col>
        <Col xs={24} md={17}>
          <div
            className="analytics-card analytics-chart-block"
            style={{ marginBottom: isMobile ? 10 : 0 }}
          >
            <div
              className="analytics-section-title"
              style={{ marginBottom: 8 }}
            >
              Сотрудники с отрицаниями
            </div>
            <Column
              data={data.staffNegationsStacked}
              xField="name"
              yField="count"
              colorField="type"
              stack={true}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default NegationsTab;
