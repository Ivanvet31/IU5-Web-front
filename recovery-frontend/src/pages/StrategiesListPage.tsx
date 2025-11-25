import { useEffect } from 'react';
import { Container, Row, Col, Spinner, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Cart3 } from 'react-bootstrap-icons';
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
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

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
        
        <h1 className="mb-4">Стратегии восстановления</h1>
        
        <Form onSubmit={handleSearchSubmit} className="mb-4">
          <Row className="align-items-center justify-content-center"> {/* Добавил justify-content-center */}
            <Col md={8}>
              <Form.Control
                type="search"
                placeholder="Поиск"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
            </Col>
            <Col md={2}>
              <Button type="submit" variant="primary" className="w-100">
                Поиск
              </Button>
            </Col>

            {/* ИЗМЕНЕНИЕ: Рендерим колонку с корзиной ТОЛЬКО если авторизован */}
            {isAuthenticated && (
                <Col md={2} className="text-center">
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