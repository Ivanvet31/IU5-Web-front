import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { IStrategy } from '../types';
import './styles/StrategyCard.css';

export const DefaultImage = 'http://localhost:9000/strategies/Images/default.png';

interface StrategyCardProps {
  strategy: IStrategy;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({ strategy }) => {
  return (
    <div className="strategy-card mb-4 p-3 border rounded shadow-sm">
      <Row>
        <Col md={4}>
          <img
            src={strategy.image_url || DefaultImage}
            alt={strategy.title}
            className="img-fluid rounded"
          />
        </Col>
        <Col md={8}>
          <div className="strategy-content">
            <h5 className="strategy-title">{strategy.title}</h5>
            <p className="strategy-description text-muted">
              {strategy.description.substring(0, 150)}...
            </p>
            <div className="mt-3">
              <span className="badge bg-info me-2">
                Базовое время: {strategy.base_recovery_hours} ч
              </span>
              <span className={`badge ${strategy.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                {strategy.status === 'active' ? 'Активна' : 'Неактивна'}
              </span>
            </div>
            <Button 
              as={Link} 
              to={`/strategies/${strategy.id}`}
              variant="primary" 
              size="sm"
              className="mt-3"
            >
              Подробнее
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};
