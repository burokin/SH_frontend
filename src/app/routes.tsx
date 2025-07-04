import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Layout from '../shared/layout';
import { Path } from './paths';
import { CallsPage } from '../pages/calls/CallsPage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';

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
          { index: true, element: <Navigate to={Path.CALLS} replace /> },
          { path: Path.CALLS, element: <CallsPage /> },
          { path: Path.ANALYTICS, element: <AnalyticsPage /> },
        ],
  },
];
