import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { HashRouter } from 'react-router-dom';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    <HashRouter>{children}</HashRouter>
  </Provider>
);
