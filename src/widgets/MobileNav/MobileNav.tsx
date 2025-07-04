import { TabBar } from 'antd-mobile';
import { Phone } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Path } from '../../app/paths';
import { BarChartOutlined } from '@ant-design/icons';

const tabs = [
  {
    key: Path.ANALYTICS,
    title: 'Аналитика',
    icon: <BarChartOutlined />,
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
