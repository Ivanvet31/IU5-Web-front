import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { StrategiesListPage } from './pages/StrategiesListPage';
import { StrategyDetailPage } from './pages/StrategyDetailPage';

const MainLayout = () => (
  <>
    <AppNavbar />
    <Outlet />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<MainLayout />}>
          <Route path="/strategies" element={<StrategiesListPage />} />
          <Route path="/strategies/:id" element={<StrategyDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
