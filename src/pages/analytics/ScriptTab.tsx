import React from 'react';
import { Row, Col } from 'antd';
import { Column, Pie } from '@ant-design/plots';
import { AlertTriangle, Star, FileText } from 'lucide-react';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';

// Тип для данных ошибок сотрудника
interface StaffErrorDatum {
  staffer: string;
  errorType: string;
  count: number;
}

// Данные по ошибкам с использованием errorType как строки
const staffErrorData: StaffErrorDatum[] = [
  { staffer: 'Иванов', errorType: 'Не уточнил адрес', count: 4 },
  { staffer: 'Иванов', errorType: 'Не попрощался', count: 2 },
  { staffer: 'Иванов', errorType: 'Не представился', count: 1 },
  { staffer: 'Петрова', errorType: 'Не уточнил адрес', count: 3 },
  { staffer: 'Петрова', errorType: 'Не попрощался', count: 2 },
  { staffer: 'Петрова', errorType: 'Не уточнил тему', count: 1 },
  { staffer: 'Сидоров', errorType: 'Не уточнил имя', count: 2 },
  { staffer: 'Сидоров', errorType: 'Не уточнил адрес', count: 1 },
  { staffer: 'Смирнова', errorType: 'Не попрощался', count: 2 },
  { staffer: 'Смирнова', errorType: 'Не уточнил тему', count: 1 },
];

// 4. Для графика нужен seriesField: errorType, для подписей — errorTypeLabels

// Для списка ошибок и topErrors тоже используем строки
const topErrors = [
  { errorType: 'Не уточнил адрес', count: 12 },
  { errorType: 'Не попрощался', count: 9 },
  { errorType: 'Не представился', count: 7 },
  { errorType: 'Не уточнил тему', count: 5 },
  { errorType: 'Не уточнил имя', count: 4 },
];

// Цвета для ошибок (можно расширить)
const errorTypeColorMap: Record<string, string> = {
  'Не уточнил адрес': '#1677ff',
  'Не попрощался': '#faad14',
  'Не представился': '#52c41a',
  'Не уточнил тему': '#ff4d4f',
  'Не уточнил имя': '#722ed1',
};

const pieConfig = {
  data: topErrors,
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

const ScriptTab: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const config2 = {
    data: staffErrorData,
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
              <div className="analytics-stat-card-value">87%</div>
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
              <div className="analytics-stat-card-value">Смирнова 4.9</div>
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
              <div className="analytics-stat-card-value">12</div>
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
              Ошибки по инструкции
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
