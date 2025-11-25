import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/Navbar';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
    fetchRequestById, 
    updateRequestDetails, 
    submitRequest, 
    deleteRequest, 
    removeStrategyFromRequest, 
    resetOperationSuccess,
    updateRequestStrategy 
} from '../store/slices/requestSlice';
import { fetchCartBadge } from '../store/slices/cartSlice';
import { Trash } from 'react-bootstrap-icons';
import './styles/CartPage.css';

export const CartPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const draftId = useAppSelector((state) => state.cart.requestId);
    // Достаем error из стейта
    const { currentRequest, loading, operationSuccess, error } = useAppSelector((state) => state.requests);

    const [formData, setFormData] = useState({
        it_skill_level: '',
        network_bandwidth_mbps: 0,
        documentation_quality: ''
    });

    useEffect(() => {
        dispatch(fetchCartBadge());
    }, [dispatch]);

    useEffect(() => {
        if (draftId) {
            dispatch(fetchRequestById(draftId));
        }
    }, [draftId, dispatch]);

    useEffect(() => {
        if (currentRequest) {
            setFormData({
                it_skill_level: currentRequest.it_skill_level || '',
                network_bandwidth_mbps: currentRequest.network_bandwidth_mbps || 0,
                documentation_quality: currentRequest.documentation_quality || ''
            });
        }
    }, [currentRequest]);

    useEffect(() => {
        if (operationSuccess) {
            dispatch(resetOperationSuccess());
            dispatch(fetchCartBadge());
            navigate('/strategies');
            alert("Операция выполнена успешно!");
        }
    }, [operationSuccess, navigate, dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.name === 'network_bandwidth_mbps' ? Number(e.target.value) : e.target.value;
        setFormData(prev => ({ ...prev, [e.target.name]: val }));
    };

    const handleSaveDetails = () => {
        if (currentRequest?.id) {
            dispatch(updateRequestDetails({ id: currentRequest.id, data: formData }))
                .unwrap()
                .then(() => alert("Параметры сохранены"))
                .catch(() => alert("Ошибка сохранения"));
        }
    };
    
    const handleStrategyDataChange = (strategyId: number, val: string) => {
         if (currentRequest?.id) {
             const gb = parseInt(val) || 0;
             dispatch(updateRequestStrategy({
                 requestId: currentRequest.id,
                 strategyId: strategyId,
                 data: { data_to_recover_gb: gb }
             }));
         }
    }

    const handleSubmitOrder = () => {
        if (currentRequest?.id) dispatch(submitRequest(currentRequest.id));
    };

    const handleDeleteOrder = () => {
        if (currentRequest?.id && window.confirm("Удалить черновик?")) {
            dispatch(deleteRequest(currentRequest.id));
        }
    };

    const breadcrumbs = [{ label: 'Заявка на восстановление', active: true }];

    // 1. Обработка ошибки
    if (error) {
        return (
            <>
                <AppNavbar />
                <Container className="py-5 text-center">
                    <Alert variant="danger" className="d-inline-block text-start" style={{maxWidth: '600px'}}>
                        <h4>Ошибка загрузки заявки</h4>
                        <p>{error}</p>
                        <hr />
                        <p className="mb-0">
                            Попробуйте обновить страницу или обратитесь к администратору.
                        </p>
                    </Alert>
                    <div className="mt-3">
                        <Link to="/strategies">
                            <Button variant="primary">В каталог стратегий</Button>
                        </Link>
                    </div>
                </Container>
            </>
        );
    }

    // 2. Загрузка
    if (loading) {
        return (
            <>
                <AppNavbar />
                <Container className="py-5 text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Загрузка данных заявки...</p>
                </Container>
            </>
        );
    }

    // 3. Пустая корзина (нет ID)
    if (!draftId) {
        return (
            <>
                <AppNavbar />
                <Container className="py-5 text-center">
                    <h3>Корзина пуста</h3>
                    <p className="text-muted">Добавьте стратегии из каталога, чтобы сформировать заявку.</p>
                    <Link to="/strategies">
                        <Button variant="primary" className="mt-3">В каталог</Button>
                    </Link>
                </Container>
            </>
        );
    }

    // 4. Заявка не загрузилась по иной причине
    if (!currentRequest) {
        return (
             <>
                <AppNavbar />
                <Container className="py-5 text-center">
                    <h3>Данные заявки отсутствуют</h3>
                    <Link to="/strategies">
                        <Button variant="primary" className="mt-3">В каталог</Button>
                    </Link>
                </Container>
            </>
        );
    }

    // 5. Основной контент
    return (
        <>
            <AppNavbar />
            <Container className="py-4 cart-page">
                <CustomBreadcrumbs crumbs={breadcrumbs} />
                <h1 className="mb-4">Ваш текущий запрос</h1>

                <Card className="mb-4">
                    <Card.Body>
                        <h4 className="mb-3">Параметры инфраструктуры</h4>
                        <Row>
                            <Col md={6} className="mb-3">
                                <label className="form-label">Уровень квалификации IT:</label>
                                <input 
                                    type="text" name="it_skill_level"
                                    className="form-control" 
                                    placeholder="Junior/Middle/Senior"
                                    value={formData.it_skill_level} onChange={handleInputChange}
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <label className="form-label">Пропускная способность (Мбит/с):</label>
                                <input 
                                    type="number" name="network_bandwidth_mbps"
                                    className="form-control" 
                                    value={formData.network_bandwidth_mbps} onChange={handleInputChange}
                                />
                            </Col>
                            <Col md={12} className="mb-3">
                                <label className="form-label">Качество документации:</label>
                                <input 
                                    type="text" name="documentation_quality"
                                    className="form-control" 
                                    placeholder="Плохое/Среднее/Отличное"
                                    value={formData.documentation_quality} onChange={handleInputChange}
                                />
                            </Col>
                        </Row>
                        <Button variant="outline-primary" size="sm" onClick={handleSaveDetails}>Сохранить параметры</Button>
                    </Card.Body>
                </Card>

                <h3 className="mb-3">Выбранные стратегии</h3>
                {currentRequest.strategies && currentRequest.strategies.map(strategy => (
                    <Card key={strategy.id} className="mb-3 shadow-sm">
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col md={2}>
                                    <img 
                                        src={strategy.image_url || 'http://localhost:9000/recovery-images/backup.png'} 
                                        alt={strategy.title} 
                                        className="img-fluid rounded"
                                        style={{maxHeight: '80px'}}
                                    />
                                </Col>
                                <Col md={4}>
                                    <h5>{strategy.title}</h5>
                                    <small className="text-muted">Базовое время: {strategy.base_recovery_hours} ч.</small>
                                </Col>
                                <Col md={4}>
                                     <label className="small text-muted">Объем данных (GB):</label>
                                     <input 
                                        type="number" 
                                        className="form-control form-control-sm"
                                        placeholder="Введите объем"
                                        onBlur={(e) => handleStrategyDataChange(strategy.id, e.target.value)}
                                     />
                                </Col>
                                <Col md={2} className="text-end">
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => dispatch(removeStrategyFromRequest({ requestId: currentRequest.id!, strategyId: strategy.id! }))}
                                    >
                                        <Trash />
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}

                <Card className="total-time-card mt-4">
                    <Card.Body className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0 text-dark">Итоговое время (расчет после формирования):</h4>
                        <span className="text-dark fs-4">
                            {currentRequest.calculated_recovery_time_hours 
                                ? `${currentRequest.calculated_recovery_time_hours.toFixed(1)} ч.` 
                                : '--'}
                        </span>
                    </Card.Body>
                </Card>

                <div className="d-flex justify-content-between mt-4 mb-5">
                    <Button variant="secondary" onClick={handleDeleteOrder}>Удалить заявку</Button>
                    <Button variant="success" size="lg" onClick={handleSubmitOrder}>Сформировать заявку</Button>
                </div>
            </Container>
        </>
    );
};