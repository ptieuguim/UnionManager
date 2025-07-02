'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Calendar, Clock, MapPin, Upload, Image as ImageIcon, 
  Users, Camera, Send, Tag, Globe, Bell, Shield, 
  Sparkles, Palette, Zap
} from 'lucide-react';

// Types TypeScript pour Next.js
interface EventFormData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  images: string[];
  isPublic: boolean;
  notifyMembers: boolean;
  category: string;
}

interface FormErrors {
  [key: string]: string | null;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: any) => void;
}

interface TabButtonProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    images: [],
    isPublic: true,
    notifyMembers: true,
    category: 'meeting'
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('details');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const categories: Category[] = [
    { id: 'meeting', label: 'Réunion', icon: <Users className="w-5 h-5" />, color: 'bg-blue-500' },
    { id: 'training', label: 'Formation', icon: <Shield className="w-5 h-5" />, color: 'bg-green-500' },
    { id: 'social', label: 'Événement social', icon: <Sparkles className="w-5 h-5" />, color: 'bg-purple-500' },
    { id: 'vote', label: 'Vote/Élection', icon: <Tag className="w-5 h-5" />, color: 'bg-orange-500' },
    { id: 'other', label: 'Autre', icon: <Globe className="w-5 h-5" />, color: 'bg-gray-500' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData({
          ...formData,
          images: [...formData.images, result]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages
    });
    if (index === 0) {
      setPreviewImage(newImages.length > 0 ? newImages[0] : null);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.title.trim()) errors.title = "Le titre est requis";
    if (!formData.description.trim()) errors.description = "La description est requise";
    if (!formData.location.trim()) errors.location = "Le lieu est requis";
    if (!formData.startDate) errors.startDate = "La date de début est requise";
    if (!formData.startTime) errors.startTime = "L'heure de début est requise";
    if (!formData.endDate) errors.endDate = "La date de fin est requise";
    if (!formData.endTime) errors.endTime = "L'heure de fin est requise";
    
    // Check if end date/time is after start date/time
    if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      if (endDateTime <= startDateTime) {
        errors.endDate = "La date/heure de fin doit être après la date/heure de début";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const newEvent = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      location: formData.location,
      startDate: new Date(`${formData.startDate}T${formData.startTime}`),
      endDate: new Date(`${formData.endDate}T${formData.endTime}`),
      author: {
        name: "Vous",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
      },
      images: formData.images.length > 0 ? formData.images : null,
      isUpcoming: true,
      participants: [],
      category: formData.category,
      isPublic: formData.isPublic,
      notifyMembers: formData.notifyMembers
    };
    
    onSubmit(newEvent);
    onClose();
  };

  const TabButton: React.FC<TabButtonProps> = ({ id, label, icon, active }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </motion.button>
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-t-2xl relative">
          <h2 className="text-2xl font-bold text-white">Créer un nouvel événement</h2>
          <p className="text-blue-100 mt-1">Organisez un événement pour les membres de votre syndicat</p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Tabs navigation */}
        <div className="px-6 pt-6 pb-2 border-b">
          <div className="flex space-x-4">
            <TabButton 
              id="details" 
              label="Détails" 
              icon={<Calendar className="w-5 h-5" />} 
              active={activeTab === 'details'} 
            />
            <TabButton 
              id="media" 
              label="Médias" 
              icon={<ImageIcon className="w-5 h-5" />} 
              active={activeTab === 'media'} 
            />
            <TabButton 
              id="settings" 
              label="Paramètres" 
              icon={<Bell className="w-5 h-5" />} 
              active={activeTab === 'settings'} 
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l&apos;événement <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    formErrors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  } focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="Ex: Assemblée Générale Annuelle"
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    formErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  } focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="Décrivez votre événement en détail..."
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie d&apos;événement
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`cursor-pointer p-3 rounded-xl flex flex-col items-center justify-center text-center ${
                        formData.category === category.id 
                          ? `${category.color} bg-opacity-20 border-2 border-blue-500` 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => setFormData({...formData, category: category.id})}
                    >
                      <div className={`p-2 rounded-full ${formData.category === category.id ? category.color : 'bg-white'} mb-2`}>
                        {category.icon}
                      </div>
                      <span className="text-sm font-medium">{category.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lieu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                      formErrors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                    } focus:outline-none focus:ring-2 transition-colors`}
                    placeholder="Ex: Salle de conférence principale, 123 Rue du Syndicat"
                  />
                </div>
                {formErrors.location && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.location}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                        formErrors.startDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                      } focus:outline-none focus:ring-2 transition-colors`}
                    />
                  </div>
                  {formErrors.startDate && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.startDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure de début <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                        formErrors.startTime ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                      } focus:outline-none focus:ring-2 transition-colors`}
                    />
                  </div>
                  {formErrors.startTime && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.startTime}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                        formErrors.endDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                      } focus:outline-none focus:ring-2 transition-colors`}
                    />
                  </div>
                  {formErrors.endDate && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.endDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure de fin <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                        formErrors.endTime ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                      } focus:outline-none focus:ring-2 transition-colors`}
                    />
                  </div>
                  {formErrors.endTime && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.endTime}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de couverture
                </label>
                <div 
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors cursor-pointer" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-1 text-center">
                    {previewImage ? (
                      <div className="relative">
                        <img src={previewImage} alt="Preview" className="mx-auto h-64 w-full object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(null);
                            setFormData({...formData, images: []});
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col items-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-1 text-sm text-gray-600">
                            <span className="font-medium text-blue-600 hover:text-blue-500">
                              Cliquez pour télécharger
                            </span> ou glissez-déposez
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG jusqu&apos;à 10MB</p>
                        </div>
                        <div className="flex justify-center mt-4 space-x-2">
                          <button
                            type="button"
                            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg flex items-center hover:bg-blue-200 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Parcourir
                          </button>
                          <button
                            type="button"
                            className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg flex items-center hover:bg-purple-200 transition-colors"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Prendre une photo
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              {formData.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images téléchargées ({formData.images.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden h-32">
                        <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thème visuel
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {['blue', 'green', 'purple', 'orange', 'red', 'pink', 'teal', 'indigo'].map((color) => (
                    <motion.div
                      key={color}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`h-12 rounded-lg cursor-pointer bg-${color}-500 flex items-center justify-center`}
                    >
                      <Palette className="w-6 h-6 text-white" />
                    </motion.div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Choisissez un thème de couleur pour votre événement (optionnel)
                </p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Options avancées
                </h3>
                <p className="text-sm text-blue-600 mb-4">
                  Personnalisez les paramètres de votre événement pour une meilleure expérience
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-700">Visibilité publique</label>
                      <p className="text-sm text-gray-500">Rendre l&apos;événement visible pour tous</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-700">Notification aux membres</label>
                      <p className="text-sm text-gray-500">Envoyer une notification à tous les membres</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="notifyMembers"
                        checked={formData.notifyMembers}
                        onChange={handleChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-700">Inscription requise</label>
                      <p className="text-sm text-gray-500">Les membres doivent s&apos;inscrire pour participer</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-700">Rappels automatiques</label>
                      <p className="text-sm text-gray-500">Envoyer des rappels avant l&apos;événement</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Invitations
                </h3>
                <p className="text-sm text-purple-600 mb-4">
                  Gérez qui peut participer à votre événement
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Limite de participants
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Illimité"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-200 focus:outline-none focus:ring-2 transition-colors"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Laissez vide pour un nombre illimité de participants
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invitations spécifiques
                    </label>
                    <textarea
                      placeholder="Entrez les emails des personnes à inviter, séparés par des virgules"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-200 focus:outline-none focus:ring-2 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center"
            >
              <Send className="w-5 h-5 mr-2" />
              Créer l&apos;événement
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EventForm;