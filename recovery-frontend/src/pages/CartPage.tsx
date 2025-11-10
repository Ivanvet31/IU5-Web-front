import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AppNavbar } from '../components/Navbar';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import './styles/CartPage.css';

export const CartPage = () => {
  const breadcrumbs = [
    { label: 'Заявка на восстановление', active: true }
  ];

  // Временно пустая корзина - позже будет заполняться через состояние
  const cartItems: any[] = [];

  return (
    <>
      <AppNavbar />
      <Container className="py-4 cart-page"> {/* Добавил класс для стилей */}
        <CustomBreadcrumbs crumbs={breadcrumbs} />
        
        <h1 className="mb-4">Заявка на восстановление</h1>

        {cartItems.length === 0 ? (
          <Card className="text-center p-5">
            <Card.Body>
              <h3 className="mb-4">Заявка пуста</h3>
              <p className="text-muted mb-4">
                Добавьте стратегии восстановления из каталога
              </p>
              {/* --- ИСПРАВЛЕНИЕ ЗДЕСЬ --- */}
              <Link to="/strategies">
                <Button variant="primary">
                  Перейти к стратегиям
                </Button>
              </Link>
              {/* --- КОНЕЦ ИСПРАВЛЕНИЯ --- */}
            </Card.Body>
          </Card>
        ) : (
          <>
            <Card className="mb-4">
              <Card.Body>
                <h4 className="mb-3">Параметры заявки</h4>
                <Row>
                  <Col md={6} className="mb-3">
                    <label className="form-label text-muted">
                      Уровень квалификации IT-специалистов:
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Начинающий, средний, эксперт"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <label className="form-label text-muted">
                      Средняя пропускная способность канала:
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="В Мбит/с"
                    />
                  </Col>
                  <Col md={12} className="mb-3">
                    <label className="form-label text-muted">
                      Качество документации по инфраструктуре:
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Отличная, хорошая, удовлетворительная"
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <h3 className="mb-3">Выбранные стратегии</h3>
            
            {/* Здесь будет список выбранных стратегий */}
            
            <Card className="total-time-card mt-4">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0 text-white">Общее время восстановления:</h4>
                <input 
                  type="text" 
                  className="form-control total-time-input" 
                  value="0 часов" 
                  disabled
                />
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary">
                Удалить заявку
              </Button>
              <Button variant="primary">
                Сохранить заявку
              </Button>
            </div>
          </>
        )}
      </Container>
    </>
  );
};