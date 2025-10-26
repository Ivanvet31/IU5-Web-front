import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { StrategiesListPage } from './pages/StrategiesListPage';
import { StrategyDetailPage } from './pages/StrategyDetailPage';
import { CartPage } from './pages/CartPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/strategies" element={<StrategiesListPage />} />
        <Route path="/strategies/:id" element={<StrategyDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
