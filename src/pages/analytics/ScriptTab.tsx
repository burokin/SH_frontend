import React, { useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { Column, Pie } from '@ant-design/plots';
import { AlertTriangle, Star, FileText } from 'lucide-react';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import { getAnalyticsScript } from '../../shared/api';

// Тип для данных ошибок сотрудника
interface StaffErrorDatum {
  staffer: string;
  errorType: string;
  count: number;
}

interface ScriptTabProps {
  filters: {
    dateRange: [string | null, string | null];
    restaurant?: string;
  };
}

// Цвета для ошибок (можно расширить)
const errorTypeColorMap: Record<string, string> = {
  'Не уточнил адрес': '#1677ff',
  'Не попрощался': '#faad14',
  'Не представился': '#52c41a',
  'Не уточнил тему': '#ff4d4f',
  'Не уточнил имя': '#722ed1',
};

const ScriptTab: React.FC<ScriptTabProps> = ({ filters }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    avgCompliance: number;
    bestStaffer: string;
    scriptErrors: number;
    topErrors: { errorType: string; count: number }[];
    staffErrorData: StaffErrorDatum[];
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    getAnalyticsScript({
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
    data: data.topErrors,
    angleField: 'count',
    colorField: 'errorType',
    color: ({ errorType }: { errorType: string }) =>
      errorTypeColorMap[errorType] || '#bfbfbf',
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

  const config2 = {
    data: data.staffErrorData,
    xField: 'staffer',
    yField: 'count',
    colorField: 'errorType',
    stack: true,
  };

  return (
    <div>
      {/* Stat cards: всегда в одну строку на desktop, в столбик на mobile */}
      <Row
        gutter={[isMobile ? 8 : 24, isMobile ? 8 : 24]}
        style={{ marginBottom: isMobile ? 8 : 32 }}
      >
        <Col xs={24} md={8}>
          <div className="analytics-stat-card">
            <div className="analytics-stat-card-content">
              <div className="analytics-stat-card-label">
                Средний % соответствия
              </div>
              <div className="analytics-stat-card-value">
                {data.avgCompliance}%
              </div>
            </div>
            <div
              className="analytics-stat-card-icon"
              style={{ background: '#e6f7ff' }}
            >
              <FileText size={24} color="#1677ff" />
            </div>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="analytics-stat-card">
            <div className="analytics-stat-card-content">
              <div className="analytics-stat-card-label">Лучший сотрудник</div>
              <div className="analytics-stat-card-value">
                {data.bestStaffer}
              </div>
            </div>
            <div
              className="analytics-stat-card-icon"
              style={{ background: '#fffbe6' }}
            >
              <Star size={24} color="#faad14" />
            </div>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="analytics-stat-card">
            <div className="analytics-stat-card-content">
              <div className="analytics-stat-card-label">
                Ошибок по инструкции
              </div>
              <div className="analytics-stat-card-value">
                {data.scriptErrors}
              </div>
            </div>
            <div
              className="analytics-stat-card-icon"
              style={{ background: '#fff1f0' }}
            >
              <AlertTriangle size={24} color="#ff4d4f" />
            </div>
          </div>
        </Col>
      </Row>
      {/* Два смысловых блока в две колонки на desktop, в столбик на mobile */}
      <Row
        gutter={[isMobile ? 8 : 24, isMobile ? 8 : 24]}
        style={{ marginBottom: isMobile ? 8 : 32 }}
      >
        <Col xs={24} md={7}>
          <div
            className="analytics-card analytics-chart-block"
            style={{ marginBottom: isMobile ? 10 : 0 }}
          >
            <div
              className="analytics-section-title"
              style={{ marginBottom: 8 }}
            >
              Топ ошибок по инструкции
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
              Нарушения по сотрудникам
            </div>
            <Column {...config2} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ScriptTab;
