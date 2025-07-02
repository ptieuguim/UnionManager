// MIGRATION : Ce composant a été migré de FavoritesManagement.jsx vers TypeScript strict. L'ancien fichier doit être supprimé après validation.
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Search, Filter, Grid, List, ChevronDown, X, ShoppingCart,
  Star, Clock, Calendar, MapPin, ArrowRight, Eye, Trash2, Share2,
  Plus, Check, Info, AlertTriangle, Download, Printer, Tag, MessageSquare,
  ThumbsUp, User, Phone, Mail, ExternalLink, Flag, BarChart2
} from 'lucide-react';
import { CheckCircleOutlined } from '@ant-design/icons';

import FavoriteItem from './FavoriteItem';
// Types TypeScript
export interface FavoriteItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  gallery?: string[];
  addedDate: string;
  availability: boolean;
  provider: string;
  providerImage?: string;
  providerRating?: number;
  providerSince?: string;
  location: string;
  features?: string[];
  maxQuantity?: number;
  featured?: boolean;
  category?: string; 
}

interface FavoriteItemProps {
  item: FavoriteItemType;
  onRemove: (id: string) => void;
  onAddToCart: (item: FavoriteItemType) => void;
  onView: (item: FavoriteItemType) => void;
  viewMode: string;
}

const FavoriteItemComponent: React.FC<FavoriteItemProps> = ({ item, onRemove, onAddToCart, onView, viewMode }) => {
  // ... (reprendre la logique du composant FavoriteItemType, typée)
  return <></>;
};

interface ItemDetailViewProps {
  item: FavoriteItemType;
  onClose: () => void;
  onAddToCart: (item: FavoriteItemType, quantity: number) => void;
  onRemoveFavorite: (id: string) => void;
}

const ItemDetailView: React.FC<ItemDetailViewProps> = ({ item, onClose, onAddToCart, onRemoveFavorite }) => {
  // ... (reprendre la logique du composant ItemDetailView, typée)
  return <></>;
};

export const FavoritesManagement: React.FC = () => {
  // Wrapper pour adapter la signature attendue par les enfants
  const handleAddToCartForChild = (item: any) => {
    handleAddToCart(item as FavoriteItemType, 1);
  }
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItemType[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'unavailable'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'name' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<FavoriteItemType | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [cartNotification, setCartNotification] = useState<{ item: FavoriteItemType; quantity: number } | null>(null);

  useEffect(() => {
    const fakeFavoriteItems: FavoriteItemType[] = [
        {
        id: '1',
        name: 'Transport express de marchandises',
        description: 'Service de transport rapide pour vos marchandises urgentes avec suivi en temps réel et assurance incluse.',
        price: 75000,
        discount: 10,
        rating: 4.8,
        reviews: 124,
        image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          'https://images.unsplash.com/photo-1586191582151-f73872dfd183?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          'https://images.unsplash.com/photo-1486096280674-2cd0bf401f25?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        addedDate: '2023-05-15T10:30:00Z',
        availability: true,
        category: 'transport',
        provider: 'TransExpress Cameroun',
        providerImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        providerRating: 4.9,
        providerSince: '2018',
        location: 'Douala, Cameroun',
        features: [
          'Livraison en 24h maximum',
          'Suivi GPS en temps réel',
          'Assurance tous risques incluse',
          'Service client 24/7',
          'Notification automatique à la livraison'
        ],
        featured: true
      },
      {
        id: '2',
        name: 'Location de camion avec chauffeur',
        description: 'Service de location de camion incluant un chauffeur professionnel pour vos besoins de transport. Différentes capacités disponibles.',
        price: 120000,
        rating: 4.6,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1548534441-e99c2d96a798?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        addedDate: '2023-05-18T14:45:00Z',
        availability: true,
        category: 'location',
        provider: 'CamLocation Services',
        location: 'Yaoundé, Cameroun',
        features: [
          'Chauffeur professionnel inclus',
          'Assurance complète',
          'Différentes capacités disponibles',
          'Réservation flexible',
          'Service d\'assistance routière'
        ]
      },
      {
        id: '3',
        name: 'Service de déménagement',
        description: 'Solution complète pour votre déménagement incluant emballage, transport et déballage de vos biens avec une équipe professionnelle.',
        price: 250000,
        rating: 4.9,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1586191582151-f73872dfd183?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        addedDate: '2023-05-20T09:15:00Z',
        availability: false,
        category: 'demenagement',
        provider: 'MoveIt Pro',
        location: 'Douala, Cameroun',
        features: [
          'Emballage professionnel',
          'Transport sécurisé',
          'Déballage et installation',
          'Assurance tous risques',
          'Service de garde-meuble disponible'
        ]
      },
      {
        id: '4',
        name: 'Transport maritime international',
        description: 'Service de transport maritime pour vos marchandises à l\'international avec gestion des formalités douanières et suivi de cargaison.',
        price: 850000,
        discount: 5,
        rating: 4.7,
        reviews: 72,
        image: 'https://images.unsplash.com/photo-1577032229840-33197764440d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        addedDate: '2023-05-22T16:20:00Z',
        availability: true,
        category: 'maritime',
        provider: 'Global Shipping Co.',
        location: 'Kribi, Cameroun',
        features: [
          'Transport international',
          'Gestion des formalités douanières',
          'Suivi de cargaison en temps réel',
          'Assurance maritime',
          'Conseil en logistique internationale'
        ],
        featured: true
      },
      {
        id: '5',
        name: 'Livraison express de colis',
        description: 'Service de livraison rapide pour vos colis urgents dans toute la ville avec suivi en temps réel et confirmation de livraison.',
        price: 15000,
        rating: 4.5,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        addedDate: '2023-05-25T11:10:00Z',
        availability: true,
        category: 'livraison',
        provider: 'SpeedDelivery',
        location: 'Douala, Cameroun',
        features: [
          'Livraison en moins de 3 heures',
          'Suivi en temps réel',
          'Confirmation de livraison',
          'Assurance incluse',
          'Service disponible 7j/7'
        ]
      }
    ];
    setFavoriteItems(fakeFavoriteItems);
  }, []);

  // Calcul des statistiques des favoris
  // Statistiques globales et par catégorie
  interface FavoriteStats {
    total: number;
    available: number;
    unavailable: number;
    averagePrice: number;
    withDiscount: number;
    byCategory: { [category: string]: number };
  }

  // Calcul de la répartition par catégorie
  const byCategory: { [category: string]: number } = {};
  favoriteItems.forEach(item => {
    const cat = item.category || 'Autre';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  });

  const favoriteStats: FavoriteStats = {
    total: favoriteItems.length,
    available: favoriteItems.filter(item => item.availability).length,
    unavailable: favoriteItems.filter(item => !item.availability).length,
    averagePrice: favoriteItems.length > 0 ? Math.round(favoriteItems.reduce((sum, item) => sum + item.price, 0) / favoriteItems.length) : 0,
    withDiscount: favoriteItems.filter(item => item.discount && item.discount > 0).length,
    byCategory,
  };


  // Filtrer et trier les éléments
  const filteredItems = favoriteItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAvailability = filterAvailability === 'all' ||
        (filterAvailability === 'available' && item.availability) ||
        (filterAvailability === 'unavailable' && !item.availability);
      return matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime()
          : new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      } else if (sortBy === 'price') {
        return sortOrder === 'asc'
          ? a.price - b.price
          : b.price - a.price;
      } else if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'rating') {
        return sortOrder === 'asc'
          ? a.rating - b.rating
          : b.rating - a.rating;
      }
      return 0;
    });

  const handleRemoveItem = (id: string) => {
    setFavoriteItems(favoriteItems.filter(item => item.id !== id));
  };

  const handleAddToCart = (item: FavoriteItemType, quantity = 1) => {
    setCartNotification({ item, quantity });
    setTimeout(() => setCartNotification(null), 3000);
    if (selectedItem) setSelectedItem(null);
  };

  const handleViewItem = (item: FavoriteItemType) => {
    setSelectedItem(item);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const exportFavorites = () => {
    const dataStr = JSON.stringify(favoriteItems, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'favorites.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const printFavorites = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write('<html><head><title>Mes Favoris</title></head><body>...print content...</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-6">
         <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
             <div>
               <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Favoris</h1>
               <p className="text-gray-600">
                 Gérez vos services préférés et réservez-les facilement
               </p>
             </div>
             <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setShowStats(!showStats)}
                 className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center"
               >
                 <BarChart2 className="w-5 h-5 mr-2" />
                 {showStats ? 'Masquer les stats' : 'Voir les stats'}
               </motion.button>
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={printFavorites}
                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
               >
                 <Printer className="w-5 h-5 mr-2" />
                 Imprimer
               </motion.button>
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={exportFavorites}
                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
               >
                 <Download className="w-5 h-5 mr-2" />
                 Exporter
               </motion.button>
             </div>
           </div>
   
           {/* Statistiques */}
           <AnimatePresence>
             {showStats && (
               <motion.div
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 className="bg-white rounded-xl shadow-lg p-6 mb-8 overflow-hidden"
               >
                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistiques de vos favoris</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="bg-blue-50 p-4 rounded-xl">
                     <div className="text-sm text-blue-600 mb-1">Total des favoris</div>
                     <div className="text-3xl font-bold text-gray-800">{favoriteStats.total}</div>
                     <div className="mt-2 text-sm text-gray-600">
                       {favoriteStats.available} disponibles, {favoriteStats.unavailable} indisponibles
                     </div>
                   </div>
                   
                   <div className="bg-green-50 p-4 rounded-xl">
                     <div className="text-sm text-green-600 mb-1">Prix moyen</div>
                     <div className="text-3xl font-bold text-gray-800">{favoriteStats.averagePrice.toLocaleString()} FCFA</div>
                     <div className="mt-2 text-sm text-gray-600">
                       {favoriteStats.withDiscount} services avec réduction
                     </div>
                   </div>
                   
                   <div className="bg-purple-50 p-4 rounded-xl col-span-1 md:col-span-2">
                     <div className="text-sm text-purple-600 mb-1">Répartition par catégorie</div>
                     <div className="flex flex-wrap gap-2 mt-2">
                       {Object.entries(favoriteStats.byCategory).map(([category, count]) => (
                         count > 0 && (
                           <div key={category} className="bg-white px-3 py-1 rounded-full text-sm">
                             <span className="font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}:</span> {count}
                           </div>
                         )
                       ))}
                     </div>
                   </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
   
           {/* Filtres et recherche */}
           <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="md:col-span-2">
                 <div className="relative">
                   <input
                     type="text"
                     placeholder="Rechercher dans mes favoris..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                 </div>
               </div>
               <div>
                 <select
                   value={filterCategory}
                   onChange={(e) => setFilterCategory(e.target.value)}
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 >
                   <option value="all">Toutes les catégories</option>
                   <option value="transport">Transport</option>
                   <option value="location">Location</option>
                   <option value="demenagement">Déménagement</option>
                   <option value="maritime">Maritime</option>
                   <option value="livraison">Livraison</option>
                 </select>
               </div>
             </div>
             <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-200">
               <div className="flex items-center space-x-4">
                 <div className="flex items-center">
                   <span className="text-sm text-gray-600 mr-2">Trier par:</span>
                   <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value as "date" | "price" | "name" | "rating")}
                     className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   >
                     <option value="date">Date d'ajout</option>
                     <option value="price">Prix</option>
                     <option value="name">Nom</option>
                     <option value="rating">Évaluation</option>
                   </select>
                   <button
                     onClick={toggleSortOrder}
                     className="ml-2 p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                   >
                     <ChevronDown className={`w-5 h-5 transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                   </button>
                 </div>
                 <div className="text-sm text-gray-600">
                   {filteredItems.length} service(s) favori(s)
                 </div>
               </div>
               <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                 <button
                   onClick={() => setViewMode('grid')}
                   className={`p-2 rounded-lg ${
                     viewMode === 'grid'
                       ? 'bg-blue-100 text-blue-600'
                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                   }`}
                 >
                   <Grid className="w-5 h-5" />
                 </button>
                 <button
                   onClick={() => setViewMode('list')}
                   className={`p-2 rounded-lg ${
                     viewMode === 'list'
                       ? 'bg-blue-100 text-blue-600'
                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                   }`}
                 >
                   <List className="w-5 h-5" />
                 </button>
               </div>
             </div>
           </div>
   
           {/* Liste des éléments */}
           {filteredItems.length === 0 ? (
             <div className="bg-white rounded-xl shadow-lg p-12 text-center">
               <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
               <h3 className="text-xl font-semibold text-gray-700 mb-2">Vous n'avez pas encore de favoris</h3>
               <p className="text-gray-500 mb-6 max-w-md mx-auto">
                 Ajoutez des services à vos favoris pour les retrouver facilement et les réserver quand vous en avez besoin.
               </p>
               <button
                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
               >
                 <Search className="w-5 h-5 mr-2" />
                 Explorer les services
               </button>
             </div>
           ) : (
             <div className={`grid gap-6 ${
               viewMode === 'grid' 
                 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                 : 'grid-cols-1'
             }`}>
               <AnimatePresence>
                 {filteredItems.map(item => (
                   <FavoriteItem
                     key={item.id}
                     item={item}
                     viewMode={viewMode}
                     onRemove={handleRemoveItem}
                     onAddToCart={handleAddToCart}
                     onView={handleViewItem}
                   />
                 ))}
               </AnimatePresence>
             </div>
           )}
         </div>
   
         {/* Vue détaillée */}
         <AnimatePresence>
           {selectedItem && (
             <ItemDetailView
               item={selectedItem}
               onClose={() => setSelectedItem(null)}
               onAddToCart={handleAddToCart}
               onRemoveFavorite={handleRemoveItem}
             />
           )}
         </AnimatePresence>
   
         {/* Notification d'ajout au panier */}
         <AnimatePresence>
           {cartNotification && (
             <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 50 }}
               className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-xl shadow-lg max-w-md"
             >
               <div className="flex items-start">
                 <CheckCircleOutlined className="w-6 h-6 mr-3 flex-shrink-0" />
                 <div>
                   <p className="font-medium">Ajouté au panier avec succès !</p>
                   <p className="text-sm text-green-100 mt-1">
                     {cartNotification.quantity}x {cartNotification.item.name}
                   </p>
                 </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>
       </div> 
  );
};

export default FavoritesManagement;
