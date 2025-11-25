import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchUserProfile } from './store/slices/userSlice';

// Импорт страниц
import { HomePage } from './pages/HomePage';
import { StrategiesListPage } from './pages/StrategiesListPage';
import { StrategyDetailPage } from './pages/StrategyDetailPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { RequestsListPage } from './pages/RequestsListPage';

// Получаем базовый URL из переменных окружения Vite (для деплоя на GitHub Pages)
const appBaseName = import.meta.env.BASE_URL;

function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);

  // Восстановление сессии: если есть токен, но (возможно) нет данных юзера - пытаемся их обновить
  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [token, dispatch]);

  return (
    <BrowserRouter basename={appBaseName}>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<HomePage />} />
        <Route path="/strategies" element={<StrategiesListPage />} />
        <Route path="/strategies/:id" element={<StrategyDetailPage />} />
        
        {/* Маршруты авторизации */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Защищенные маршруты (в идеале обернуть в PrivateRoute, но пока так) */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/requests" element={<RequestsListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;