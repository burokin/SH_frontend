import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Progress,
  Avatar,
  Collapse,
  Space,
  Divider,
} from 'antd';
import { User, Bot, ThumbsDown, Building, Calendar, Clock } from 'lucide-react';
import type { Call } from './types';
import './CallsPage.scss';

const { Text, Title } = Typography;

const StatItem = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  color?: string;
}) => (
  <Col span={12}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
      <Avatar
        size="small"
        style={{ backgroundColor: 'transparent', marginRight: '8px' }}
      >
        {icon}
      </Avatar>
      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
          {label}
        </Text>
        <Text strong style={{ color }}>
          {value}
        </Text>
      </div>
    </div>
  </Col>
);

interface CallCardProps {
  call: Call;
}

export const CallCard = ({ call }: CallCardProps) => {
  const compliancePercent = Math.round((call.scriptCompliance / 11) * 100);

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
  };
  const formattedDate = new Date(call.date).toLocaleDateString(
    'ru-RU',
    dateOptions
  );
  const formattedTime = call.time.substring(0, 5);

  return (
    <Card className="call-card-modern">
      <Row justify="space-between" align="top" style={{ marginBottom: '16px' }}>
        <Col>
          <Space align="center" size="large">
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {call.address}
              </Title>
            </div>
          </Space>
        </Col>
        <Col>
          <Tag color="purple">{call.topic}</Tag>
        </Col>
      </Row>

      <Row justify="space-between" align="middle">
        <Col>
          <Space>
            <User size={16} />
            <Text strong>{call.staffer.name}</Text>
            <Text type="secondary">({call.staffer.role})</Text>
          </Space>
        </Col>
        <Col>
          <Space>
            <Calendar size={14} />
            <Text type="secondary">{formattedDate},</Text>
            <Clock size={14} />
            <Text type="secondary">{formattedTime}</Text>
          </Space>
        </Col>
      </Row>

      <Divider style={{ margin: '16px 0' }} />

      <Row gutter={[16, 16]} align="middle">
        <Col span={24}>
          <div>
            <Text strong>Соблюдение скрипта</Text>
            <Progress
              percent={compliancePercent}
              strokeColor={
                compliancePercent > 80
                  ? 'var(--color-positive)'
                  : 'var(--color-negative)'
              }
            />
          </div>
        </Col>

        <Col span={24}>
          <audio
            controls
            src={call.audioUrl}
            style={{ width: '100%', marginTop: '8px' }}
          >
            Your browser does not support the audio element.
          </audio>
        </Col>
      </Row>

      <Divider style={{ margin: '12px 0' }} />

      <Collapse ghost expandIconPosition="end">
        <Collapse.Panel header={<Text strong>Детали звонка</Text>} key="1">
          <Row gutter={[16, 8]}>
            <StatItem
              icon={<Bot size={18} color="var(--color-chart-2" />}
              label="Ошибки в скрипте"
              value={
                call.scriptErrors.length > 0 ? (
                  <Space wrap>
                    {call.scriptErrors.map((e, i) => (
                      <Tag color="error" key={i}>
                        {e}
                      </Tag>
                    ))}
                  </Space>
                ) : (
                  'Нет'
                )
              }
            />
            <StatItem
              icon={<ThumbsDown size={18} color="var(--color-negative)" />}
              label="Кол-во отрицаний"
              value={call.negations.length}
              color="var(--color-negative)"
            />
          </Row>
        </Collapse.Panel>
      </Collapse>
    </Card>
  );
};
