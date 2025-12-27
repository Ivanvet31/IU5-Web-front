import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchUserProfile } from './store/slices/userSlice';

// Импорт существующих страниц
import { HomePage } from './pages/HomePage';
import { StrategiesListPage } from './pages/StrategiesListPage';
import { StrategyDetailPage } from './pages/StrategyDetailPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { RequestsListPage } from './pages/RequestsListPage';
import { RequestDetailPage } from './pages/RequestDetailPage';

// Импорт НОВЫХ страниц
import { AdminStrategiesPage } from './pages/AdminStrategiesPage';
import { Error403 } from './pages/Error403';
import { Error404 } from './pages/Error404';

const appBaseName = import.meta.env.BASE_URL;

function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);

  // Восстановление сессии
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

        {/* Защищенные маршруты пользователя */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/requests" element={<RequestsListPage />} />
        <Route path="/requests/:id" element={<RequestDetailPage />} />

        {/* Администрирование (для Инженера) */}
        <Route path="/admin/strategies" element={<AdminStrategiesPage />} />

        {/* Страницы ошибок */}
        <Route path="/403" element={<Error403 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;