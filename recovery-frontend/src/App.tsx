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
import { RequestDetailPage } from './pages/RequestDetailPage'; // <--- ИМПОРТ

const appBaseName = import.meta.env.BASE_URL;

function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [token, dispatch]);

  return (
    <BrowserRouter basename={appBaseName}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/strategies" element={<StrategiesListPage />} />
        <Route path="/strategies/:id" element={<StrategyDetailPage />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Защищенные маршруты */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Список заявок */}
        <Route path="/requests" element={<RequestsListPage />} />
        
        {/* Детальная страница заявки (НОВЫЙ РОУТ) */}
        <Route path="/requests/:id" element={<RequestDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;