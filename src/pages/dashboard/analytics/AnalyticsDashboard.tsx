import { useEffect, useState } from 'react';
import { getRestaurantStafferAnalyticsData } from '../../../shared/api';
import { Card, Row, Col, Table, List, Typography, Spin, Avatar } from 'antd';
import { Bar } from '@ant-design/plots';
import { useMediaQuery } from '../../../shared/hooks/useMediaQuery';
import { UserCheck, UserX } from 'lucide-react';
import '../dashboard.scss';

const { Title, Text } = Typography;

type AnalyticsData = Awaited<
  ReturnType<typeof getRestaurantStafferAnalyticsData>
>;

const RestaurantCard = ({
  restaurant,
}: {
  restaurant: AnalyticsData['restaurants'][0];
}) => (
  <Card title={restaurant.name} style={{ marginBottom: 16 }}>
    <Row gutter={[16, 8]}>
      <Col span={12}>
        <Text strong>Конверсия:</Text>
      </Col>
      <Col span={12}>
        <Text style={{ color: 'var(--color-positive)' }}>
          {restaurant.conversionPercent}%
        </Text>
      </Col>

      <Col span={12}>
        <Text strong>Соответствие скрипту:</Text>
      </Col>
      <Col span={12}>
        <Text>{restaurant.averageCompliance}</Text>
      </Col>

      <Col span={12}>
        <Text strong>Всего звонков:</Text>
      </Col>
      <Col span={12}>
        <Text>{restaurant.callsCount}</Text>
      </Col>

      <Col span={12}>
        <Text strong>Бронирований:</Text>
      </Col>
      <Col span={12}>
        <Text>{restaurant.bookings}</Text>
      </Col>

      <Col span={12}>
        <Text strong>Отказов:</Text>
      </Col>
      <Col span={12}>
        <Text style={{ color: 'var(--color-negative)' }}>
          {restaurant.negations}
        </Text>
      </Col>
    </Row>
  </Card>
);

interface StaffListProps {
  title: string;
  data: AnalyticsData['topStaffers'] | AnalyticsData['bottomStaffers'];
  icon: React.ReactNode;
  color: string;
}

const StaffList: React.FC<StaffListProps> = ({ title, data, icon, color }) => (
  <Card title={title}>
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item: { name: string; conversionPercent: number }) => (
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
            description={`Конверсия: ${item.conversionPercent}%`}
          />
        </List.Item>
      )}
    />
  </Card>
);

export const AnalyticsDashboard = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    getRestaurantStafferAnalyticsData().then(setData);
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

  const restaurantColumns = [
    { title: 'Ресторан', dataIndex: 'name', key: 'name' },
    {
      title: 'Соответствие',
      dataIndex: 'averageCompliance',
      key: 'averageCompliance',
    },
    { title: 'Звонки', dataIndex: 'callsCount', key: 'callsCount' },
    { title: 'Брони', dataIndex: 'bookings', key: 'bookings' },
    { title: 'Отказы', dataIndex: 'negations', key: 'negations' },
    {
      title: 'Конверсия (%)',
      dataIndex: 'conversionPercent',
      key: 'conversionPercent',
    },
  ];

  const chartColors = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
  ];

  return (
    <div className="dashboard-page">
      <Title level={2} className="dashboard-title">
        Аналитика по ресторанам и сотрудникам
      </Title>

      <Card title="Сравнение ресторанов по конверсии">
        <Bar
          data={data.restaurants}
          xField="conversionPercent"
          yField="name"
          seriesField="name"
          legend={false}
          height={300}
          color={chartColors}
        />
      </Card>

      <Title level={3} style={{ marginTop: 24, marginBottom: 16 }}>
        Детальная статистика по ресторанам
      </Title>
      {isMobile ? (
        <div>
          {data.restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      ) : (
        <Table
          dataSource={data.restaurants}
          columns={restaurantColumns}
          pagination={false}
          rowKey="id"
          bordered
        />
      )}

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <StaffList
            title="Топ сотрудники по конверсии"
            data={data.topStaffers}
            icon={<UserCheck />}
            color="var(--color-positive)"
          />
        </Col>
        <Col xs={24} lg={12}>
          <StaffList
            title="Худшие сотрудники по конверсии"
            data={data.bottomStaffers}
            icon={<UserX />}
            color="var(--color-negative)"
          />
        </Col>
      </Row>
    </div>
  );
};
