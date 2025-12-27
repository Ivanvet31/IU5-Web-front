import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Cart3, Gear } from 'react-bootstrap-icons';
import { AppNavbar } from '../components/Navbar';
import { StrategyCard } from '../components/StrategyCard';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchStrategies, setSearchQuery } from '../store/slices/strategiesSlice';
import { fetchCartBadge } from '../store/slices/cartSlice';
import './styles/StrategiesListPage.css';

export const StrategiesListPage = () => {
  const dispatch = useAppDispatch();
  const { items: strategies, loading, searchQuery } = useAppSelector((state) => state.strategies);
  
  const { count, requestId } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchStrategies(searchQuery));
    if (isAuthenticated) {
        dispatch(fetchCartBadge());
    }
  }, [dispatch, searchQuery, isAuthenticated]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(fetchStrategies(searchQuery));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const breadcrumbs = [
    { label: 'Стратегии восстановления', active: true }
  ];

  return (
    <>
      <AppNavbar />
      <Container className="py-4">
        <CustomBreadcrumbs crumbs={breadcrumbs} />
        
        {/* Заголовок по центру */}
        <h1 className="mb-4 text-center">Стратегии восстановления</h1>
        
        <Form onSubmit={handleSearchSubmit} className="mb-5">
          <Row className="align-items-center justify-content-center g-2">
            {/* Поле ввода занимает все свободное место */}
            <Col>
              <Form.Control
                type="search"
                placeholder="Введите название стратегии для поиска..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
            </Col>
            
            {/* Кнопка поиска */}
            <Col xs="auto">
              <Button type="submit" variant="primary" className="px-4">
                Искать
              </Button>
            </Col>

            {/* Кнопка управления (Только для модератора) */}
            {user?.is_moderator && (
                <Col xs="auto">
                    <Link to="/admin/strategies">
                        <Button variant="primary" className="d-flex align-items-center gap-2 px-3">
                            <Gear /> Управление
                        </Button>
                    </Link>
                </Col>
            )}

            {/* Иконка корзины (Только для авторизованных) */}
            {isAuthenticated && (
                <Col xs="auto" className="ps-2">
                    {requestId && count > 0 ? (
                        <Link to={`/cart`} className="cart-link-page">
                            <div className="calculator-link-page">
                                <Cart3 size={24} color="#333" />
                                <span className="calculator-badge">{count}</span>
                            </div>
                        </Link>
                    ) : (
                        <div className="calculator-link-page disabled" style={{opacity: 0.5, cursor: 'not-allowed'}}>
                            <Cart3 size={24} color="#999" />
                            <span className="calculator-badge" style={{backgroundColor: '#ccc'}}>0</span>
                        </div>
                    )}
                </Col>
            )}
          </Row>
        </Form>

        <hr className="mb-5" style={{ opacity: 0.1 }} />

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