import { useFavoritesStore } from '../../store/favoritesStore';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

interface Props {
  propertyId: string;
  className?: string;
}

export default function FavoriteButton({ propertyId, className = '' }: Props) {
  const { isAuthenticated } = useAuth();
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
  const navigate = useNavigate();
  const isFav = favorites.includes(propertyId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isFav) removeFavorite(propertyId);
    else addFavorite(propertyId);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-gold-500/20 transition-all z-10 ${className}`}
    >
      <i
        className={`${isFav ? 'fa-solid text-gold-500' : 'fa-regular text-white'} fa-heart text-lg`}
      />
    </button>
  );
}
