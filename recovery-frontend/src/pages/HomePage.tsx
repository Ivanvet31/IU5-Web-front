import { Container, Row, Col } from 'react-bootstrap';
import { AppNavbar } from '../components/Navbar';
import './styles/HomePage.css';

export const HomePage = () => {
  return (
    <>
      <AppNavbar />
      <div className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} className="mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4">
                RecoveryTime
              </h1>
              <h2 className="h3 mb-4">
                Прогноз времени восстановления после сбоя
              </h2>
              <p className="lead mb-4">
                Система для оценки и прогнозирования времени восстановления IT-систем 
                после сбоев с использованием различных стратегий восстановления.
              </p>
              <div className="features mt-5">
                <Row>
                  <Col md={4} className="mb-4">
                    <div className="feature-box p-4">
                      <h4>🗂️ Множество стратегий</h4>
                      <p>
                        Выбор оптимальной стратегии восстановления из каталога
                      </p>
                    </div>
                  </Col>
                  <Col md={4} className="mb-4">
                    <div className="feature-box p-4">
                      <h4>⏱️ Точный прогноз</h4>
                      <p>
                        Расчет времени восстановления с учетом всех параметров
                      </p>
                    </div>
                  </Col>
                  <Col md={4} className="mb-4">
                    <div className="feature-box p-4">
                      <h4>📊 Аналитика</h4>
                      <p>
                        Анализ эффективности различных подходов к восстановлению
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
