import { useEffect, useState } from 'react';
import { getNegationsData } from '../../../shared/api';
import { Card, Row, Col, Spin, Typography } from 'antd';
import { BarChart, TrendingDown } from 'lucide-react';
import { Bar, Line } from '@ant-design/plots';
import '../dashboard.scss';

const { Title } = Typography;
type NegationsData = Awaited<ReturnType<typeof getNegationsData>>;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Card bodyStyle={{ padding: 0 }}>
    <div className="stat-card">
      <div className="stat-card-info">
        <span className="stat-card-title">{title}</span>
        <span className="stat-card-value">{value}</span>
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

export const NegationsDashboard = () => {
  const [data, setData] = useState<NegationsData | null>(null);

  useEffect(() => {
    getNegationsData().then(setData);
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

  return (
    <div className="dashboard-page">
      <Title level={2} className="dashboard-title">
        Причины отказов и отрицаний
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={12}>
          <StatCard
            title="Всего отказов"
            value={data.totalNegations}
            icon={<BarChart />}
            color="var(--color-warning)"
          />
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <StatCard
            title="Процент отказов"
            value={`${data.negationsPercent}%`}
            icon={<TrendingDown />}
            color="var(--color-negative)"
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Частые причины отказов">
            <Bar
              data={data.mostFrequentNegations}
              xField="count"
              yField="phrase"
              seriesField="phrase"
              legend={false}
              height={300}
              color="var(--color-chart-4)"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Динамика отказов">
            <Line
              data={data.negationsTrend}
              xField="date"
              yField="count"
              height={300}
              color="var(--color-chart-1)"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
