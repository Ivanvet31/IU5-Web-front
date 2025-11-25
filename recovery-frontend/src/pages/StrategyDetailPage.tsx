import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Spinner, Row, Col, Button, Card } from 'react-bootstrap';
import { AppNavbar } from '../components/Navbar';
import { api } from '../api'; // Используем api напрямую или через thunk
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import type { DsStrategyDTO } from '../api/Api';
import { DefaultImage } from '../components/StrategyCard';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addStrategyToDraft } from '../store/slices/cartSlice'; // Импорт экшена
import './styles/StrategyDetailPage.css';

export const StrategyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Получаем статус авторизации
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const [strategy, setStrategy] = useState<DsStrategyDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.strategies.strategiesDetail(parseInt(id))
        .then(res => setStrategy(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddToCart = () => {
      if (strategy?.id) {
          dispatch(addStrategyToDraft(strategy.id));
          navigate('/strategies'); // Или остаться на странице и показать алерт
      }
  };

  const displayImage = strategy?.image_url || DefaultImage;

  if (loading) {
    return (
      <>
        <AppNavbar />
        <Container className="py-5 text-center">
          <Spinner animation="border" role="status" variant="primary" />
        </Container>
      </>
    );
  }

  if (!strategy) {
    return (
      <>
        <AppNavbar />
        <Container className="py-5 text-center">
          <h2>Стратегия не найдена</h2>
          <Link to="/strategies">
            <Button variant="primary" className="mt-3">Вернуться к списку</Button>
          </Link>
        </Container>
      </>
    );
  }

  const breadcrumbs = [
    { label: 'Стратегии восстановления', path: '/strategies' },
    { label: strategy.title || 'Детали', active: true },
  ];

  return (
    <>
      <AppNavbar />
      <Container className="py-4">
        <CustomBreadcrumbs crumbs={breadcrumbs} />

        <Row className="mb-4">
          <Col>
            <h1 className="strategy-detail-title">{strategy.title}</h1>
          </Col>
        </Row>

        <Row>
          <Col lg={5} className="mb-4">
            <Card className="shadow-sm">
              <Card.Img 
                variant="top" 
                src={displayImage} 
                alt={strategy.title}
                className="strategy-detail-image"
                onError={(e) => { (e.target as HTMLImageElement).src = DefaultImage; }}
              />
            </Card>
          </Col>
          
          <Col lg={7}>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <Card.Text className="strategy-description">
                  {strategy.description}
                </Card.Text>
                
                {/* ИЗМЕНЕНИЕ: Кнопка добавления только для авторизованных */}
                {isAuthenticated && (
                    <div className="mt-4">
                        <Button variant="primary" size="lg" onClick={handleAddToCart}>
                            Добавить в заявку
                        </Button>
                    </div>
                )}

              </Card.Body>
            </Card>

            <Card className="shadow-sm mb-3">
              <Card.Body>
                <Card.Title>Параметры стратегии</Card.Title>
                <Row className="mt-3">
                  <Col sm={6} className="mb-3">
                    <div className="param-box">
                      <small className="text-muted">Базовое время восстановления</small>
                      <div className="param-value">
                        {strategy.base_recovery_hours} часов
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="d-flex gap-2">
              <Link to="/strategies">
                <Button variant="outline-secondary">
                  Вернуться к списку
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};