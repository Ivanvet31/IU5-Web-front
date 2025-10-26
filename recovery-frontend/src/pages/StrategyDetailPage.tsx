import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Spinner, Row, Col, Button, Card } from 'react-bootstrap';
import { AppNavbar } from '../components/Navbar';
import { getStrategyById } from '../api/strategiesApi';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import type { IStrategy } from '../types';
import { DefaultImage } from '../components/StrategyCard';
import './styles/StrategyDetailPage.css';

export const StrategyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [strategy, setStrategy] = useState<IStrategy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getStrategyById(id)
        .then(data => setStrategy(data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const displayImage = strategy?.image_url || DefaultImage;

  if (loading) {
    return (
      <>
        <AppNavbar />
        <Container className="py-5 text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  if (!strategy) {
    return (
      <>
        <AppNavbar />
        <Container className="py-5">
          <h2>Стратегия не найдена</h2>
          <Button as={Link} to="/strategies" variant="primary" className="mt-3">
            Вернуться к списку
          </Button>
        </Container>
      </>
    );
  }

  const breadcrumbs = [
    { label: 'Стратегии восстановления', path: '/strategies' },
    { label: strategy.title, active: true },
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
              />
            </Card>
          </Col>
          
          <Col lg={7}>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <Card.Text className="strategy-description">
                  {strategy.description}
                </Card.Text>
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
                  <Col sm={6} className="mb-3">
                    <div className="param-box">
                      <small className="text-muted">Статус</small>
                      <div className="param-value">
                        <span className={`badge ${strategy.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                          {strategy.status === 'active' ? 'Активна' : 'Неактивна'}
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="d-flex gap-2">
              <Button as={Link} to="/strategies" variant="outline-secondary">
                Вернуться к списку
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
