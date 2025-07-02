import React from 'react';

import type { FavoriteItem } from './FavoritesManagement';


type FavoriteItemProps = {
  item: FavoriteItem;
  viewMode: string;
  onRemove: (item: FavoriteItem) => void;
  onAddToCart: (item: FavoriteItem) => void;
  onView: (item: FavoriteItem) => void;
};

const FavoriteItem: React.FC<FavoriteItemProps> = ({ item, viewMode, onRemove, onAddToCart, onView }) => {
  return (
    <div className={`favorite-item favorite-item--${viewMode}`} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
      <h4>{item.name}</h4>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button onClick={() => onView(item)}>Voir</button>
        <button onClick={() => onAddToCart(item)}>Ajouter au panier</button>
        <button onClick={() => onRemove(item)} style={{ color: 'red' }}>Retirer</button>
      </div>
    </div>
  );
};

export default FavoriteItem;
