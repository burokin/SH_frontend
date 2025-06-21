import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter } from 'react-router-dom';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    <BrowserRouter basename="/SH_frontend">{children}</BrowserRouter>
  </Provider>
);
