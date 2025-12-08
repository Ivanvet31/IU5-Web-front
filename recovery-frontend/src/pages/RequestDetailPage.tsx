import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppNavbar } from '../components/Navbar';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import { fetchRequestById, resolveRequest } from '../store/slices/requestSlice';
import type { AppDispatch, RootState } from '../store';
import { DefaultImage } from '../components/StrategyCard';
import { ClockHistory, CheckCircle, XCircle, Hdd, HourglassSplit } from 'react-bootstrap-icons';

export const RequestDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { currentRequest, loading, error } = useSelector((state: RootState) => state.requests);
    const { user } = useSelector((state: RootState) => state.user);

    const [isResolving, setIsResolving] = useState(false);

    useEffect(() => {
        if (!id) return;
        
        const loadData = () => dispatch(fetchRequestById(Number(id)));
        loadData();

        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, [dispatch, id]);

    const handleResolve = (action: string) => {
        if (!id) return;
        if (window.confirm(`Вы уверены?`)) {
            setIsResolving(true);
            dispatch(resolveRequest({ id: Number(id), action }))
                .finally(() => setIsResolving(false));
        }
    };

    if (loading && !currentRequest) {
        return <><AppNavbar /><Container className="py-5 text-center"><Spinner animation="border" /></Container></>;
    }

    if (error || !currentRequest) {
        return <><AppNavbar /><Container className="py-5"><Alert variant="danger">Заявка не найдена</Alert></Container></>;
    }

    const breadcrumbs = [
        { label: 'История заявок', path: '/requests' },
        { label: `Заявка №${id}`, active: true }
    ];

    const isModerator = user?.is_moderator;
    const status = currentRequest.status;

    return (
        <>
            <AppNavbar />
            <Container className="py-4">
                <CustomBreadcrumbs crumbs={breadcrumbs} />
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h2 fw-bold mb-0">Заявка №{currentRequest.id}</h1>
                    <h4>
                        <Badge bg={
                            status === 'completed' ? 'success' : 
                            status === 'rejected' ? 'danger' : 
                            status === 'formed' ? 'primary' : 'secondary'
                        }>
                            {status === 'formed' ? 'Сформирована (В работе)' : 
                             status === 'completed' ? 'Завершена' : 
                             status === 'rejected' ? 'Отклонена' : status}
                        </Badge>
                    </h4>
                </div>

                <Row>
                    <Col lg={8}>
                        {/* Параметры */}
                        <Card className="mb-4 border-0 shadow-sm">
                            <Card.Body>
                                <h5 className="mb-3 fw-bold">Параметры инфраструктуры</h5>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <label className="form-label text-muted small">Уровень квалификации IT</label>
                                        <input className="form-control bg-light" disabled value={currentRequest.it_skill_level || '—'} />
                                    </Col>
                                    <Col md={6}>
                                        <label className="form-label text-muted small">Пропускная способность (Мбит/с)</label>
                                        <input className="form-control bg-light" disabled value={currentRequest.network_bandwidth_mbps || 0} />
                                    </Col>
                                    <Col md={12}>
                                        <label className="form-label text-muted small">Качество документации</label>
                                        <input className="form-control bg-light" disabled value={currentRequest.documentation_quality || '—'} />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Список стратегий */}
                        <h5 className="mb-3 fw-bold">Состав заявки</h5>
                        {currentRequest.strategies && currentRequest.strategies.map((strategy: any) => (
                            <Card key={strategy.id} className="mb-3 border-0 shadow-sm">
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col xs={3} md={2}>
                                            <img 
                                                src={strategy.image_url || DefaultImage} 
                                                className="img-fluid rounded" 
                                                alt=""
                                                style={{ height: '60px', objectFit: 'cover' }}
                                            />
                                        </Col>
                                        <Col xs={9} md={10}>
                                            <h6 className="fw-bold mb-2">{strategy.title}</h6>
                                            <div className="d-flex gap-4 text-muted small">
                                                <span className="d-flex align-items-center">
                                                    <HourglassSplit className="me-2 text-primary"/>
                                                    Базовое время: <strong>{strategy.base_recovery_hours} ч.</strong>
                                                </span>
                                                <span className="d-flex align-items-center">
                                                    <Hdd className="me-2 text-primary"/>
                                                    Объем данных: <strong>{strategy.data_to_recover_gb || 0} GB</strong>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </Col>

                    <Col lg={4}>
                        {/* Блок результата */}
                        <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: '#212529', color: 'white' }}>
                            <Card.Body className="text-center py-5">
                                <ClockHistory size={32} className="mb-3 text-white-50" />
                                <h5 className="text-white-50">Расчетное время</h5>
                                {status === 'completed' ? (
                                    currentRequest.calculated_recovery_time_hours ? (
                                        <div className="display-4 fw-bold text-success mt-2">
                                            {Number(currentRequest.calculated_recovery_time_hours).toFixed(2)} ч.
                                        </div>
                                    ) : (
                                        <div className="mt-3">
                                            <Spinner animation="border" variant="light" />
                                            <div className="small mt-2 text-white-50">Идет расчет...</div>
                                        </div>
                                    )
                                ) : (
                                    <div className="fs-5 text-muted mt-2">
                                        {status === 'draft' ? 'Не сформирована' : 'Ожидает решения'}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                        {/* Панель модератора */}
                        {isModerator && status === 'formed' && (
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <h6 className="fw-bold mb-3">Действия модератора</h6>
                                    <div className="d-grid gap-2">
                                        <Button 
                                            variant="success" 
                                            onClick={() => handleResolve('complete')}
                                            disabled={isResolving}
                                        >
                                            <CheckCircle className="me-2"/> Одобрить и рассчитать
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            onClick={() => handleResolve('reject')}
                                            disabled={isResolving}
                                        >
                                            <XCircle className="me-2"/> Отклонить заявку
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}
                        
                        {status === 'draft' && user?.username === currentRequest.creator_username && (
                             <div className="d-grid">
                                 <Button variant="primary" onClick={() => navigate('/cart')}>
                                     Перейти к редактированию
                                 </Button>
                             </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};