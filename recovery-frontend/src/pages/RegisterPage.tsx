import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser, clearError, resetRegisterSuccess } from '../store/slices/userSlice';
import { AppNavbar } from '../components/Navbar';

export const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, registerSuccess } = useAppSelector((state) => state.user);

    useEffect(() => {
        dispatch(clearError());
        dispatch(resetRegisterSuccess());
    }, [dispatch]);

    useEffect(() => {
        if (registerSuccess) {
            alert("Регистрация успешна! Теперь войдите в систему.");
            navigate('/login');
        }
    }, [registerSuccess, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerUser(formData));
    };

    return (
        <>
            <AppNavbar />
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
                <Card style={{ width: '400px' }} className="shadow border-0">
                    <Card.Body className="p-4">
                        <h2 className="text-center mb-4 fw-bold">Регистрация</h2>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Логин</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Придумайте логин"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Придумайте пароль"
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
                                {loading ? <Spinner size="sm" animation="border" /> : 'Зарегистрироваться'}
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <span className="text-muted">Уже есть аккаунт? </span>
                            <Link to="/login" className="text-decoration-none fw-bold" style={{color: '#E53935'}}>
                                Войти
                            </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};