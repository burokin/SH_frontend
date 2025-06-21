import { TabBar } from 'antd-mobile';
import { AreaChart, BarChart, Users, PieChart, Phone } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Path } from '../../app/paths';

const tabs = [
  {
    key: Path.FUNNEL,
    title: 'Воронка',
    icon: <AreaChart />,
  },
  {
    key: Path.QUALITY,
    title: 'Качество',
    icon: <PieChart />,
  },
  {
    key: Path.NEGATIONS,
    title: 'Отказы',
    icon: <BarChart />,
  },
  {
    key: Path.ANALYTICS,
    title: 'Аналитика',
    icon: <Users />,
  },
  {
    key: Path.CALLS,
    title: 'Звонки',
    icon: <Phone />,
  },
];

export const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const setRouteActive = (value: string) => {
    navigate(value);
  };

  return (
    <TabBar
      activeKey={location.pathname}
      onChange={(value) => setRouteActive(value)}
    >
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
};
