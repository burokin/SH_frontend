import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
import { DesktopNav } from '../../widgets/DesktopNav/DesktopNav';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useState } from 'react';
import { Drawer, Button } from 'antd';
import { Menu as MenuIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Path } from '../../app/paths';
import './layout.scss';

const { Content: AntContent } = AntLayout;

const Layout: FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [burgerOpen, setBurgerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { key: Path.ANALYTICS, label: 'Аналитика' },
    { key: Path.CALLS, label: 'Звонки' },
  ];

  return (
    <AntLayout className="layout">
      {!isMobile && <DesktopNav />}
      {isMobile && (
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: '#fff',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
            padding: '0 16px',
          }}
        >
          <Button
            type="text"
            icon={<MenuIcon size={28} />}
            onClick={() => setBurgerOpen(true)}
            style={{ marginRight: 12 }}
            aria-label="Открыть меню"
          />
          <span style={{ fontWeight: 600, fontSize: 18 }}>Меню</span>
        </div>
      )}
      <AntContent
        className={`layout-content-wrapper ${
          isMobile ? 'extra-mobile-style' : 'layout-content-with-nav'
        }`}
      >
        <div className={isMobile ? '' : 'layout-content'}>
          <Outlet />
        </div>
      </AntContent>
      {/* Drawer-меню для мобильной версии */}
      {isMobile && (
        <Drawer
          open={burgerOpen}
          onClose={() => setBurgerOpen(false)}
          placement="left"
          width={260}
          bodyStyle={{ padding: 0 }}
          headerStyle={{ borderBottom: '1px solid #f0f0f0' }}
        >
          <nav
            style={{ display: 'flex', flexDirection: 'column', padding: 16 }}
          >
            {navItems.map((item) => (
              <Button
                key={item.key}
                type={
                  location.pathname.startsWith(item.key) ? 'primary' : 'text'
                }
                block
                style={{ marginBottom: 12, textAlign: 'left' }}
                onClick={() => {
                  setBurgerOpen(false);
                  navigate(item.key);
                }}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </Drawer>
      )}
    </AntLayout>
  );
};

export default Layout;
