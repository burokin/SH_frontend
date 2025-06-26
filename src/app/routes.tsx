import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { FunnelDashboard } from '../pages/dashboard/funnel/FunnelDashboard';
import { QualityDashboard } from '../pages/dashboard/quality/QualityDashboard';
import { NegationsDashboard } from '../pages/dashboard/negations/NegationsDashboard';
import { AnalyticsDashboard } from '../pages/dashboard/analytics/AnalyticsDashboard';
import Layout from '../shared/layout';
import { Path } from './paths';
import { CallsPage } from '../pages/calls/CallsPage';

// Если true — показывать только раздел звонков, все дашборды скрыты
export const SHOW_ONLY_CALLS = false;

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: SHOW_ONLY_CALLS
      ? [
          { index: true, element: <Navigate to={Path.CALLS} replace /> },
          { path: Path.CALLS, element: <CallsPage /> },
        ]
      : [
          { index: true, element: <Navigate to={Path.FUNNEL} replace /> },
          { path: Path.FUNNEL, element: <FunnelDashboard /> },
          { path: Path.QUALITY, element: <QualityDashboard /> },
          { path: Path.NEGATIONS, element: <NegationsDashboard /> },
          { path: Path.ANALYTICS, element: <AnalyticsDashboard /> },
          { path: Path.CALLS, element: <CallsPage /> },
        ],
  },
];
