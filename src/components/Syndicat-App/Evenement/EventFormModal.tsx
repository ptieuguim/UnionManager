'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Type, FileText, Save, Loader2, UploadCloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { formatDateForInput } from '@/utils/dataFormatUtils';

// Types TypeScript pour Next.js
interface Event {
    id?: string | number;
    title: string;
    description: string;
    startDate: string | Date;
    endDate: string | Date;
    location: string;
    images?: string[];
    category?: string;
    isPublic?: boolean;
    notifyMembers?: boolean;
}

interface EventFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData | Event) => void;
    eventToEdit?: Event | null;
    isSubmitting: boolean;
}

interface ModalVariants {
    hidden: { opacity: number; scale: number };
    visible: { opacity: number; scale: number };
    exit: { opacity: number; scale: number };
}

interface BackdropVariants {
    hidden: { opacity: number };
    visible: { opacity: number };
    exit: { opacity: number };
}

export const EventFormModal: React.FC<EventFormModalProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    eventToEdit = null, 
    isSubmitting 
}) => {
    const { t } = useTranslation();
    
    // États du formulaire
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [category, setCategory] = useState<string>('Général');
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [notifyMembers, setNotifyMembers] = useState<boolean>(true);
    const [mainImagePreview, setMainImagePreview] = useState<string>('');

    // Effet pour initialiser/réinitialiser le formulaire
    useEffect(() => {
        if (isOpen) {
            if (eventToEdit) {
                // Mode édition - remplir avec les données existantes
                setTitle(eventToEdit.title || '');
                setDescription(eventToEdit.description || '');
                
                // Formatage des dates pour les inputs datetime-local
                setStartDate(eventToEdit.startDate ? formatDateForInput(eventToEdit.startDate) : '');
                setEndDate(eventToEdit.endDate ? formatDateForInput(eventToEdit.endDate) : '');
                
                setLocation(eventToEdit.location || '');
                setImageFile(null);
                setMainImagePreview(eventToEdit.images && eventToEdit.images.length > 0 ? eventToEdit.images[0] : '');
                setCategory(eventToEdit.category || 'Général');
                setIsPublic(eventToEdit.isPublic !== undefined ? eventToEdit.isPublic : true);
                setNotifyMembers(eventToEdit.notifyMembers !== undefined ? eventToEdit.notifyMembers : true);
            } else {
                // Mode création - formulaire vide
                resetForm();
            }
        } else {
            // Nettoyage optionnel quand la modale est fermée
            setImageFile(null);
            setMainImagePreview('');
        }
    }, [eventToEdit, isOpen]);

    // Fonction pour réinitialiser le formulaire
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setLocation('');
        setImageFile(null);
        setMainImagePreview('');
        setCategory('Général');
        setIsPublic(true);
        setNotifyMembers(true);
    };

    // Gestion de l'upload d'image
    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validation du type de fichier
            if (!file.type.startsWith('image/')) {
                toast.error(t('erreur_type_fichier', 'Veuillez sélectionner un fichier image.'));
                return;
            }

            // Validation de la taille (ex: 5MB max)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                toast.error(t('erreur_taille_fichier', 'Le fichier est trop volumineux (5MB max).'));
                return;
            }

            setImageFile(file);
            setMainImagePreview(URL.createObjectURL(file));
        } else {
            // Gestion de la désélection
            if (eventToEdit && eventToEdit.images && eventToEdit.images.length > 0) {
                setMainImagePreview(eventToEdit.images[0]);
            } else {
                setMainImagePreview('');
            }
            setImageFile(null);
        }
    };

    // Validation du formulaire
    const validateForm = (): boolean => {
        if (!title.trim()) {
            toast.error(t('erreur_titre_requis', 'Le titre est requis.'));
            return false;
        }

        if (!startDate || !endDate) {
            toast.error(t('erreur_dates_requises', 'Les dates de début et fin sont requises.'));
            return false;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start >= end) {
            toast.error(t('erreur_date_fin_anterieure_debut', 'La date de fin doit être après le début.'));
            return false;
        }

        // Validation que la date n'est pas dans le passé (pour création uniquement)
        if (!eventToEdit && start < new Date()) {
            toast.error(t('erreur_date_passee', 'La date de début ne peut pas être dans le passé.'));
            return false;
        }

        return true;
    };

    // Soumission du formulaire
    const handleSubmitInternal = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (isSubmitting) return;

        if (!validateForm()) return;

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Construction des données selon le type d'envoi souhaité
        if (imageFile) {
            // Si un fichier est présent, utiliser FormData
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('startDate', start.toISOString());
            formData.append('endDate', end.toISOString());
            formData.append('location', location);
            formData.append('category', category);
            formData.append('isPublic', isPublic.toString());
            formData.append('notifyMembers', notifyMembers.toString());
            formData.append('image', imageFile);

            // Ajouter l'ID si c'est une modification
            if (eventToEdit?.id) {
                formData.append('id', eventToEdit.id.toString());
            }

            onSubmit(formData);
        } else {
            // Si pas de fichier, utiliser un objet simple
            const eventData: Event = {
                title,
                description,
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                location,
                category,
                isPublic,
                notifyMembers,
                ...(eventToEdit?.id && { id: eventToEdit.id }),
                ...(eventToEdit?.images && { images: eventToEdit.images })
            };

            onSubmit(eventData);
        }
    };

    // Variants pour les animations
    const modalVariants: ModalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
    };

    const backdropVariants: BackdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    // Nettoyage de l'URL d'objet lors du démontage
    useEffect(() => {
        return () => {
            if (mainImagePreview && mainImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(mainImagePreview);
            }
        };
    }, [mainImagePreview]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto relative"
                        onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
                    >
                        <button 
                            onClick={onClose} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            aria-label={t('fermer_modale', 'Fermer')}
                            disabled={isSubmitting}
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            {eventToEdit 
                                ? t('modifier_evenement_titre', 'Modifier l\'événement') 
                                : t('creer_evenement_titre', 'Créer un nouvel événement')
                            }
                        </h2>
                        
                        <form onSubmit={handleSubmitInternal} className="space-y-5">
                            {/* Titre */}
                            <div>
                                <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-1">
                                    <Type className="inline-block w-4 h-4 mr-1.5 text-blue-500" />
                                    {t('titre_label', 'Titre')} <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="event-title" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    placeholder={t('titre_placeholder', 'Ex: Assemblée Générale Annuelle')}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-1">
                                    <FileText className="inline-block w-4 h-4 mr-1.5 text-blue-500" />
                                    {t('description_label', 'Description')}
                                </label>
                                <textarea 
                                    id="event-description" 
                                    rows={4} 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    placeholder={t('description_placeholder', 'Décrivez votre événement...')}
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="event-start-date" className="block text-sm font-medium text-gray-700 mb-1">
                                        <Calendar className="inline-block w-4 h-4 mr-1.5 text-blue-500" />
                                        {t('date_debut_label', 'Date de début')} <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="datetime-local" 
                                        id="event-start-date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="event-end-date" className="block text-sm font-medium text-gray-700 mb-1">
                                        <Calendar className="inline-block w-4 h-4 mr-1.5 text-blue-500" />
                                        {t('date_fin_label', 'Date de fin')} <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="datetime-local" 
                                        id="event-end-date" 
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Lieu */}
                            <div>
                                <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 mb-1">
                                    <MapPin className="inline-block w-4 h-4 mr-1.5 text-blue-500" />
                                    {t('lieu_label', 'Lieu')}
                                </label>
                                <input 
                                    type="text" 
                                    id="event-location" 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    placeholder={t('lieu_placeholder', 'Ex: Salle de conférence, 123 Rue du Syndicat')}
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Upload d'image */}
                            <div>
                                <label htmlFor="event-image-file" className="block text-sm font-medium text-gray-700 mb-1">
                                    <UploadCloud className="inline-block w-4 h-4 mr-1.5 text-blue-500" />
                                    {t('image_fichier_label', 'Image de l\'événement')}
                                </label>
                                <input 
                                    type="file" 
                                    id="event-image-file" 
                                    accept="image/*"
                                    onChange={handleImageFileChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    disabled={isSubmitting}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    {t('image_aide', 'Formats acceptés: JPG, PNG, GIF. Taille max: 5MB')}
                                </p>
                                
                                {/* Prévisualisation de l'image */}
                                {mainImagePreview && (
                                    <div className="mt-3">
                                        <p className="text-xs text-gray-500 mb-1">
                                            {t('apercu_label', 'Aperçu :')}
                                        </p>
                                        <div className="relative inline-block">
                                            <img 
                                                src={mainImagePreview} 
                                                alt={t('apercu_image_alt', 'Aperçu de l\'image sélectionnée')} 
                                                className="max-h-48 rounded-md object-contain border border-gray-200" 
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMainImagePreview('');
                                                    setImageFile(null);
                                                    // Reset l'input file
                                                    const fileInput = document.getElementById('event-image-file') as HTMLInputElement;
                                                    if (fileInput) fileInput.value = '';
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                disabled={isSubmitting}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Champs optionnels - Catégorie */}
                            <div>
                                <label htmlFor="event-category" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('categorie_label', 'Catégorie')}
                                </label>
                                <select
                                    id="event-category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    disabled={isSubmitting}
                                >
                                    <option value="Général">{t('categorie_general', 'Général')}</option>
                                    <option value="Réunion">{t('categorie_reunion', 'Réunion')}</option>
                                    <option value="Formation">{t('categorie_formation', 'Formation')}</option>
                                    <option value="Social">{t('categorie_social', 'Événement social')}</option>
                                    <option value="Vote">{t('categorie_vote', 'Vote/Élection')}</option>
                                </select>
                            </div>

                            {/* Options avancées */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">
                                        {t('visibilite_publique', 'Événement public')}
                                    </label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox"
                                            checked={isPublic}
                                            onChange={(e) => setIsPublic(e.target.checked)}
                                            className="sr-only peer"
                                            disabled={isSubmitting}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">
                                        {t('notifier_membres', 'Notifier les membres')}
                                    </label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox"
                                            checked={notifyMembers}
                                            onChange={(e) => setNotifyMembers(e.target.checked)}
                                            className="sr-only peer"
                                            disabled={isSubmitting}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex justify-end items-center pt-4 space-x-3">
                                <motion.button
                                    type="button"
                                    onClick={onClose}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
                                    disabled={isSubmitting}
                                >
                                    {t('annuler_bouton', 'Annuler')}
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                                    className={`flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                            {t('sauvegarde_en_cours', 'Sauvegarde...')}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5 mr-2" />
                                            {eventToEdit 
                                                ? t('modifier_bouton', 'Modifier') 
                                                : t('creer_bouton', 'Créer')
                                            }
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EventFormModal;