import { Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import type { IStrategy } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addStrategyToDraft } from '../store/slices/cartSlice';
import './styles/StrategyCard.css';

export const DefaultImage = 'http://localhost:9000/recovery-images/backup.png';

interface StrategyCardProps {
  strategy: IStrategy;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({ strategy }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // Получаем статус авторизации
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const imageUrl = strategy.image_url || DefaultImage;

  const handleAddToCart = () => {
      dispatch(addStrategyToDraft(strategy.id));
  };

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
          <Link to={`/strategies/${strategy.id}`} className="d-block text-decoration-none">
            <Button variant="link" className="strategy-card__link p-0">
              Подробнее →
            </Button>
          </Link>
          
          {/* ИЗМЕНЕНИЕ: Показываем кнопку только авторизованным */}
          {isAuthenticated && (
            <div className="mt-2">
                <Button 
                variant="primary" 
                size="sm"
                className="w-100"
                onClick={handleAddToCart}
                >
                Добавить в заявку
                </Button>
            </div>
          )}
          
        </div>
      </Card.Body>
    </Card>
  );
};