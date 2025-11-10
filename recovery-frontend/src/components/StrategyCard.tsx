import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { IStrategy } from '../types';
import './styles/StrategyCard.css';

export const DefaultImage = 'http://localhost:9000/recovery-images/backup.png';

interface StrategyCardProps {
  strategy: IStrategy;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({ strategy }) => {
  const imageUrl = strategy.image_url || DefaultImage;

  return (
    <Card className="strategy-card h-100">
      <Card.Img 
        variant="top" 
        src={imageUrl}
        alt={strategy.title}
        className="strategy-card__image"
        onError={(e) => { (e.target as HTMLImageElement).src = DefaultImage; }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="strategy-title">{strategy.title}</Card.Title>
        <Card.Text className="strategy-description flex-grow-1">
          {strategy.description.substring(0, 100)}...
        </Card.Text>
        <div className="mt-auto">
          {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ --- */}
          <Link to={`/strategies/${strategy.id}`} className="d-block text-decoration-none">
            <Button 
              variant="link"
              className="strategy-card__link p-0"
            >
              Подробнее →
            </Button>
          </Link>
          {/* --- КОНЕЦ ИЗМЕНЕНИЯ --- */}
          <div className="mt-2">
            <Button 
              variant="primary" 
              size="sm"
              className="w-100"
            >
              Добавить в заявку
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};