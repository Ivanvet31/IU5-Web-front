import { Container, Button } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/Navbar';

export const Error404 = () => {
    const navigate = useNavigate();

    return (
        <>
            <AppNavbar />
            <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <Search size={80} className="text-muted mb-4" />
                <h1 className="fw-bold mb-3">404</h1>
                <h3 className="text-muted mb-4">Страница не найдена</h3>
                <p className="text-center mb-4" style={{ maxWidth: '400px' }}>
                    Похоже, вы перешли по неверной ссылке или страница была удалена.
                </p>
                <Button variant="primary" onClick={() => navigate('/')}>На главную</Button>
            </Container>
        </>
    );
};