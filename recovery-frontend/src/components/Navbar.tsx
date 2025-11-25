import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/userSlice';
import { BoxArrowRight, PersonCircle } from 'react-bootstrap-icons';
import './styles/Navbar.css';

export const AppNavbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => navigate('/login'));
  };

  return (
    <Navbar bg="white" expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="logo">
          REcovery<span className="logo--accent">Time</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/strategies" className="nav-link-custom">
              Стратегии восстановления
            </Nav.Link>
          </Nav>

          <Nav className="align-items-center gap-3">
            {isAuthenticated ? (
                <>
                    <Nav.Link as={Link} to="/requests" className="nav-link-custom fw-medium">
                        Мои заявки
                    </Nav.Link>

                    {/* Кнопка "Текущая заявка" УДАЛЕНА ОТСЮДА */}

                    <Link 
                        to="/profile" 
                        className="text-decoration-none text-dark fw-bold d-flex align-items-center gap-2"
                        title="Личный кабинет"
                    >
                         <PersonCircle size={24} className="text-secondary"/>
                         <span>{user?.username}</span>
                    </Link>

                    <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={handleLogout}
                        className="d-flex align-items-center gap-2"
                        title="Выйти"
                    >
                        <BoxArrowRight /> Выход
                    </Button>
                </>
            ) : (
                <>
                    <Nav.Link as={Link} to="/login" className="nav-link-custom">
                        Вход
                    </Nav.Link>
                    <Link to="/register">
                        <Button variant="primary" size="sm">
                            Регистрация
                        </Button>
                    </Link>
                </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};