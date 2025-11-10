import { useEffect } from 'react';
import { Container, Row, Col, Spinner, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Cart3 } from 'react-bootstrap-icons';
import { AppNavbar } from '../components/Navbar';
import { StrategyCard } from '../components/StrategyCard';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchStrategies, setSearchQuery } from '../store/slices/strategiesSlice';
import './styles/StrategiesListPage.css';

export const StrategiesListPage = () => {
  const dispatch = useAppDispatch();
  const { items: strategies, loading, searchQuery } = useAppSelector((state) => state.strategies);

  useEffect(() => {
    dispatch(fetchStrategies(searchQuery));
  }, [dispatch, searchQuery]);

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
          <Row className="align-items-center">
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
