import { useEffect, useState } from 'react';
import { getFunnelData } from '../../../shared/api';
import { Card, Row, Col, Spin, Typography } from 'antd';
import { Phone, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Line, Funnel } from '@ant-design/plots';
import '../dashboard.scss';

const { Title } = Typography;

type FunnelData = Awaited<ReturnType<typeof getFunnelData>>;

interface StatCardProps {
  title: string;
  value: string | number;
  secondary?: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  secondary,
  icon,
  color,
}) => (
  <Card bodyStyle={{ padding: 0 }}>
    <div className="stat-card">
      <div className="stat-card-info">
        <span className="stat-card-title">{title}</span>
        <span className="stat-card-value">{value}</span>
        {secondary && (
          <span className="stat-card-secondary" style={{ color }}>
            {secondary}
          </span>
        )}
      </div>
      <div
        className="stat-card-icon-wrapper"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
    </div>
  </Card>
);

export const FunnelDashboard = () => {
  const [data, setData] = useState<FunnelData | null>(null);

  useEffect(() => {
    getFunnelData().then(setData);
  }, []);

  if (!data) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const funnelChartData = [
    { stage: 'Всего звонков', number: data.totalCalls },
    { stage: 'Бронирования', number: data.bookings },
    { stage: 'Предзаказы', number: data.preorders },
  ];

  const conversionTrendData = data.trend
    .map((item) => ({
      date: item.date,
      value: item.bookings,
      category: 'Бронирования',
    }))
    .concat(
      data.trend.map((item) => ({
        date: item.date,
        value: item.preorders,
        category: 'Предзаказы',
      }))
    );

  const chartColors = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
  ];

  return (
    <div className="dashboard-page">
      <Title level={2} className="dashboard-title">
        Воронка звонков и конверсии
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Всего звонков"
            value={data.totalCalls}
            icon={<Phone />}
            color="var(--color-info)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Бронирования"
            value={data.bookings}
            secondary={`${data.conversionToBookingPercent}%`}
            icon={<TrendingUp />}
            color="var(--color-positive)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Предзаказы"
            value={data.preorders}
            secondary={`${data.conversionToPreorderPercent}%`}
            icon={<CheckCircle />}
            color="var(--color-chart-5)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Пропущено"
            value={data.missedCalls}
            icon={<TrendingDown />}
            color="var(--color-negative)"
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Воронка конверсии">
            <Funnel
              data={funnelChartData}
              xField="stage"
              yField="number"
              legend={false}
              height={300}
              color={chartColors}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Динамика конверсии">
            <Line
              data={conversionTrendData}
              xField="date"
              yField="value"
              seriesField="category"
              height={300}
              color={chartColors}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
