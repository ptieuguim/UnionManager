// MIGRATION : Ce composant a été migré de AnnouncementManagement.jsx vers TypeScript strict. L'ancien fichier doit être supprimé après validation.
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, Plus, Edit, Trash2, Calendar, Clock, Tag, Users,
  Search, Filter, ChevronDown, X, Check, Eye, Share2, MessageCircle,
  ArrowUpRight, Star, AlertCircle, FileText, Download
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  expiryDate: string;
  author: {
    name: string;
    avatar: string;
  };
  views: number;
  likes: number;
  comments: number;
  attachments: { name: string; size: string; type: string }[];
  visibility: string;
  priority: string;
  updatedAt?: string;
}

interface AnnouncementFormProps {
  announcement?: Announcement | null;
  onSubmit: (announcement: Announcement) => void;
  onCancel: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ announcement = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Announcement>({
    id: announcement?.id || '',
    title: announcement?.title || '',
    description: announcement?.description || '',
    category: announcement?.category || 'general',
    createdAt: announcement?.createdAt || '',
    expiryDate: announcement?.expiryDate || '',
    author: announcement?.author || { name: '', avatar: '' },
    views: announcement?.views || 0,
    likes: announcement?.likes || 0,
    comments: announcement?.comments || 0,
    attachments: announcement?.attachments || [],
    visibility: announcement?.visibility || 'all',
    priority: announcement?.priority || 'normal',
  });

  const categories = [
    { value: 'general', label: 'Général' },
    { value: 'service', label: 'Offre de service' },
    { value: 'promotion', label: 'Promotion' },
    { value: 'event', label: 'Événement' },
    { value: 'news', label: 'Actualité' }
  ];

  const priorities = [
    { value: 'low', label: 'Basse', color: 'bg-gray-100 text-gray-800' },
    { value: 'normal', label: 'Normale', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'Haute', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-800' }
  ];

  const visibilityOptions = [
    { value: 'all', label: 'Tous les membres' },
    { value: 'premium', label: 'Membres premium' },
    { value: 'admin', label: 'Administrateurs uniquement' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: announcement?.id || Date.now().toString(),
      createdAt: announcement?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titre de l'annonce
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex: Nouvelle offre de service de transport express"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Décrivez votre annonce en détail..."
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date d'expiration
          </label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Visibilité
          </label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {visibilityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priorité
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {priorities.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pièces jointes
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
              >
                <span>Télécharger un fichier</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
              </label>
              <p className="pl-1">ou glisser-déposer</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, PDF jusqu'à 10MB
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {announcement ? 'Mettre à jour' : 'Publier l\'annonce'}
        </button>
      </div>
    </form>
  );
};

export const AnnouncementManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState<boolean>(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fakeAnnouncements: Announcement[] = [
        {
        id: '1',
        title: 'Nouveau service de transport express',
        description: 'Nous sommes heureux d\'annoncer le lancement de notre nouveau service de transport express qui permettra de livrer vos colis en moins de 24h dans toutes les grandes villes du Cameroun. Ce service est disponible dès maintenant pour tous nos membres à un tarif préférentiel.',
        category: 'service',
        createdAt: '2023-05-15T10:30:00Z',
        expiryDate: '2023-06-15',
        author: {
          name: 'Jean Kouassi',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
        },
        views: 156,
        likes: 42,
        comments: 8,
        attachments: [
          { name: 'tarifs_express.pdf', size: '1.2 MB', type: 'pdf' }
        ],
        visibility: 'all',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Promotion sur les services de logistique',
        description: 'Profitez d\'une réduction de 15% sur tous nos services de logistique pendant le mois de juin. Cette offre est valable pour tous les membres du syndicat et s\'applique à tous les types de marchandises.',
        category: 'promotion',
        createdAt: '2023-05-20T14:45:00Z',
        expiryDate: '2023-06-30',
        author: {
          name: 'Marie Mbarga',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
        },
        views: 98,
        likes: 27,
        comments: 3,
        attachments: [],
        visibility: 'all',
        priority: 'normal'
      },
      {
        id: '3',
        title: 'Formation sur les nouvelles réglementations de transport',
        description: 'Une session de formation sur les nouvelles réglementations de transport sera organisée le 10 juin à notre siège de Douala. La participation est gratuite pour tous les membres du syndicat. Veuillez vous inscrire avant le 5 juin.',
        category: 'event',
        createdAt: '2023-05-25T09:15:00Z',
        expiryDate: '2023-06-10',
        author: {
          name: 'Paul Nkeng',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
        },
        views: 124,
        likes: 35,
        comments: 12,
        attachments: [
          { name: 'programme_formation.pdf', size: '0.8 MB', type: 'pdf' }
        ],
        visibility: 'premium',
        priority: 'normal'
      },
      {
        id: '4',
        title: 'Mise à jour importante des conditions d\'adhésion',
        description: 'Suite à la dernière assemblée générale, les conditions d\'adhésion au syndicat ont été mises à jour. Veuillez consulter le document joint pour plus de détails. Ces changements prendront effet à partir du 1er juillet 2023.',
        category: 'general',
        createdAt: '2023-05-30T16:20:00Z',
        expiryDate: '2023-07-01',
        author: {
          name: 'Sophie Ndongo',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
        },
        views: 210,
        likes: 15,
        comments: 25,
        attachments: [
          { name: 'nouvelles_conditions.pdf', size: '1.5 MB', type: 'pdf' }
        ],
        visibility: 'all',
        priority: 'urgent'
      }
    ];
    setAnnouncements(fakeAnnouncements);
  }, []);

  // Filtrer et trier les annonces
  const filteredAnnouncements = announcements
    .filter(announcement => {
      const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory ? announcement.category === filterCategory : true;
      const matchesPriority = filterPriority ? announcement.priority === filterPriority : true;
      return matchesSearch && matchesCategory && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'views') {
        return sortOrder === 'asc'
          ? a.views - b.views
          : b.views - a.views;
      }
      return 0;
    });

  const handleAddAnnouncement = (newAnnouncement: Announcement) => {
    setAnnouncements([newAnnouncement, ...announcements]);
    setIsAddingAnnouncement(false);
  };

  const handleUpdateAnnouncement = (updatedAnnouncement: Announcement) => {
    setAnnouncements(announcements.map(a =>
      a.id === updatedAnnouncement.id ? updatedAnnouncement : a
    ));
    setEditingAnnouncement(null);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const exportAnnouncements = () => {
    const dataStr = JSON.stringify(announcements, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'announcements.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Basse';
      case 'normal': return 'Normale';
      case 'high': return 'Haute';
      case 'urgent': return 'Urgente';
      default: return 'Normale';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'general': return 'Général';
      case 'service': return 'Offre de service';
      case 'promotion': return 'Promotion';
      case 'event': return 'Événement';
      case 'news': return 'Actualité';
      default: return 'Général';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // ... (le reste du composant, y compris le rendu JSX, reste identique au .jsx, avec typage TS)

  // (Pour la lisibilité, le rendu JSX complet n'est pas recopié ici, mais il est migré tel quel avec typage TS)

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-6">
         <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
             <div>
               <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Annonces</h1>
               <p className="text-gray-600">
                 Créez et gérez vos offres de services et annonces pour les membres
               </p>
             </div>
             <div className="mt-4 md:mt-0">
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setIsAddingAnnouncement(true)}
                 className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center"
               >
                 <Plus className="w-5 h-5 mr-2" />
                 Nouvelle annonce
               </motion.button>
             </div>
           </div>
   
           {/* Filtres et recherche */}
           <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div className="md:col-span-2">
                 <div className="relative">
                   <input
                     type="text"
                     placeholder="Rechercher des annonces..."
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
                   <option value="">Toutes les catégories</option>
                   <option value="general">Général</option>
                   <option value="service">Offre de service</option>
                   <option value="promotion">Promotion</option>
                   <option value="event">Événement</option>
                   <option value="news">Actualité</option>
                 </select>
               </div>
               <div>
                 <select
                   value={filterPriority}
                   onChange={(e) => setFilterPriority(e.target.value)}
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 >
                   <option value="">Toutes les priorités</option>
                   <option value="low">Basse</option>
                   <option value="normal">Normale</option>
                   <option value="high">Haute</option>
                   <option value="urgent">Urgente</option>
                 </select>
               </div>
             </div>
             <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-200">
               <div className="flex items-center space-x-4">
                 <div className="flex items-center">
                   <span className="text-sm text-gray-600 mr-2">Trier par:</span>
                   <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   >
                     <option value="date">Date</option>
                     <option value="title">Titre</option>
                     <option value="views">Vues</option>
                   </select>
                   <button
                     onClick={toggleSortOrder}
                     className="ml-2 p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                   >
                     {sortOrder === 'asc' ? (
                       <ChevronDown className="w-5 h-5" />
                     ) : (
                       <ChevronDown className="w-5 h-5 transform rotate-180" />
                     )}
                   </button>
                 </div>
                 <div className="text-sm text-gray-600">
                   {filteredAnnouncements.length} annonce(s) trouvée(s)
                 </div>
               </div>
               <button
                 onClick={exportAnnouncements}
                 className="mt-2 sm:mt-0 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
               >
                 <Download className="w-4 h-4 mr-2" />
                 Exporter
               </button>
             </div>
           </div>
   
           {/* Liste des annonces */}
           <div className="space-y-6">
             <AnimatePresence>
               {filteredAnnouncements.length === 0 ? (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="bg-white rounded-xl shadow-lg p-12 text-center"
                 >
                   <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                   <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune annonce trouvée</h3>
                   <p className="text-gray-500 mb-6">
                     Aucune annonce ne correspond à vos critères de recherche ou de filtrage.
                   </p>
                   <button
                     onClick={() => {
                       setSearchTerm('');
                       setFilterCategory('');
                       setFilterPriority('');
                     }}
                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                   >
                     Réinitialiser les filtres
                   </button>
                 </motion.div>
               ) : (
                 filteredAnnouncements.map(announcement => (
                   <motion.div
                     key={announcement.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     className="bg-white rounded-xl shadow-lg overflow-hidden"
                   >
                     <div className="p-6">
                       <div className="flex justify-between items-start">
                         <div className="flex items-start space-x-4">
                           <img
                             src={announcement.author.avatar}
                             alt={announcement.author.name}
                             className="w-12 h-12 rounded-full object-cover"
                           />
                           <div>
                             <h3 className="text-xl font-semibold text-gray-800 mb-1">{announcement.title}</h3>
                             <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                               <span className="flex items-center">
                                 <Calendar className="w-4 h-4 mr-1" />
                                 {formatDate(announcement.createdAt)}
                               </span>
                               <span>•</span>
                               <span className="flex items-center">
                                 <Tag className="w-4 h-4 mr-1" />
                                 {getCategoryLabel(announcement.category)}
                               </span>
                               <span>•</span>
                               <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(announcement.priority)}`}>
                                 {getPriorityLabel(announcement.priority)}
                               </span>
                             </div>
                           </div>
                         </div>
                         <div className="flex space-x-2">
                           <motion.button
                             whileHover={{ scale: 1.1 }}
                             whileTap={{ scale: 0.9 }}
                             onClick={() => setViewingAnnouncement(announcement)}
                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                           >
                             <Eye className="w-5 h-5" />
                           </motion.button>
                           <motion.button
                             whileHover={{ scale: 1.1 }}
                             whileTap={{ scale: 0.9 }}
                             onClick={() => setEditingAnnouncement(announcement)}
                             className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full"
                           >
                             <Edit className="w-5 h-5" />
                           </motion.button>
                           <motion.button
                             whileHover={{ scale: 1.1 }}
                             whileTap={{ scale: 0.9 }}
                             onClick={() => handleDeleteAnnouncement(announcement.id)}
                             className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                           >
                             <Trash2 className="w-5 h-5" />
                           </motion.button>
                         </div>
                       </div>
                       
                       <div className="mt-4">
                         <p className="text-gray-600 line-clamp-3">{announcement.description}</p>
                       </div>
                       
                       {announcement.attachments.length > 0 && (
                         <div className="mt-4 flex flex-wrap gap-2">
                           {announcement.attachments.map((attachment, index) => (
                             <div key={index} className="flex items-center px-3 py-1 bg-gray-100 rounded-lg text-sm">
                               <FileText className="w-4 h-4 mr-2 text-blue-600" />
                               <span>{attachment.name}</span>
                             </div>
                           ))}
                         </div>
                       )}
                       
                       <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center">
                         <div className="flex space-x-6">
                           <div className="flex items-center text-gray-500">
                             <Eye className="w-4 h-4 mr-1" />
                             <span>{announcement.views} vues</span>
                           </div>
                           <div className="flex items-center text-gray-500">
                             <Star className="w-4 h-4 mr-1" />
                             <span>{announcement.likes} j'aime</span>
                           </div>
                           <div className="flex items-center text-gray-500">
                             <MessageCircle className="w-4 h-4 mr-1" />
                             <span>{announcement.comments} commentaires</span>
                           </div>
                         </div>
                         <div className="mt-2 sm:mt-0">
                           {announcement.expiryDate && (
                             <div className="flex items-center text-sm">
                               <Clock className="w-4 h-4 mr-1 text-orange-500" />
                               <span>Expire le {formatDate(announcement.expiryDate)}</span>
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 ))
               )}
             </AnimatePresence>
           </div>
         </div>
   
         {/* Modal pour ajouter une annonce */}
         <AnimatePresence>
           {isAddingAnnouncement && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
               onClick={() => setIsAddingAnnouncement(false)}
             >
               <motion.div
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl"
                 onClick={e => e.stopPropagation()}
               >
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold text-gray-800">Nouvelle annonce</h2>
                   <button
                     onClick={() => setIsAddingAnnouncement(false)}
                     className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                   >
                     <X className="w-6 h-6" />
                   </button>
                 </div>
                 <AnnouncementForm
                   onSubmit={handleAddAnnouncement}
                   onCancel={() => setIsAddingAnnouncement(false)}
                 />
               </motion.div>
             </motion.div>
           )}
         </AnimatePresence>
   
         {/* Modal pour éditer une annonce */}
         <AnimatePresence>
           {editingAnnouncement && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
               onClick={() => setEditingAnnouncement(null)}
             >
               <motion.div
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl"
                 onClick={e => e.stopPropagation()}
               >
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold text-gray-800">Modifier l'annonce</h2>
                   <button
                     onClick={() => setEditingAnnouncement(null)}
                     className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                   >
                     <X className="w-6 h-6" />
                   </button>
                 </div>
                 <AnnouncementForm
                   announcement={editingAnnouncement}
                   onSubmit={handleUpdateAnnouncement}
                   onCancel={() => setEditingAnnouncement(null)}
                 />
               </motion.div>
             </motion.div>
           )}
         </AnimatePresence>
   
         {/* Modal pour voir une annonce */}
         <AnimatePresence>
           {viewingAnnouncement && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
               onClick={() => setViewingAnnouncement(null)}
             >
               <motion.div
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
                 onClick={e => e.stopPropagation()}
               >
                 <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center">
                     <div className={`p-2 rounded-full ${getPriorityColor(viewingAnnouncement.priority)}`}>
                       <Megaphone className="w-6 h-6" />
                     </div>
                     <h2 className="text-2xl font-bold text-gray-800 ml-3">Détails de l'annonce</h2>
                   </div>
                   <button
                     onClick={() => setViewingAnnouncement(null)}
                     className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                   >
                     <X className="w-6 h-6" />
                   </button>
                 </div>
                 
                 <div className="space-y-6">
                   <div>
                     <h3 className="text-2xl font-bold text-gray-800 mb-2">{viewingAnnouncement.title}</h3>
                     <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                       <span className="flex items-center">
                         <Calendar className="w-4 h-4 mr-1" />
                         Publié le {formatDate(viewingAnnouncement.createdAt)}
                       </span>
                       <span className="flex items-center">
                         <Tag className="w-4 h-4 mr-1" />
                         {getCategoryLabel(viewingAnnouncement.category)}
                       </span>
                       <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(viewingAnnouncement.priority)}`}>
                         {getPriorityLabel(viewingAnnouncement.priority)}
                       </span>
                     </div>
                   </div>
                   
                   <div className="flex items-start space-x-4">
                     <img
                       src={viewingAnnouncement.author.avatar}
                       alt={viewingAnnouncement.author.name}
                       className="w-12 h-12 rounded-full object-cover"
                     />
                     <div>
                       <div className="font-medium text-gray-800">{viewingAnnouncement.author.name}</div>
                       <div className="text-sm text-gray-500">Auteur</div>
                     </div>
                   </div>
                   
                   <div className="bg-gray-50 p-6 rounded-xl">
                     <p className="text-gray-700 whitespace-pre-line">{viewingAnnouncement.description}</p>
                   </div>
                   
                   {viewingAnnouncement.attachments.length > 0 && (
                     <div>
                       <h4 className="text-lg font-semibold text-gray-800 mb-3">Pièces jointes</h4>
                       <div className="space-y-2">
                         {viewingAnnouncement.attachments.map((attachment, index) => (
                           <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                             <FileText className="w-5 h-5 text-blue-600 mr-3" />
                             <div className="flex-1">
                               <div className="font-medium text-gray-800">{attachment.name}</div>
                               <div className="text-sm text-gray-500">{attachment.size}</div>
                             </div>
                             <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                               <Download className="w-5 h-5" />
                             </button>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                   
                   <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-200">
                     <div className="flex space-x-6">
                       <div className="flex items-center text-gray-500">
                         <Eye className="w-5 h-5 mr-1" />
                         <span>{viewingAnnouncement.views} vues</span>
                       </div>
                       <div className="flex items-center text-gray-500">
                         <Star className="w-5 h-5 mr-1" />
                         <span>{viewingAnnouncement.likes} j'aime</span>
                       </div>
                       <div className="flex items-center text-gray-500">
                         <MessageCircle className="w-5 h-5 mr-1" />
                         <span>{viewingAnnouncement.comments} commentaires</span>
                       </div>
                     </div>
                     <div className="mt-4 sm:mt-0 flex space-x-3">
                       <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center">
                         <Share2 className="w-4 h-4 mr-2" />
                         Partager
                       </button>
                       <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center">
                         <ArrowUpRight className="w-4 h-4 mr-2" />
                         Promouvoir
                       </button>
                     </div>
                   </div>
                   
                   {viewingAnnouncement.expiryDate && (
                     <div className="flex items-center p-4 bg-orange-50 text-orange-800 rounded-lg">
                       <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                       <div>
                         <div className="font-medium">Date d'expiration</div>
                         <div className="text-sm">Cette annonce expirera le {formatDate(viewingAnnouncement.expiryDate)}</div>
                       </div>
                     </div>
                   )}
                 </div>
               </motion.div>
             </motion.div>
           )}
         </AnimatePresence>
       </div>
  );
};

export default AnnouncementManagement;
