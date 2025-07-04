import React from 'react';
import { Row, Col, Empty } from 'antd';
import { FileText, BarChart2, Download } from 'lucide-react';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';

const reportStats = [
  {
    label: 'Доступно отчётов',
    value: 8,
    icon: <FileText size={24} color="#1677ff" />,
    bg: '#e6f7ff',
  },
  {
    label: 'Графиков',
    value: 5,
    icon: <BarChart2 size={24} color="#52c41a" />,
    bg: '#f6ffed',
  },
  {
    label: 'Выгружено',
    value: 12,
    icon: <Download size={24} color="#faad14" />,
    bg: '#fffbe6',
  },
];

const reportsList = [
  {
    name: 'Отчёт по звонкам',
    date: '12.06.2024',
    icon: <FileText size={18} color="#1677ff" />,
  },
  {
    name: 'Аналитика скрипта',
    date: '10.06.2024',
    icon: <BarChart2 size={18} color="#52c41a" />,
  },
  {
    name: 'Отчёт по отказам',
    date: '08.06.2024',
    icon: <FileText size={18} color="#ff4d4f" />,
  },
];

const ReportsTab: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <div
      style={{
        minHeight: 240,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Empty
        description={
          <span style={{ fontSize: 18 }}>Раздел находится в разработке</span>
        }
      />
    </div>
  );
};

export default ReportsTab;
