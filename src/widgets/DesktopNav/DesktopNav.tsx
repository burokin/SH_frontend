import { Menu } from 'antd';
import { AreaChart, BarChart, Users, PieChart, Phone } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Path } from '../../app/paths';

const items = [
  {
    key: Path.FUNNEL,
    icon: <AreaChart size={20} />,
    label: 'Воронка',
  },
  {
    key: Path.QUALITY,
    icon: <PieChart size={20} />,
    label: 'Качество',
  },
  {
    key: Path.NEGATIONS,
    icon: <BarChart size={20} />,
    label: 'Отказы',
  },
  {
    key: Path.ANALYTICS,
    icon: <Users size={20} />,
    label: 'Аналитика',
  },
  {
    key: Path.CALLS,
    icon: <Phone size={20} />,
    label: 'Звонки',
  },
];

export const DesktopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      items={items}
      theme="dark"
    />
  );
};
