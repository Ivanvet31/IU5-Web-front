import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Form, Button } from 'react-bootstrap';
import { StrategyCard } from '../components/StrategyCard';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import { getStrategies } from '../api/strategiesApi';
import type { IStrategy } from '../types';
import './styles/StrategiesListPage.css';

export const StrategiesListPage = () => {
  const [strategies, setStrategies] = useState<IStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStrategies = (filterTitle: string) => {
    setLoading(true);
    getStrategies(filterTitle)
      .then(data => {
        if (Array.isArray(data.items)) {
          setStrategies(data.items);
        } else {
          console.error("Получены неверные данные:", data);
          setStrategies([]);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStrategies('');
  }, []);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchStrategies(searchTerm);
  };

  const breadcrumbs = [
    { label: 'Стратегии восстановления', active: true }
  ];

  return (
    <Container className="py-4">
      <CustomBreadcrumbs crumbs={breadcrumbs} />
      
      <h1 className="mb-4">Стратегии восстановления после сбоя</h1>
      
      <hr className="mb-4" />
      
      <Form onSubmit={handleSearchSubmit} className="mb-4">
        <Row>
          <Col md={10}>
            <Form.Control
              type="search"
              placeholder="Введите название стратегии для поиска..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </Col>
          <Col md={2}>
            <Button 
              type="submit" 
              variant="primary" 
              className="w-100"
            >
              Поиск
            </Button>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
        </div>
      ) : (
        <div className="strategies-list">
          {strategies.length > 0 ? (
            strategies.map(strategy => (
              <StrategyCard key={strategy.id} strategy={strategy} />
            ))
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">Стратегии не найдены</p>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};
