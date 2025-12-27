import React, { useEffect, useState } from 'react';
import { Container, Form, Row, Col, Badge, Spinner, Card, InputGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRequestsList, resolveRequest } from '../store/slices/requestSlice';
import type { AppDispatch, RootState } from '../store/store';
import { AppNavbar } from '../components/Navbar';
import { Search, CheckCircle, XCircle, Calendar3 } from 'react-bootstrap-icons';
import { formatDateTimeRU, isoToRu } from '../utils/dateUtils';
import './styles/RequestsListPage.css';

const getField = (obj: any, key: string) => {
    if (!obj) return undefined;
    return obj[key] || obj[key.charAt(0).toUpperCase() + key.slice(1)] || obj[key.toUpperCase()];
};

const getStatusBadge = (status: string | undefined) => {
    const s = status?.toLowerCase();
    switch (s) {
        case 'draft': return <Badge bg="secondary">Черновик</Badge>;
        case 'deleted': return <Badge bg="dark">Удалена</Badge>;
        case 'formed': return <Badge bg="primary">В работе</Badge>;
        case 'completed': return <Badge bg="success">Завершена</Badge>;
        case 'rejected': return <Badge bg="danger">Отклонена</Badge>;
        default: return <Badge bg="light" text="dark">{status || 'Неизвестно'}</Badge>;
    }
};

export const RequestsListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { list, loading } = useSelector((state: RootState) => state.requests);
    const { user } = useSelector((state: RootState) => state.user);
    
    // Определяем, является ли пользователь модератором
    const isModerator = user?.is_moderator;

    const [filters, setFilters] = useState({
        status: '',
        from: '',
        to: ''
    });

    const [creatorSearch, setCreatorSearch] = useState('');

    useEffect(() => {
        const loadData = () => dispatch(fetchRequestsList(filters));
        loadData();
        const intervalId = setInterval(loadData, 5000);
        return () => clearInterval(intervalId);
    }, [dispatch, filters]);

    const handleFilterChange = (e: React.ChangeEvent<any>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleResolve = (e: React.MouseEvent, id: number, action: string) => {
        e.stopPropagation();
        if (window.confirm(`Вы уверены, что хотите ${action === 'complete' ? 'одобрить' : 'отклонить'} эту заявку?`)) {
            dispatch(resolveRequest({ id, action }));
        }
    };

    const filteredList = (list || []).filter((item: any) => {
        if (!creatorSearch) return true;
        // Поиск по создателю работает, даже если поле скрыто (если вдруг state остался), 
        // но обычный пользователь видит только свои заявки, так что это безопасно.
        const creator = getField(item, 'creator_username') || item.User?.Username || item.user?.username || '';
        return creator.toLowerCase().includes(creatorSearch.toLowerCase());
    });

    return (
        <>
            <AppNavbar />
            <Container className="pt-4 pb-5">
                <h2 className="fw-bold mb-4 text-center" style={{ color: '#212529' }}>Заявки</h2>

                <Card className="mb-5 border-0 shadow-sm bg-white rounded-4">
                     <Card.Body className="p-4">
                        <Row className="g-4">
                            <Col md={3}>
                                <Form.Label className="fw-bold text-muted small">Статус</Form.Label>
                                <Form.Select name="status" value={filters.status} onChange={handleFilterChange} className="border-light bg-light">
                                    <option value="">Все</option>
                                    <option value="draft">Черновик</option>
                                    <option value="formed">В работе</option>
                                    <option value="completed">Завершена</option>
                                    <option value="rejected">Отклонена</option>
                                </Form.Select>
                            </Col>
                            
                            <Col md={3}>
                                <Form.Label className="fw-bold text-muted small">Дата создания (от)</Form.Label>
                                <div className="position-relative">
                                    <Form.Control 
                                        type="text"
                                        placeholder="дд.мм.гггг"
                                        value={isoToRu(filters.from)} 
                                        readOnly
                                        className="border-light bg-light text-start"
                                        style={{ backgroundColor: '#F8F9FA' }}
                                    />
                                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted" style={{pointerEvents: 'none'}}>
                                        <Calendar3 />
                                    </div>
                                    <Form.Control 
                                        type="date"
                                        name="from" 
                                        value={filters.from} 
                                        onChange={handleFilterChange}
                                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            </Col>

                            <Col md={3}>
                                <Form.Label className="fw-bold text-muted small">Дата создания (до)</Form.Label>
                                <div className="position-relative">
                                    <Form.Control 
                                        type="text"
                                        placeholder="дд.мм.гггг"
                                        value={isoToRu(filters.to)} 
                                        readOnly
                                        className="border-light bg-light text-start"
                                        style={{ backgroundColor: '#F8F9FA' }}
                                    />
                                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted" style={{pointerEvents: 'none'}}>
                                        <Calendar3 />
                                    </div>
                                    <Form.Control 
                                        type="date"
                                        name="to" 
                                        value={filters.to} 
                                        onChange={handleFilterChange}
                                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            </Col>

                            {/* ИЗМЕНЕНИЕ: Показываем этот блок только если пользователь - модератор */}
                            {isModerator && (
                                <Col md={3}>
                                    <Form.Label className="fw-bold text-muted small">Поиск по создателю</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-light border-light"><Search /></InputGroup.Text>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Логин..." 
                                            value={creatorSearch} 
                                            onChange={(e) => setCreatorSearch(e.target.value)}
                                            className="border-light bg-light"
                                        />
                                    </InputGroup>
                                </Col>
                            )}
                        </Row>
                    </Card.Body>
                </Card>

                <div className="mb-3 text-muted">
                    Найдено заявок: {filteredList.length}
                </div>

                {loading && list.length === 0 ? (
                    <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {filteredList.map((order: any) => {
                            const id = getField(order, 'id');
                            const status = getField(order, 'status');
                            const createdAt = getField(order, 'createdAt') || getField(order, 'created_at');
                            const resultTime = getField(order, 'calculated_recovery_time_hours') || getField(order, 'calculatedRecoveryTimeHours');
                            // Ищем создателя в разных местах структуры
                            const creator = getField(order, 'creator_username') 
                                         || order.User?.Username 
                                         || order.user?.username 
                                         || '—';

                            return (
                                <Card 
                                    key={id}
                                    className="border-0 shadow-sm request-card-hover rounded-3 overflow-hidden" 
                                    onClick={() => navigate(`/requests/${id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                            <h5 className="fw-bold mb-0">Заявка №{id}</h5>
                                            {getStatusBadge(status)}
                                        </div>

                                        <Row>
                                            <Col md={3}>
                                                <div className="text-uppercase text-muted small fw-bold mb-1">Статус</div>
                                                <div className="fw-medium">
                                                    {status === 'formed' ? 'В работе' :
                                                     status === 'completed' ? 'Завершена' :
                                                     status === 'rejected' ? 'Отклонена' :
                                                     status === 'draft' ? 'Черновик' : status}
                                                </div>
                                            </Col>
                                            <Col md={3}>
                                                <div className="text-uppercase text-muted small fw-bold mb-1">Дата создания</div>
                                                <div className="fw-medium">
                                                    {(createdAt) ? formatDateTimeRU(createdAt) : '—'}
                                                </div>
                                            </Col>
                                            <Col md={3}>
                                                <div className="text-uppercase text-muted small fw-bold mb-1">Время восстановления</div>
                                                <div className={`fw-bold ${resultTime ? 'text-primary' : 'text-muted'}`}>
                                                    {resultTime ? `${Number(resultTime).toFixed(2)} ч.` : '—'}
                                                </div>
                                            </Col>
                                            <Col md={3} className="text-end">
                                                 {isModerator && status === 'formed' ? (
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        <Button 
                                                            variant="success" size="sm"
                                                            onClick={(e) => handleResolve(e, id, 'complete')}
                                                        >
                                                            <CheckCircle className="me-1"/> Одобрить
                                                        </Button>
                                                        <Button 
                                                            variant="outline-danger" size="sm"
                                                            onClick={(e) => handleResolve(e, id, 'reject')}
                                                        >
                                                            Отклонить
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="text-muted small"></div>
                                                )}
                                            </Col>
                                        </Row>

                                        <div className="mt-4 pt-3 border-top text-muted small">
                                            Создатель: <span className="fw-bold text-dark">{creator}</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            );
                        })}
                        {filteredList.length === 0 && (
                            <div className="text-center py-5 text-muted">Заявок не найдено</div>
                        )}
                    </div>
                )}
            </Container>
        </>
    );
};