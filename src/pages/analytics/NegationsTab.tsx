import React, { useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { Pie, Column } from '@ant-design/plots';
import { ThumbsDown, Percent, User } from 'lucide-react';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import { getAnalyticsNegations } from '../../shared/api';

// Моковые данные звонков за неделю
const callsWeek = [
  { staffer: 'Иванов', negations: 2, total: 12 },
  { staffer: 'Петрова', negations: 3, total: 10 },
  { staffer: 'Смирнова', negations: 1, total: 8 },
  { staffer: 'Сидоров', negations: 4, total: 7 },
  { staffer: 'Кузнецова', negations: 0, total: 6 },
];

const totalCalls = callsWeek.reduce((sum, c) => sum + c.total, 0);
const callsWithNeg = callsWeek.reduce(
  (sum, c) => sum + (c.negations > 0 ? 1 : 0),
  0
);
const totalNegations = callsWeek.reduce((sum, c) => sum + c.negations, 0);
const percentWithNeg = totalCalls
  ? Math.round((callsWithNeg / totalCalls) * 100)
  : 0;

// Сотрудник с наименьшим количеством отрицаний (и не менее 5 звонков за неделю)
const eligibleStaff = callsWeek.filter((c) => c.total >= 5);
const minNegStaff = eligibleStaff.reduce(
  (min, c) => (c.negations < min.negations ? c : min),
  eligibleStaff[0]
);

const negationStats = [
  {
    label: '% звонков с отрицаниями',
    value: percentWithNeg + '%',
    icon: <Percent size={24} color="#1677ff" />,
    bg: '#e6f7ff',
  },
  {
    label: 'Всего отрицаний',
    value: totalNegations,
    icon: <ThumbsDown size={24} color="#ff4d4f" />,
    bg: '#fff1f0',
  },
  {
    label: 'Сотрудник с мин. отрицаниями',
    value: minNegStaff
      ? `${minNegStaff.staffer} (${minNegStaff.negations})`
      : '-',
    icon: <User size={24} color="#52c41a" />,
    bg: '#f6ffed',
  },
];

const topNegations = [
  { reason: 'Грубость', count: 3 },
  { reason: 'Долгое ожидание', count: 2 },
  { reason: 'Не помогли', count: 2 },
  { reason: 'Ошибки в заказе', count: 1 },
];

// Тип для данных по сотрудникам
interface StaffNegationDatum {
  name: string;
  count: number;
  type: string; // тип отрицания
}

const staffNegations: StaffNegationDatum[] = [
  { name: 'Иванов', count: 2, type: 'Грубость' },
  { name: 'Иванов', count: 2, type: 'Долгое ожидание' },
  { name: 'Иванов', count: 2, type: 'Нет оплаты QR кодом' },
  { name: 'Петрова', count: 3, type: 'Долгое ожидание' },
  { name: 'Петрова', count: 3, type: 'Ошибки в заказе' },
  { name: 'Петрова', count: 3, type: 'Нет оплаты QR кодом' },
  { name: 'Смирнова', count: 1, type: 'Не помогли' },
  { name: 'Смирнова', count: 1, type: 'Долгое ожидание' },
  { name: 'Смирнова', count: 1, type: 'Нет оплаты QR кодом' },
  { name: 'Сидоров', count: 4, type: 'Ошибки в заказе' },
  { name: 'Сидоров', count: 4, type: 'Долгое ожидание' },
  { name: 'Сидоров', count: 4, type: 'Нет оплаты QR кодом' },
  { name: 'Кузнецова', count: 0, type: 'Грубость' },
  { name: 'Кузнецова', count: 0, type: 'Долгое ожидание' },
  { name: 'Кузнецова', count: 0, type: 'Нет оплаты QR кодом' },
];

// Цвета для причин отрицаний
const negationReasonColorMap: Record<string, string> = {
  Грубость: '#ff4d4f',
  'Долгое ожидание': '#faad14',
  'Не помогли': '#1677ff',
  'Ошибки в заказе': '#52c41a',
};

const pieConfig = {
  data: topNegations,
  angleField: 'count',
  colorField: 'reason',
  color: ({ reason }: { reason: string }) =>
    negationReasonColorMap[reason] || '#bfbfbf',
  label: {
    text: 'count',
    style: {
      fontWeight: 'bold',
    },
  },
  legend: {
    color: {
      title: false,
      position: 'right',
      rowPadding: 5,
    },
  },
};

const columnConfig = {
  data: staffNegations,
  xField: 'name',
  yField: 'count',
  colorField: 'type',
  stack: true,
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

  const pieConfig = {
    data: data.topNegations,
    angleField: 'count',
    colorField: 'reason',
    color: ({ reason }: { reason: string }) =>
      negationReasonColorMap[reason] || '#bfbfbf',
    label: {
      text: 'count',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  };

  const columnConfig = {
    data: data.staffNegationsStacked,
    xField: 'name',
    yField: 'count',
    colorField: 'type',
    stack: true,
  };

  return (
    <div>
      <Row
        gutter={[isMobile ? 8 : 24, isMobile ? 8 : 24]}
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
            <Pie {...pieConfig} />
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
            <Column {...columnConfig} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default NegationsTab;
