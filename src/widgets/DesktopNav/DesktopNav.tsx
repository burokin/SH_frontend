import { Menu } from 'antd';
import { Phone } from 'lucide-react';
import { BarChartOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Path } from '../../app/paths';

const items = [
  {
    key: Path.ANALYTICS,
    icon: (
      <BarChartOutlined style={{ fontSize: 20, minWidth: 20, minHeight: 20 }} />
    ),
    label: 'Аналитика',
  },
  {
    key: Path.CALLS,
    icon: <Phone size={20} style={{ minWidth: 20, minHeight: 20 }} />,
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
      className="desktop-nav-menu"
    />
  );
};
