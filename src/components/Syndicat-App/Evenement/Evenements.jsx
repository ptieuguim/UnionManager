// OBSOLÈTE : Ce fichier a été migré vers Evenements.tsx (TypeScript, Next.js). Merci d'utiliser exclusivement la version .tsx.
// À SUPPRIMER APRÈS VALIDATION DE LA MIGRATION.

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, CalendarDays, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/services/AxiosConfig';
import {
    formatEventFromBackend,
    formatEventForBackend,
    parseApiResponseData,
   getCurrentUserId as utilGetCurrentUserId,     // Renommer pour éviter conflit avec l'état
    getCurrentUserInfo as utilGetCurrentUserInfo, 
} from '@/utils/dataFormatUtils';
import { saveEventsToLocalStorage, getEventsFromLocalStorage } from '@/services/EventService';

import { EventCard } from './EventCard';
import { EventFormModal } from './EventFormModal';

export const Evenements = () => {
    const { t } = useTranslation();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // États pour la modale de création/modification
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null); // null pour création, objet event pour modification
   // Utilisateur courant (stocké dans l'état pour être passé facilement)
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    
        // État pour le chargement spécifique à l'action de participation
    const [participationState, setParticipationState] = useState({ eventId: null, loading: false });

    useEffect(() => {
        setCurrentUserId(utilGetCurrentUserId());
        setCurrentUserInfo(utilGetCurrentUserInfo());
    }, []);
    
    // Fonction pour charger les événements
    const loadEvents = useCallback(async (showToast = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/local-api/synd/evenements');

            if (response.status === 200 && response.data && response.data.data) {
               
                const apiEventsRaw = parseApiResponseData(response.data.data);
                if (Array.isArray(apiEventsRaw)) {

                    // Tri par date de début la plus récente en premier
                    const formattedEvents = apiEventsRaw.map(formatEventFromBackend).filter(e => e !== null).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
                    setEvents(formattedEvents);
                   
                        if (showToast) toast.success(t('evenements_charges_succes', 'Événements chargés avec succès !'));
                } else {
                    console.error("Les données d'événements reçues ne sont pas un tableau:", apiEventsRaw);
                    const errMessage = t('erreur_format_donnees_evenements', 'Format de données incorrect.');
                    setError(errMessage);
                    setEvents(getEventsFromLocalStorage().sort((a,b) => new Date(b.startDate) - new Date(a.startDate)) || []);
                }
            } else {
                const errorMessage = response.data?.text || t('erreur_recuperation_evenements', 'Impossible de récupérer les événements');
                setError(errorMessage);
               // toast.error(errorMessage);
                setEvents(getEventsFromLocalStorage().sort((a,b) => new Date(b.startDate) - new Date(a.startDate)) || []);
            }
        } catch (err) {
            console.error("Erreur lors du chargement des événements:", err);
             const errorMessage = err.response?.data?.text || err.message || t('erreur_chargement_evenements_connexion', 'Erreur chargement. Vérifiez connexion.');
            setError(errorMessage);
            // toast.error(errorMessage);
            setEvents(getEventsFromLocalStorage().sort((a,b) => new Date(b.startDate) - new Date(a.startDate)) || []);
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    // Logique pour sauvegarder dans le localStorage quand `events` change (après le chargement initial)
    useEffect(() => {
        if (!isLoading) {
            saveEventsToLocalStorage(events);
        }
    }, [events, isLoading]);

    const handleOpenCreateModal = () => {
        setEditingEvent(null); // Assure qu'on est en mode création
        setShowEventModal(true);
    };

    const handleOpenEditModal = (eventToEdit) => {
        setEditingEvent(eventToEdit);
        setShowEventModal(true);
    };

    const handleCloseModal = () => {
        setShowEventModal(false);
        setEditingEvent(null);
    };

    const handleSubmitEvent = async (formDataFromModel) => {
        setIsSubmitting(true);
           const isEditing = editingEvent && editingEvent.id;
        const loadingToastId = toast.loading(
            isEditing ? t('modification_evenement_cours', 'Modification...') : t('creation_evenement_cours', 'Création...')
        );

        if (!currentUserId) {
            toast.error(t('utilisateur_non_identifie_evenement', 'Utilisateur non identifié. Veuillez vous connecter.'), { id: loadingToastId });
            setIsSubmitting(false);
            return;
        }

        const payload = formatEventForBackend(formDataFromModel, currentUserId, currentUserInfo);

        try {
            let response;
            if (editingEvent) {
                response = await apiClient.put(`/local-api/synd/evenements/${editingEvent.id}`, payload);
            } else {
                response = await apiClient.post('/local-api/synd/evenements', payload);
            }

            if ((response.status === 200 || response.status === 201) && response.data && response.data.data) {
                const savedEventRaw = parseApiResponseData(response.data.data);
                const formattedSavedEvent = formatEventFromBackend(savedEventRaw);
                
                if (formattedSavedEvent) {
                    if (editingEvent ) {
                        setEvents(prevEvents => prevEvents.map(e => e.id === formattedSavedEvent.id ? formattedSavedEvent : e).sort((a,b) => new Date(b.startDate) - new Date(a.startDate)));
                        toast.success(t('evenement_modifie_succes', 'Événement modifié avec succès !'), { id: loadingToastId });
                    } else {
                        setEvents(prevEvents => [formattedSavedEvent, ...prevEvents].sort((a,b) => new Date(b.startDate) - new Date(a.startDate)));
                        toast.success(t('evenement_cree_succes', 'Événement créé avec succès !'), { id: loadingToastId });
                    }
                    handleCloseModal();
                } else {
                       // Erreur si le formatage post-réception échoue
                     throw new Error(t('erreur_formatage_reponse_evenement', 'Format de réponse invalide du serveur.'));
                }
            } else {
                  // Erreur si la réponse du serveur n'est pas 200/201 ou si data/data.data est manquant
                throw new Error(response.data?.text || t('erreur_sauvegarde_evenement_serveur', 'Erreur serveur lors de la sauvegarde de l\'événement.'));
            }
        } catch (err) {
            console.error("Erreur lors de la soumission de l'événement:", err);
                     let errorMessage = err.response?.data?.text || err.message || t('erreur_inconnue_sauvegarde_evenement', 'Erreur inconnue.');
            // Affiner le message d'erreur si possible (ex: erreurs de validation du backend)
            if (err.response?.status === 400 && err.response?.data?.data) {
                // Si le backend renvoie des détails de validation
                // const validationErrors = parseApiResponseData(err.response.data.data);
                // Pourrait être utilisé pour afficher des erreurs plus spécifiques
                errorMessage = err.response.data.text || "Erreur de validation.";
            }
            toast.error(errorMessage, { id: loadingToastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm(t('confirmation_suppression_evenement', 'Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.'))) {
            return;
        }
        const loadingToastId = toast.loading(t('suppression_evenement_cours', 'Suppression de l\'événement...'));
        const originalEvents = [...events]; // Pour rollback

        // Optimistic update
        setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
               try {
            const response = await apiClient.delete(`/local-api/synd/evenements/${eventId}`);
            if (response.status === 200 || response.status === 204) { // 204 No Content est aussi un succès pour DELETE
                toast.success(t('evenement_supprime_succes', 'Événement supprimé !'), { id: loadingToastId });
                // La sauvegarde localStorage se fera via le useEffect sur `events`
            } else {
                throw new Error(response.data?.text || t('erreur_suppression_evenement_serveur', 'Erreur serveur suppression.'));
            }
        } catch (err) {
            console.error("Erreur lors de la suppression de l'événement:", err);
            toast.error(err.response?.data?.text || err.message || t('erreur_suppression_evenement', 'Impossible de supprimer.'), { id: loadingToastId });
            setEvents(originalEvents); // Rollback
        }
    };

        // Logique pour la participation, centralisée et utilisant apiClient
    const handleParticipateToggle = useCallback(async (eventId) => {
        if (!currentUserId || !currentUserInfo) {
            toast.error(t('connectez_vous_pour_participer', 'Connectez-vous pour participer.'));
            return;
        }

        const eventToUpdate = events.find(e => e.id === eventId);
        if (!eventToUpdate) {
            console.error("Événement non trouvé pour participation:", eventId);
            toast.error(t('erreur_evenement_non_trouve', 'Événement non trouvé.'));
            return;
        }

        const isCurrentlyParticipating = eventToUpdate.participants?.some(p => p.id === currentUserId) || false;
        
        setParticipationState({ eventId, loading: true }); // Indiquer le chargement pour cet eventId
        const originalEvents = [...events]; // Pour rollback optimiste si l'API échoue

        try {
            let response;
            let successMessage;
            let updatedEventDataFromApi;

            if (isCurrentlyParticipating) {
                response = await apiClient.post(`/local-api/synd/evenements/${eventId}/unsubscribe`, { userId: currentUserId });
                successMessage = t('desinscription_evenement_succes', 'Vous ne participez plus.');
            } else {
                response = await apiClient.post(`/local-api/synd/evenements/${eventId}/subscribe`, { userId: currentUserId, name: currentUserInfo.name });
                successMessage = t('inscription_evenement_succes', 'Participation enregistrée !');
            }
            
            if (response.status === 200 ) { // Supposons que 200 est toujours succès
                if (response.data && response.data.data) { // Si l'API renvoie l'event mis à jour
                    updatedEventDataFromApi = formatEventFromBackend(parseApiResponseData(response.data.data));
                } else { 
                    // Si l'API ne renvoie pas l'event, on le reconstruit localement
                    // Ceci est un update optimiste qui suppose que l'API a bien fait son travail
                    let newParticipantsList;
                    if (isCurrentlyParticipating) { // On se désinscrivait
                        newParticipantsList = eventToUpdate.participants.filter(p => p.id !== currentUserId);
                    } else { // On s'inscrivait
                        newParticipantsList = [...(eventToUpdate.participants || []), { id: currentUserId, name: currentUserInfo.name }];
                    }
                    updatedEventDataFromApi = { ...eventToUpdate, participants: newParticipantsList };
                }

                if (updatedEventDataFromApi) {
                    setEvents(prevEvents =>
                        prevEvents.map(e => (e.id === eventId ? updatedEventDataFromApi : e))
                    );
                    toast.success(successMessage);
                } else {
                     // Normalement, ne devrait pas arriver si formatEventFromBackend est robuste ou si l'update local est fait
                    throw new Error(t('erreur_mise_a_jour_locale_participation', 'Erreur mise à jour locale participation.'));
                }
            } else {
                 throw new Error(response.data?.text || t('erreur_serveur_participation', 'Erreur serveur participation.'));
            }

        } catch (apiError) {
            console.error("Erreur API participation:", apiError);
            toast.error(apiError.message || t('erreur_api_participation', "Erreur mise à jour participation."));
            setEvents(originalEvents); // Rollback en cas d'erreur API
        } finally {
            setParticipationState({ eventId: null, loading: false }); // Réinitialiser l'état de chargement
        }
    }, [events, currentUserId, currentUserInfo, t]);

    return (
         <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('titre_page_evenements', 'Événements')}</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenCreateModal}
                    className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-sm sm:text-base"
                >  <PlusCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {t('bouton_creer_evenement', 'Créer un événement')}
                </motion.button>
            </div>

            {/* Modale pour créer/modifier un événement */} 
            <AnimatePresence>
                {showEventModal && (
                    <EventFormModal
                        isOpen={showEventModal}
                        onClose={handleCloseModal}
                        onSubmit={handleSubmitEvent}
                        eventToEdit={editingEvent}
                        isSubmitting={isSubmitting}
                    />
                )}
            </AnimatePresence>

            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    <p className="ml-4 text-lg text-gray-600">{t('chargement_evenements', 'Chargement des événements...')}</p>
                </div>
            )}

            {!isLoading && error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md text-center">
                    <div className="flex items-center justify-center mb-2">
                        <AlertTriangle className="h-8 w-8 mr-3" />
                        <p className="text-xl font-semibold">{t('erreur_titre', 'Une erreur est survenue')}</p>
                    </div>
                    <p className="text-md">{error}</p>
                    <button 
                        onClick={loadEvents}
                        className='mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200'
                    >
                        {t('bouton_reessayer', 'Réessayer')}
                    </button>
                </div>
            )}

            {!isLoading && !error && events.length === 0 && (
                <div className="text-center py-12">
                    <CalendarDays className="mx-auto h-24 w-24 text-gray-300 mb-6" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t('aucun_evenement_trouve', 'Aucun événement à afficher')}</h2>
                    <p className="text-gray-500 mb-6">{t('description_aucun_evenement', 'Soyez le premier à créer un événement et à rassembler votre communauté !')}</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpenCreateModal}
                        className="flex items-center mx-auto bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        {t('bouton_creer_premier_evenement', 'Créer le premier événement')}
                    </motion.button>
                </div>
            )}

            {!isLoading && !error && events.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {events.map(event => (
                        <EventCard 
                            key={event.id} 
                            event={event} 
                            onEdit={ handleOpenEditModal} 
                            onDelete={ handleDeleteEvent}
                            onParticipateToggle={ handleParticipateToggle} // Passer la fonction
                            currentUserId={currentUserId}
                           isParticipatingLoading={participationState} // Passer l'objet complet
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
