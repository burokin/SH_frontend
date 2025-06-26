import { forwardRef } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Progress,
  Collapse,
  Space,
  Divider,
} from 'antd';
import { User, Calendar, Clock } from 'lucide-react';
import type { Call } from './types';
import './CallsPage.scss';
import { highlight } from './utils';

const { Text, Title } = Typography;

interface CallCardProps {
  call: Call;
  isMobile?: boolean;
  searchText?: string;
}

export const CallCard = forwardRef<HTMLDivElement, CallCardProps>(
  ({ call, isMobile, searchText }, ref) => {
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
      <div ref={ref}>
        <Card className="call-card-modern">
          <Row
            justify="space-between"
            align="top"
            style={{ marginBottom: '16px' }}
          >
            <Col>
              <Space align="center" size="large">
                <div>
                  <Title level={5} style={{ margin: 0 }}>
                    {call.address}
                  </Title>
                  {isMobile && (
                    <Text
                      type="secondary"
                      style={{ fontSize: 12, display: 'block' }}
                    >
                      № {highlight(call.callNumber, searchText || '')}
                    </Text>
                  )}
                </div>
              </Space>
            </Col>
            <Col>
              <Tag color="purple">{call.topic}</Tag>
            </Col>
          </Row>

          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={16} />
              <Text strong>{call.staffer.name}</Text>
              <Text type="secondary">({call.staffer.role})</Text>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 4,
              }}
            >
              <Calendar size={14} />
              <Text type="secondary">{formattedDate},</Text>
              <Clock size={14} />
              <Text type="secondary">{formattedTime}</Text>
            </div>
          </div>

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
              <div style={{ marginBottom: 12 }}>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>
                  Ошибки скрипта
                </Text>
                {call.scriptErrors.length > 0 ? (
                  <>
                    {call.scriptErrors.slice(0, 4).map((e, i) => (
                      <div key={i} style={{ marginBottom: 4 }}>
                        <Tag color={isMobile ? 'warning' : 'error'}>
                          {highlight(e, searchText || '')}
                        </Tag>
                      </div>
                    ))}
                    {call.scriptErrors.length > 4 && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        и ещё {call.scriptErrors.length - 4}
                      </Text>
                    )}
                  </>
                ) : (
                  <Text type="secondary">Нет</Text>
                )}
              </div>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>
                  Отрицания
                </Text>
                {call.negations.length > 0 ? (
                  <>
                    {call.negations.slice(0, 4).map((n, i) => (
                      <div key={i} style={{ marginBottom: 4 }}>
                        <Tag color={isMobile ? 'error' : 'warning'}>{n}</Tag>
                      </div>
                    ))}
                    {call.negations.length > 4 && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        и ещё {call.negations.length - 4}
                      </Text>
                    )}
                  </>
                ) : (
                  <Text type="secondary">Нет</Text>
                )}
              </div>
            </Collapse.Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
);
