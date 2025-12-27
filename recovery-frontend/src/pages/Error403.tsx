import { Container, Button } from 'react-bootstrap';
import { ShieldLock } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/Navbar';

export const Error403 = () => {
    const navigate = useNavigate();

    return (
        <>
            <AppNavbar />
            <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <ShieldLock size={80} className="text-danger mb-4" />
                <h1 className="fw-bold mb-3">403</h1>
                <h3 className="text-muted mb-4">Доступ запрещен</h3>
                <p className="text-center mb-4" style={{ maxWidth: '400px' }}>
                    У вас недостаточно прав для просмотра этой страницы. 
                    Эта страница доступна только Инженерам (модераторам).
                </p>
                <div className="d-flex gap-3">
                    <Button variant="outline-secondary" onClick={() => navigate(-1)}>Назад</Button>
                    <Button variant="primary" onClick={() => navigate('/')}>На главную</Button>
                </div>
            </Container>
        </>
    );
};