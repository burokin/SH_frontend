import { useEffect, useState } from 'react';
import { getQualityData } from '../../../shared/api';
import { Card, Row, Col, Spin, Typography, List, Avatar } from 'antd';
import { ThumbsUp, ThumbsDown, Award, UserCheck, UserX } from 'lucide-react';
import { Pie } from '@ant-design/plots';
import '../dashboard.scss';

const { Title, Text } = Typography;
type QualityData = Awaited<ReturnType<typeof getQualityData>>;

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

interface StaffListProps {
  title: string;
  data: QualityData['bestStaffers'] | QualityData['worstStaffers'];
  icon: React.ReactNode;
  color: string;
}

const StaffList: React.FC<StaffListProps> = ({ title, data, icon, color }) => (
  <Card title={title}>
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                style={{ backgroundColor: color, verticalAlign: 'middle' }}
              >
                {icon}
              </Avatar>
            }
            title={<Text strong>{item.name}</Text>}
            description={`Среднее соответствие: ${item.averageCompliance}`}
          />
        </List.Item>
      )}
    />
  </Card>
);

export const QualityDashboard = () => {
  const [data, setData] = useState<QualityData | null>(null);

  useEffect(() => {
    getQualityData().then(setData);
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

  const chartColors = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
  ];

  return (
    <div className="dashboard-page">
      <Title level={2} className="dashboard-title">
        Качество обработки звонков
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Средний балл"
            value={data.averageScriptCompliance}
            icon={<Award />}
            color="var(--color-warning)"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Полное соответствие"
            value={`${data.fullCompliancePercent}%`}
            icon={<ThumbsUp />}
            color="var(--color-positive)"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Нарушения"
            value={`${data.noCompliancePercent}%`}
            icon={<ThumbsDown />}
            color="var(--color-negative)"
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Частые ошибки по скрипту">
            <Pie
              data={data.mostFrequentErrors}
              angleField="count"
              colorField="scriptPoint"
              height={300}
              color={chartColors}
              legend={{ layout: 'horizontal', position: 'bottom' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <StaffList
                title="Лучшие сотрудники"
                data={data.bestStaffers}
                icon={<UserCheck />}
                color="var(--color-positive)"
              />
            </Col>
            <Col span={24}>
              <StaffList
                title="Худшие сотрудники"
                data={data.worstStaffers}
                icon={<UserX />}
                color="var(--color-negative)"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
