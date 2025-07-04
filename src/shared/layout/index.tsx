import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
import { DesktopNav } from '../../widgets/DesktopNav/DesktopNav';
import { MobileNav } from '../../widgets/MobileNav/MobileNav';
import { useMediaQuery } from '../hooks/useMediaQuery';
import './layout.scss';

const { Content: AntContent, Footer: AntFooter } = AntLayout;

const Layout: FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <AntLayout className="layout">
      {!isMobile && <DesktopNav />}
      {isMobile ? (
        <AntContent
          className={`layout-content-wrapper ${
            isMobile ? 'extra-mobile-style' : ''
          }`}
        >
          <Outlet />
        </AntContent>
      ) : (
        <AntContent className="layout-content-wrapper layout-content-with-nav">
          <div className="layout-content">
            <Outlet />
          </div>
        </AntContent>
      )}
      {isMobile && (
        <>
          <AntFooter className="layout-footer-mobile-nav-placeholder" />
          <AntFooter className="layout-footer-mobile">
            <MobileNav />
          </AntFooter>
        </>
      )}
    </AntLayout>
  );
};

export default Layout;
