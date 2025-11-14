import AppRoutes from './routes/appRoute';
import { BrowserRouter } from 'react-router';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;