import React, { useEffect, useState } from 'react';
import { Container, Table, Form, Row, Col, Badge, Spinner, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRequestsList, fetchRequestById } from '../store/slices/requestSlice'; // Добавили fetchRequestById
import type { AppDispatch, RootState } from '../store';
import { AppNavbar } from '../components/Navbar';
import { ChevronDown, ChevronUp, ClockHistory, HddNetwork } from 'react-bootstrap-icons';

// Хелпер для безопасного доступа к полям
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
    const { list, loading: listLoading, currentRequest } = useSelector((state: RootState) => state.requests);

    // Состояние для хранения ID раскрытой строки
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    // Локальный лоадинг для деталей
    const [detailLoading, setDetailLoading] = useState(false);

    const [filters, setFilters] = useState({
        status: '',
        from: '',
        to: ''
    });

    useEffect(() => {
        dispatch(fetchRequestsList(filters));
    }, [dispatch, filters]);

    // Функция переключения раскрытия строки
    const toggleRow = (id: number) => {
        if (expandedRowId === id) {
            setExpandedRowId(null);
        } else {
            setExpandedRowId(id);
            setDetailLoading(true);
            // Загружаем детали, чтобы получить стратегии
            dispatch(fetchRequestById(id)).finally(() => setDetailLoading(false));
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <>
            <AppNavbar />
            <Container className="pt-5 mt-4">
                <h2 className="fw-bold mb-4 text-center" style={{ color: '#212529' }}>История заявок</h2>

                <Card className="mb-4 border-0 shadow-sm bg-white">
                     <Card.Body>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Label>Статус</Form.Label>
                                <Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
                                    <option value="">Любой статус</option>
                                    <option value="draft">Черновик</option>
                                    <option value="formed">В работе</option>
                                    <option value="completed">Завершена</option>
                                    <option value="rejected">Отклонена</option>
                                </Form.Select>
                            </Col>
                            <Col md={4}>
                                <Form.Label>Дата оформления (от)</Form.Label>
                                <Form.Control type="date" name="from" value={filters.from} onChange={handleFilterChange} />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Дата оформления (до)</Form.Label>
                                <Form.Control type="date" name="to" value={filters.to} onChange={handleFilterChange} />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {listLoading && !expandedRowId ? (
                    <div className="text-center"><Spinner animation="border" variant="primary" /></div>
                ) : (
                    <div className="table-responsive shadow-sm rounded bg-white">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th style={{width: '50px'}}></th>
                                    <th>#</th>
                                    <th>Статус</th>                            
                                    <th>Создана</th>
                                    <th>Параметры (IT / Док)</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {(list || []).length > 0 ? (list || []).map((order: any, index: number) => {
                                    const id = getField(order, 'id');
                                    const status = getField(order, 'status');
                                    const createdAt = getField(order, 'createdAt') || getField(order, 'created_at');
                                    const skill = getField(order, 'itSkillLevel') || getField(order, 'it_skill_level');
                                    const doc = getField(order, 'documentationQuality') || getField(order, 'documentation_quality');
                                    const resultTime = getField(order, 'calculated_recovery_time_hours') || getField(order, 'calculatedRecoveryTimeHours');

                                    const isExpanded = expandedRowId === id;
                                    
                                    // Если строка раскрыта, берем стратегии из currentRequest (который мы подгрузили), иначе из списка (где их может не быть)
                                    // Но важно проверить, что currentRequest соответствует текущей строке
                                    const strategies = (isExpanded && currentRequest && getField(currentRequest, 'id') === id) 
                                        ? (getField(currentRequest, 'strategies') || []) 
                                        : (getField(order, 'strategies') || []);

                                    return (
                                        <React.Fragment key={id}>
                                            {/* Основная строка */}
                                            <tr 
                                                onClick={() => toggleRow(id)} 
                                                style={{ cursor: 'pointer', backgroundColor: isExpanded ? '#f8f9fa' : 'inherit' }}
                                            >
                                                <td className="text-center text-muted">
                                                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                                                </td>
                                                <td className="fw-bold">{index + 1}</td>
                                                <td>{getStatusBadge(status)}</td>
                                                <td>
                                                    {(createdAt) 
                                                        ? new Date(createdAt).toLocaleDateString('ru-RU') 
                                                        : <span className="text-muted">--</span>}
                                                </td>
                                                <td>
                                                    <small className="text-muted">
                                                        {skill || 'Нет данных'} / {doc || ''}
                                                    </small>
                                                </td>
                                            </tr>

                                            {/* Выпадающая строка с деталями */}
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={5} className="p-0 border-0">
                                                        <div className="p-4 bg-light border-bottom">
                                                            {detailLoading ? (
                                                                <div className="text-center py-3"><Spinner size="sm" animation="border"/> Загрузка деталей...</div>
                                                            ) : (
                                                                <Row>
                                                                    {/* Блок с результатом */}
                                                                    <Col md={6} className="mb-3">
                                                                        <Card className="h-100 border-0 shadow-sm" style={{backgroundColor: '#212529', color: 'white'}}>
                                                                            <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
                                                                                <h5 className="text-white-50 mb-2">
                                                                                    <ClockHistory className="me-2"/>
                                                                                    Расчетное время восстановления
                                                                                </h5>
                                                                                {status === 'completed' ? (
                                                                                    <span className="display-4 fw-bold text-success">
                                                                                        {resultTime ? Number(resultTime).toFixed(1) : 0} ч.
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="fs-5 text-muted mt-2">
                                                                                        {status === 'draft' ? 'Черновик (не рассчитан)' : 'В обработке...'}
                                                                                    </span>
                                                                                )}
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </Col>

                                                                    {/* Блок со списком стратегий */}
                                                                    <Col md={6} className="mb-3">
                                                                        <Card className="h-100 border-0 shadow-sm">
                                                                            <Card.Header className="bg-white fw-bold">Выбранные стратегии</Card.Header>
                                                                            <Card.Body>
                                                                                {strategies.length > 0 ? (
                                                                                    <ul className="list-unstyled mb-0">
                                                                                        {strategies.map((s: any) => {
                                                                                            const sTitle = getField(s, 'title');
                                                                                            const sId = getField(s, 'id');
                                                                                            return (
                                                                                                <li key={sId} className="mb-2 d-flex align-items-center">
                                                                                                    <HddNetwork className="text-danger me-2"/>
                                                                                                    {sTitle}
                                                                                                </li>
                                                                                            )
                                                                                        })}
                                                                                    </ul>
                                                                                ) : (
                                                                                    <p className="text-muted mb-0">Стратегии не найдены</p>
                                                                                )}
                                                                            </Card.Body>
                                                                            {status === 'draft' && (
                                                                                <Card.Footer className="bg-white border-0">
                                                                                    <Link to={`/requests/${id}`} className="d-grid text-decoration-none">
                                                                                        <Button variant="outline-primary" size="sm">
                                                                                            Редактировать заявку
                                                                                        </Button>
                                                                                    </Link>
                                                                                </Card.Footer>
                                                                            )}
                                                                        </Card>
                                                                    </Col>
                                                                </Row>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-muted">Заявок не найдено</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Container>
        </>
    );
};