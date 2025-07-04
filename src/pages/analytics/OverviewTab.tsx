import React from 'react';
import { Row, Col } from 'antd';

import { Column, Pie } from '@ant-design/plots';
import { Phone, PhoneOff, AlertTriangle, FileWarning } from 'lucide-react';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import AnalyticsStatCard from './AnalyticsStatCard';

const pieData = [
  { type: 'Доставка', value: 40 },
  { type: 'Бронь', value: 25 },
  { type: 'Жалоба', value: 15 },
  { type: 'Прочее', value: 20 },
];

// Цвета для тем звонков и динамики
const callTypeColorMap: Record<string, string> = {
  Доставка: '#1677ff',
  Бронь: '#faad14',
  Самовывоз: '#52c41a',
  Пропущено: '#ff4d4f',
  Всего: '#bfbfbf',
  Жалоба: '#722ed1',
  Прочее: '#8c8c8c',
};

const pieConfig = {
  data: pieData,
  angleField: 'value',
  colorField: 'type',
  color: ({ type }: { type: string }) => callTypeColorMap[type] || '#bfbfbf',
  label: {
    text: 'value',
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

// Данные для динамики звонков на 31 день
const callsDynamicData = Array.from({ length: 31 * 4 }, (_, i) => {
  const day = Math.floor(i / 4) + 1;
  const date = day.toString().padStart(2, '0') + '.06';
  const typeIndex = i % 4;
  const types = ['Всего', 'Пропущено', 'Самовывоз', 'Бронь'];
  // Генерируем правдоподобные значения
  let value = 0;
  if (types[typeIndex] === 'Всего') value = 18 + Math.floor(Math.random() * 8); // 18–25
  if (types[typeIndex] === 'Пропущено')
    value = 1 + Math.floor(Math.random() * 4); // 1–4
  if (types[typeIndex] === 'Самовывоз')
    value = 3 + Math.floor(Math.random() * 5); // 3–7
  if (types[typeIndex] === 'Бронь') value = 2 + Math.floor(Math.random() * 4); // 2–5
  return { date, type: types[typeIndex], value };
});

const columnConfig = {
  data: callsDynamicData,
  xField: 'date',
  yField: 'value',
  colorField: 'type',
  color: ({ type }: { type: string }) => callTypeColorMap[type] || '#bfbfbf',
  stack: true,
};

const OverviewTab: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <div>
      <Row
        gutter={[isMobile ? 8 : 24, isMobile ? 8 : 24]}
        style={{ marginBottom: isMobile ? 8 : 32 }}
      >
        <Col xs={24} md={6}>
          <AnalyticsStatCard
            label="Всего звонков"
            value={123}
            icon={<Phone size={24} color="#1677ff" />}
            iconBg="#e6f7ff"
          />
        </Col>
        <Col xs={24} md={6}>
          <AnalyticsStatCard
            label="Пропущенных звонков"
            value={5}
            icon={<PhoneOff size={24} color="#ff4d4f" />}
            iconBg="#fff1f0"
          />
        </Col>
        <Col xs={24} md={6}>
          <AnalyticsStatCard
            label="Звонков с отрицанием"
            value={12}
            icon={<AlertTriangle size={24} color="#faad14" />}
            iconBg="#fffbe6"
          />
        </Col>
        <Col xs={24} md={6}>
          <AnalyticsStatCard
            label="Звонков с нарушением инструкции"
            value={8}
            icon={<FileWarning size={24} color="#722ed1" />}
            iconBg="#f9f0ff"
          />
        </Col>
      </Row>
      <Row gutter={[isMobile ? 8 : 24, isMobile ? 8 : 24]}>
        <Col xs={24} md={7}>
          <div
            className="analytics-card analytics-chart-block"
            style={{ marginBottom: isMobile ? 10 : 24 }}
          >
            <div
              className="analytics-section-title"
              style={{ marginBottom: 8 }}
            >
              Темы звонков
            </div>
            <Pie {...pieConfig} />
          </div>
        </Col>
        <Col xs={24} md={17}>
          <div
            className="analytics-card analytics-chart-block"
            style={{ marginBottom: isMobile ? 10 : 24 }}
          >
            <div
              className="analytics-section-title"
              style={{ marginBottom: 8 }}
            >
              Динамика звонков
            </div>
            <Column {...columnConfig} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default OverviewTab;
