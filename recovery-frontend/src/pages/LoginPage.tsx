import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/slices/userSlice';
import { AppNavbar } from '../components/Navbar';

export const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.user);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/strategies'); // Или на главную
        }
        dispatch(clearError());
    }, [isAuthenticated, navigate, dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    return (
        <>
            <AppNavbar />
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
                <Card style={{ width: '400px' }} className="shadow border-0">
                    <Card.Body className="p-4">
                        <h2 className="text-center mb-4 fw-bold">Вход</h2>
                        
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Логин</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите логин"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Введите пароль"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="w-100 py-2"
                                disabled={loading}
                            >
                                {loading ? <Spinner size="sm" animation="border" /> : 'Войти'}
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <span className="text-muted">Нет аккаунта? </span>
                            <Link to="/register" className="text-decoration-none fw-bold" style={{color: '#E53935'}}>
                                Зарегистрироваться
                            </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};