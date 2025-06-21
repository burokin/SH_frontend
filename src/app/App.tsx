import { AppProviders } from './providers';
import { AppRouter } from './AppRouter';
import './App.scss';

export const App = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};
