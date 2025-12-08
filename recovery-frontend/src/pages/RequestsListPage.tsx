import React, { useEffect, useState } from 'react';
import { Container, Form, Row, Col, Badge, Spinner, Card, InputGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRequestsList, resolveRequest } from '../store/slices/requestSlice';
import type { AppDispatch, RootState } from '../store';
import { AppNavbar } from '../components/Navbar';
import { Search, CheckCircle, XCircle } from 'react-bootstrap-icons';
import { formatDateTimeRU, isoToRu } from '../utils/dateUtils';
import './styles/RequestsListPage.css';

// Хелпер для доступа к полям
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
    const { user } = useSelector((state: RootState) => state.user); // Для проверки прав модератора

    const [filters, setFilters] = useState({
        status: '',
        from: '',
        to: ''
    });

    // Состояние для управления типом инпутов даты (text <-> date)
    const [dateInputType, setDateInputType] = useState<{from: string, to: string}>({
        from: 'text',
        to: 'text'
    });

    const [creatorSearch, setCreatorSearch] = useState('');

    // Short Polling
    useEffect(() => {
        const loadData = () => dispatch(fetchRequestsList(filters));
        loadData();
        const intervalId = setInterval(loadData, 5000);
        return () => clearInterval(intervalId);
    }, [dispatch, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Действия модератора (прямо из карточки, если нужно)
    const handleResolve = (e: React.MouseEvent, id: number, action: string) => {
        e.stopPropagation(); // Чтобы не сработал переход на детальную страницу
        if (window.confirm(`Вы уверены, что хотите ${action === 'complete' ? 'одобрить' : 'отклонить'} эту заявку?`)) {
            dispatch(resolveRequest({ id, action }));
        }
    };

    // Фильтрация на клиенте
    const filteredList = (list || []).filter((item: any) => {
        if (!creatorSearch) return true;
        const creator = getField(item, 'creator_username') || '';
        return creator.toLowerCase().includes(creatorSearch.toLowerCase());
    });

    return (
        <>
            <AppNavbar />
            <Container className="pt-4 pb-5">
                {/* Фильтры */}
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
                                <Form.Control 
                                    type={dateInputType.from}
                                    name="from" 
                                    placeholder="дд.мм.гггг"
                                    value={dateInputType.from === 'date' ? filters.from : isoToRu(filters.from)} 
                                    onChange={handleFilterChange}
                                    onFocus={() => setDateInputType({...dateInputType, from: 'date'})}
                                    onBlur={() => setDateInputType({...dateInputType, from: 'text'})}
                                    className="border-light bg-light"
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label className="fw-bold text-muted small">Дата создания (до)</Form.Label>
                                <Form.Control 
                                    type={dateInputType.to}
                                    name="to" 
                                    placeholder="дд.мм.гггг"
                                    value={dateInputType.to === 'date' ? filters.to : isoToRu(filters.to)} 
                                    onChange={handleFilterChange}
                                    onFocus={() => setDateInputType({...dateInputType, to: 'date'})}
                                    onBlur={() => setDateInputType({...dateInputType, to: 'text'})}
                                    className="border-light bg-light"
                                />
                            </Col>
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
                        </Row>
                    </Card.Body>
                </Card>

                <div className="mb-3 text-muted">
                    Найдено заявок: {filteredList.length}
                </div>

                {loading && list.length === 0 ? (
                    <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                ) : (
                    <Row className="g-4">
                        {filteredList.map((order: any) => {
                            const id = getField(order, 'id');
                            const status = getField(order, 'status');
                            const createdAt = getField(order, 'createdAt') || getField(order, 'created_at');
                            // const completedAt = getField(order, 'completedAt') || getField(order, 'completed_at') || getField(order, 'formed_at');
                            const resultTime = getField(order, 'calculated_recovery_time_hours') || getField(order, 'calculatedRecoveryTimeHours');
                            const isModerator = user?.is_moderator;

                            return (
                                <Col md={6} lg={4} key={id}>
                                    <Card 
                                        className="h-100 border-0 shadow-sm request-card-hover" 
                                        onClick={() => navigate(`/requests/${id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Card.Body className="p-4 d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <h5 className="fw-bold mb-0">Заявка №{id}</h5>
                                                {getStatusBadge(status)}
                                            </div>

                                            <div className="mb-4 small flex-grow-1">
                                                <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                                                    <span className="text-muted">Создана:</span>
                                                    <span className="fw-medium">{formatDateTimeRU(createdAt)}</span>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-muted">ID создателя:</span>
                                                    <span className="fw-bold">
                                                        {getField(order, 'creator_username') || getField(order, 'user_id')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-auto">
                                                <div className="d-flex justify-content-between align-items-end mb-3">
                                                    <span className="text-muted small">Время восстановления:</span>
                                                    <span className={`fw-bold ${resultTime ? 'text-primary fs-5' : 'text-muted'}`}>
                                                        {resultTime ? `${Number(resultTime).toFixed(2)} ч.` : '—'}
                                                    </span>
                                                </div>

                                                {/* Кнопки модератора прямо на карточке */}
                                                {isModerator && status === 'formed' && (
                                                    <div className="d-flex gap-2 mt-3 pt-3 border-top">
                                                        <Button 
                                                            variant="success" size="sm" className="w-100"
                                                            onClick={(e) => handleResolve(e, id, 'complete')}
                                                        >
                                                            <CheckCircle className="me-1"/> Одобрить
                                                        </Button>
                                                        <Button 
                                                            variant="outline-danger" size="sm" className="w-100"
                                                            onClick={(e) => handleResolve(e, id, 'reject')}
                                                        >
                                                            Отклонить
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                        {filteredList.length === 0 && (
                            <Col className="text-center py-5 text-muted w-100">Заявок не найдено</Col>
                        )}
                    </Row>
                )}
            </Container>
        </>
    );
};