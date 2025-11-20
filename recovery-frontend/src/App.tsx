import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { StrategiesListPage } from './pages/StrategiesListPage';
import { StrategyDetailPage } from './pages/StrategyDetailPage';
import { CartPage } from './pages/CartPage';

function App() {
  return (
    // Явно указываем корень, чтобы избежать ошибок с путями в Tauri
    <BrowserRouter basename="/">
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