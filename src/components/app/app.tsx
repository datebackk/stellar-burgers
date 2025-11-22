import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../app-routes';

const App = () => (
  <BrowserRouter>
    <div className={styles.app}>
      <AppHeader />
      <AppRoutes />
    </div>
  </BrowserRouter>
);

export default App;
