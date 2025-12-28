import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Cart3 } from 'react-bootstrap-icons';
import { AppNavbar } from '../components/Navbar';
import { StrategyCard } from '../components/StrategyCard';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';

import { getStrategies, getCartBadge } from '../api/strategiesApi';
import type { IStrategy, ICartBadge } from '../types';

import './styles/StrategiesListPage.css';

export const StrategiesListPage = () => {
  const [strategies, setStrategies] = useState<IStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartBadge, setCartBadge] = useState<ICartBadge>({ strategy_id: null, count: 0 });
    
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
    getCartBadge().then(cartData => {
    setCartBadge(cartData);
        });
  }, []);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchStrategies(searchTerm);
  };

  const breadcrumbs = [
    { label: 'Стратегии восстановления', active: true }
  ];

  return (
    <>
      <AppNavbar />
      <Container className="py-4">
        <CustomBreadcrumbs crumbs={breadcrumbs} />
        
        <h1 className="mb-4">Стратегии восстановления</h1>
        
        <Form onSubmit={handleSearchSubmit} className="mb-4">
          <Row className="align-items-center">
            <Col md={8}>
              <Form.Control
                type="search"
                placeholder="Поиск"
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
            <Col md={2} className="text-center">
              <Link to="/cart" className="cart-link-page">
                <div className="calculator-link-page">
                  <Cart3 size={24} color="#333" />
                  <span className="calculator-badge">0</span>
                </div>
              </Link>
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
            <Row>
              {strategies.length > 0 ? (
                strategies.map(strategy => (
                  <Col md={4} key={strategy.id} className="mb-4">
                    <StrategyCard strategy={strategy} />
                  </Col>
                ))
              ) : (
                <Col>
                  <div className="text-center py-5">
                    <p className="text-muted">Стратегии не найдены</p>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Container>
    </>
  );
};
