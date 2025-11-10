// src/App.tsx (Правильный, универсальный вариант)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { StrategiesListPage } from './pages/StrategiesListPage';
import { StrategyDetailPage } from './pages/StrategyDetailPage';
import { CartPage } from './pages/CartPage';

// Получаем базовый URL из переменных окружения Vite.
// Для `npm run dev` это будет '/', для `npm run build` - '/IU5-Web-front/'
const appBaseName = import.meta.env.BASE_URL;

function App() {
  return (
    // Используем переменную в качестве basename
    <BrowserRouter basename={appBaseName}>
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