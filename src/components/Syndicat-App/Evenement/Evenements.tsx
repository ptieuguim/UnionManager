'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, CalendarDays, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
// Import apiClient supprimé car nous utilisons maintenant des fonctions locales
import {
    // Imports supprimés car nous n'utilisons plus les fonctions de formatage pour l'API
    // mais celles de notre service local
    getCurrentUserId as utilGetCurrentUserId,
    getCurrentUserInfo as utilGetCurrentUserInfo, 
} from '@/utils/dataFormatUtils';
import { saveEventsToLocalStorage, getEventsFromLocalStorage, Event as StoredEvent } from '@/services/EventService';

import { EventCard } from './EventCard';
import EventFormModal  from './EventFormModal';

// Types TypeScript pour Next.js
interface Participant {
    id: string;
    name: string;
}

interface Event {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    participants?: Participant[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

interface UserInfo {
    id: string;
    name: string;
    email?: string;
}

interface ParticipationState {
    eventId: string | number | undefined;
    loading: boolean;
}

interface ApiResponse<T> {
    status: number;
    data: {
        data: T;
        text?: string;
    };
}

interface EventFormData {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
}

// This interface matches the props accepted by the EventCard component
// The ESLint rule is disabled because this interface is exported and used by the imported EventCard component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface EventCardProps {
    event: Event;
    onEdit: (event: Event) => void;
    onDelete: (eventId: string) => void;
    onParticipateToggle: (eventId: string) => void;
    currentUserId: string;
    isParticipatingLoading: ParticipationState;
}

// Fonctions de conversion entre les types Event et StoredEvent
const convertEventToStoredEvent = (event: Event): StoredEvent => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.startDate, // Mapping startDate vers date
    location: event.location,
    participants: event.participants || [],
    createdBy: event.createdBy,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt
});

const convertStoredEventToEvent = (storedEvent: StoredEvent): Event => ({
    id: storedEvent.id,
    title: storedEvent.title,
    description: storedEvent.description ?? "",
    startDate: storedEvent.date, // Mapping date vers startDate
    endDate: storedEvent.date, // Par défaut, même valeur
    location: storedEvent.location,
    participants: storedEvent.participants,
    createdBy: storedEvent.createdBy,
    createdAt: storedEvent.createdAt,
    updatedAt: storedEvent.updatedAt
});

// Fonctions helper pour localStorage
const getLocalEvents = (): Event[] => {
    const storedEvents = getEventsFromLocalStorage();
    return storedEvents.map(convertStoredEventToEvent);
};

const saveLocalEvents = (events: Event[]): void => {
    const storedEvents = events.map(convertEventToStoredEvent);
    saveEventsToLocalStorage(storedEvents);
};

export const Evenements = () => {
    const { t } = useTranslation();
    
    // États pour les événements
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // Référence pour suivre l'état précédent des événements (pour éviter les boucles infinies)
    const previousEventsRef = useRef<string>('');

    // États pour la modale de création/modification
    const [showEventModal, setShowEventModal] = useState<boolean>(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    
    // Utilisateur courant
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [currentUserInfo, setCurrentUserInfo] = useState<UserInfo | null>(null);
    
    // État pour le chargement spécifique à l'action de participation
    const [participationState, setParticipationState] = useState<ParticipationState>({ 
        eventId: undefined, 
        loading: false 
    });
    
    // Charger les données de l'utilisateur courant
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userId = utilGetCurrentUserId();
                if (userId) {
                    setCurrentUserId(userId);
                    const userInfo = utilGetCurrentUserInfo();
                    if (userInfo && userInfo.name) {
                        // Create user info object with optional email if available
                        const userInfoObject: UserInfo = {
                            id: userId,
                            name: userInfo.name
                        };
                        
                        // Add email if it exists in the user info
                        if ('email' in userInfo && typeof userInfo.email === 'string') {
                            userInfoObject.email = userInfo.email;
                        }
                        
                        setCurrentUserInfo(userInfoObject);
                    } else {
                        setCurrentUserInfo(null);
                    }
                }
            } catch (err) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Error getting user info:', err);
                }
            }
        };
        
        fetchUserInfo();
    }, []);
    

    
    // Fonction pour charger les événements
    const loadEvents = useCallback(async (showToast: boolean = false) => {
        setIsLoading(true);
        setError(null);

        // Variable to determine if we should use API or not
        const useLocalStorage = true; // Force use of localStorage for now to avoid API connection issues
        
        // Nous utilisons toujours le localStorage, alors cette vérification n'est plus nécessaire
        // Dans le futur, si vous souhaitez utiliser l'API, vous pourriez utiliser ce code commenté
        /*
        if (process.env.NODE_ENV === 'development' && !useLocalStorage) {
            // In development, first check if the API endpoint is available
            try {
                // Use a HEAD request to check API availability without fetching data
                await apiClient.head('/local-api/synd');
            } catch (e) {
                // API is not available in development, use localStorage instead
                console.info("API not available in development mode, using localStorage instead", e);
            }
        }
        */
        
        // If we're using localStorage instead of the API
        if (useLocalStorage) {
            try {
                const localEvents = getLocalEvents();
                setEvents(localEvents.sort((a: Event, b: Event) => 
                    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                ));
                setIsLoading(false);
                if (showToast) {
                    toast.success(t('evenements_charges_succes', 'Événements chargés depuis le stockage local !'));
                }
                return;
            } catch (localErr) {
                console.error("Erreur lors du chargement des événements locaux:", localErr);
                setError(t('erreur_chargement_evenements_locaux', 'Erreur lors du chargement des événements locaux.'));
                setIsLoading(false);
                return;
            }
        }

        // Continue with API call if we're not using localStorage
        try {
            const response: ApiResponse<Event[]> = await apiClient.get('/local-api/synd/evenements');

            if (response.status === 200 && response.data && response.data.data) {
                const apiEventsRaw = parseApiResponseData(response.data.data);
                if (Array.isArray(apiEventsRaw)) {
                    // Tri par date de début la plus récente en premier
                    const formattedEvents = apiEventsRaw
                        .map(formatEventFromBackend)
                        .filter((e): e is Event => e !== null)
                        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
                    
                    setEvents(formattedEvents);
                   
                    if (showToast) {
                        toast.success(t('evenements_charges_succes', 'Événements chargés avec succès !'));
                    }
                } else {
                    console.warn("Les données d'événements reçues ne sont pas un tableau:", apiEventsRaw);
                    const errMessage = t('erreur_format_donnees_evenements', 'Format de données incorrect.');
                    setError(errMessage);
                    
                    // Fallback to local storage
                    const localEvents = getLocalEvents();
                    setEvents(localEvents.sort((a: Event, b: Event) => 
                        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                    ));
                }
            } else {
                const errorMessage = response.data?.text || t('erreur_recuperation_evenements', 'Impossible de récupérer les événements');
                setError(errorMessage);
                
                // Fallback to local storage
                const localEvents = getLocalEvents();
                setEvents(localEvents.sort((a: Event, b: Event) => 
                    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                ));
            }
        } catch (err: unknown) {
            // Log error details for debugging in a safer way - avoid serialization
            console.error("Erreur API:", typeof err);
            if (err instanceof Error) {
                console.error("Error name:", err.name);
                console.error("Error message:", err.message);
            }
            
            const errorMessage = t('erreur_chargement_evenements_connexion', 'Erreur chargement. Vérifiez connexion.');
            
            // Don't try to process the error object further to avoid serialization issues
            // Just use a simple error message
            
            setError(errorMessage);
            
            // Fallback to local storage
            const localEvents = getLocalEvents();
            setEvents(localEvents.sort((a: Event, b: Event) => 
                new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            ));
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    // Utiliser un useEffect distinct pour le chargement initial
    useEffect(() => {
        // Chargement initial des événements - exécuté une seule fois
        const initialLoad = async () => {
            try {
                // Importer dynamiquement le service d'événements pour obtenir les événements factices
                // si aucun événement n'est trouvé dans le localStorage
                const { getFallbackEvents } = await import('@/services/EventService');
                
                // Charger depuis localStorage ou utiliser les événements factices
                let localEvents = getLocalEvents();
                
                // Si aucun événement n'est trouvé, utiliser les événements factices
                if (localEvents.length === 0) {
                    // Charger les événements factices depuis le service
                    const fallbackEvents = getFallbackEvents();
                    
                    // Convertir les événements factices au format attendu par le composant
                    localEvents = fallbackEvents.map(event => ({
                        id: event.id,
                        title: event.title,
                        description: event.description || '',
                        startDate: event.date,
                        endDate: event.date, // Utiliser la même date pour simplifier
                        location: event.location || '',
                        participants: event.participants || [],
                        createdBy: event.createdBy || 'admin',
                        createdAt: event.createdAt || new Date().toISOString(),
                        updatedAt: event.updatedAt || new Date().toISOString()
                    }));
                    
                    // Sauvegarder les événements factices dans le localStorage pour les prochains chargements
                    saveLocalEvents(localEvents);
                }
                
                // Trier les événements par date
                setEvents(localEvents.sort((a: Event, b: Event) => 
                    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                ));
                console.log('Événements chargés:', localEvents.length);
            } catch (e) {
                console.error("Erreur lors du chargement initial des événements:", e);
                setError("Erreur lors du chargement des événements. Veuillez rafraîchir la page.");
            } finally {
                setIsLoading(false);
            }
        };
        
        initialLoad();
    }, []); // Dépendances vides pour exécuter uniquement au montage du composant

    // Sauvegarde dans localStorage uniquement lorsque les événements changent VRAIMENT
    useEffect(() => {
        // Vérifier que le chargement initial est terminé et qu'il y a des événements à sauvegarder
        if (isLoading || events.length < 0) return;
        
        // Générer une représentation des événements pour comparaison
        const eventsString = JSON.stringify(events);
        
        // Ne sauvegarder que si les événements ont réellement changé depuis la dernière sauvegarde
        if (previousEventsRef.current !== eventsString) {
            previousEventsRef.current = eventsString;
            
            // Décaler la sauvegarde pour éviter les boucles de rendu
            const timeoutId = setTimeout(() => {
                saveLocalEvents(events);
            }, 100);
            
            // Nettoyer le timeout si le composant est démonté avant la fin
            return () => clearTimeout(timeoutId);
        }
    }, [events, isLoading]);

    const handleOpenCreateModal = () => {
        setEditingEvent(null);
        setShowEventModal(true);
    };

    const handleOpenEditModal = (eventToEdit: Event) => {
        setEditingEvent(eventToEdit);
        setShowEventModal(true);
    };

    const handleCloseModal = () => {
        setShowEventModal(false);
        setEditingEvent(null);
    };

    // Handle form submission for creating or updating an event
    const handleSubmitEvent = (formDataFromModel: EventFormData): void => {
        // Debug logs
        console.log('handleSubmitEvent called with data:', formDataFromModel);
        toast.success('Fonction handleSubmitEvent appelée');
        
        // If we get an Event object instead of FormData (shouldn't happen), just return
        if ('id' in formDataFromModel && 'createdBy' in formDataFromModel) {
            console.log('Received full Event object instead of form data, returning');
            toast.error('Type de données incorrect reçu');
            return;
        }
        
        // Now TypeScript knows formDataFromModel is FormData
        const submitData = async () => {
        console.log('submitData async function started');
        toast.success('Début du traitement asynchrone');
        
        setIsSubmitting(true);
        const isEditing = editingEvent && editingEvent.id;
        const loadingToastId = toast.loading(
            isEditing ? t('modification_evenement_cours', 'Modification...') : t('creation_evenement_cours', 'Création...')
        );
        console.log('Toast de chargement affiché avec ID:', loadingToastId);

        if (!currentUserId) {
            console.log('Aucun utilisateur connecté');
            toast.error(
                t('utilisateur_non_identifie_evenement', 'Utilisateur non identifié. Veuillez vous connecter.'), 
                { id: loadingToastId }
            );
            setIsSubmitting(false);
            return;
        }
        console.log('Utilisateur identifié:', currentUserId);
        
        try {
            // Utiliser directement la fonction createEvent du service local
            // Import dynamique pour éviter les problèmes de dépendance circulaire
            const { createEvent } = await import('@/services/EventService');
            
            let savedEvent;
            if (editingEvent) {
                // Gestion de la modification (non implémentée pour l'instant)
                // Simuler une modification réussie
                savedEvent = {
                    ...editingEvent,
                    title: formDataFromModel.title,
                    description: formDataFromModel.description,
                    startDate: formDataFromModel.startDate,
                    endDate: formDataFromModel.endDate,
                    location: formDataFromModel.location,
                    updatedAt: new Date().toISOString()
                };
            } else {
                // Création d'un nouvel événement
                const newLocalEvent = createEvent({
                    title: formDataFromModel.title,
                    description: formDataFromModel.description,
                    startDate: formDataFromModel.startDate,
                    endDate: formDataFromModel.endDate,
                    location: formDataFromModel.location,
                    createdBy: currentUserId
                });
                
                // Convertir l'événement local au format du composant
                savedEvent = {
                    id: newLocalEvent.id,
                    title: newLocalEvent.title,
                    description: newLocalEvent.description || '',
                    startDate: newLocalEvent.date,
                    endDate: formDataFromModel.endDate,
                    location: newLocalEvent.location,
                    participants: [],
                    createdBy: currentUserId,
                    createdAt: newLocalEvent.createdAt,
                    updatedAt: newLocalEvent.updatedAt
                };
            }
            
            // Simuler un événement sauvegardé formatté
            const formattedSavedEvent = savedEvent as Event;
                
                if (formattedSavedEvent) {
                    if (editingEvent) {
                        setEvents(prevEvents => 
                            prevEvents
                                .map(e => e.id === formattedSavedEvent.id ? formattedSavedEvent : e)
                                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                        );
                        toast.success(t('evenement_modifie_succes', 'Événement modifié avec succès !'), { id: loadingToastId });
                    } else {
                        setEvents(prevEvents => 
                            [formattedSavedEvent, ...prevEvents]
                                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                        );
                        toast.success(t('evenement_cree_succes', 'Événement créé avec succès !'), { id: loadingToastId });
                    }
                    handleCloseModal();
                } else {
                    throw new Error(t('erreur_formatage_reponse_evenement', 'Format de réponse invalide'));
                }
        } catch (err: unknown) {
            console.error("Erreur lors de la soumission de l'événement:", err);
            let errorMessage = err instanceof Error 
                ? ((err as unknown) as {response?: {data?: {text?: string}}}).response?.data?.text || err.message 
                : t('erreur_inconnue_sauvegarde_evenement', 'Erreur inconnue.');
            
            const typedErr = (err as unknown) as {response?: {status?: number, data?: {text?: string, data?: unknown}}};
if (typedErr.response?.status === 400 && typedErr.response?.data?.data) {
                errorMessage = typedErr.response.data.text || "Erreur de validation.";
            }
            toast.error(errorMessage, { id: loadingToastId });
        } finally {
            setIsSubmitting(false);
        }
        };
        
        // Execute the async function
        void submitData();
    };

    const handleDeleteEvent = (eventId: string | number): void => {
        // Convert eventId to string if it's a number
        const id = String(eventId);
        
        // Define the async operation inside a synchronous function
        const deleteEvent = async (): Promise<void> => {
            const confirmMessage = t('confirmation_suppression_evenement', 'Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.');
            if (!window.confirm(confirmMessage)) {
                return;
            }
        
            const loadingToastId = toast.loading(t('suppression_evenement_cours', 'Suppression de l\'événement...'));
            const originalEvents = [...events]; // Pour rollback

            // Optimistic update
            setEvents(prevEvents => prevEvents.filter(e => e.id !== id));
        
            try {
                // Récupérer les événements actuels du localStorage
                const localEvents = getLocalEvents();
                // Filtrer pour exclure l'événement à supprimer
                const updatedEvents = localEvents.filter(event => event.id !== id);
                // Sauvegarder les événements mis à jour dans localStorage
                saveLocalEvents(updatedEvents);
                
                // Afficher un message de succès
                toast.success(t('evenement_supprime_succes', 'Événement supprimé !'), { id: loadingToastId });
            } catch (err: unknown) {
                // En cas d'erreur, restaurer la liste originale
                setEvents(originalEvents); // Rollback
                console.error("Erreur lors de la suppression de l'événement:", err);
                const errorMessage = err instanceof Error
                    ? err.message 
                    : t('erreur_suppression_evenement', 'Erreur lors de la suppression.');
                toast.error(errorMessage, { id: loadingToastId });
                setEvents(originalEvents); // Rollback
            }
        };
        
        // Execute the async function
        void deleteEvent();
    };

    // Logique pour la participation
    const handleParticipateToggle = (eventId: string | number): void => {
        // Convert eventId to string if it's a number
        const id = String(eventId);
        
        // Define the async operation inside a synchronous function
        const toggleParticipation = async (): Promise<void> => {
            if (!currentUserId || !currentUserInfo) {
                toast.error(t('connectez_vous_pour_participer', 'Connectez-vous pour participer.'));
                return;
            }

            const eventToUpdate = events.find(e => e.id === id);
            if (!eventToUpdate) {
                console.error("Événement non trouvé pour participation:", id);
                toast.error(t('erreur_evenement_non_trouve', 'Événement non trouvé.'));
                return;
            }

            const isCurrentlyParticipating = eventToUpdate.participants?.some(p => p.id === currentUserId) || false;
            
            setParticipationState({ eventId: id, loading: true });
            const originalEvents = [...events]; // Pour rollback optimiste

            try {
                // Récupérer tous les événements du localStorage
                const localEvents = getLocalEvents();
                
                // Trouver l'événement à mettre à jour
                const eventIndex = localEvents.findIndex(e => e.id === id);
                if (eventIndex === -1) {
                    throw new Error(t('erreur_evenement_non_trouve', 'Événement non trouvé.'));
                }
                
                // Mettre à jour la liste des participants et déterminer le message de succès
                let newParticipantsList: Participant[];
                const successMessage = isCurrentlyParticipating
                    ? t('desinscription_evenement_succes', 'Vous ne participez plus.')
                    : t('inscription_evenement_succes', 'Participation enregistrée !');
                
                if (isCurrentlyParticipating) {
                    // Désinscription
                    newParticipantsList = eventToUpdate.participants?.filter(p => p.id !== currentUserId) || [];
                } else {
                    // Inscription
                    newParticipantsList = [
                        ...(eventToUpdate.participants || []), 
                        { id: currentUserId, name: currentUserInfo.name }
                    ];
                }
                
                // Créer l'événement mis à jour
                const updatedEventData = { ...eventToUpdate, participants: newParticipantsList };
                
                // Mettre à jour l'événement dans la liste locale
                localEvents[eventIndex] = updatedEventData;
                
                // Sauvegarder dans localStorage
                saveLocalEvents(localEvents);

                // Mettre à jour l'état local pour refléter les changements
                setEvents(prevEvents =>
                    prevEvents.map(e => e.id === id ? updatedEventData : e)
                );
                toast.success(successMessage);

            } catch (err: unknown) {
                console.error("Erreur API participation:", err);
                const errorMessage = err instanceof Error 
                    ? err.message 
                    : t('erreur_api_participation', "Erreur mise à jour participation.");
                toast.error(errorMessage);
                setEvents(originalEvents); // Rollback
            } finally {
                setParticipationState({ eventId: undefined, loading: false });
            }
        };
        
        // Execute the async function
        void toggleParticipation();
    };

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {t('titre_page_evenements', 'Événements')}
                </h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenCreateModal}
                    className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-sm sm:text-base"
                >
                    <PlusCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {t('bouton_creer_evenement', 'Créer un événement')}
                </motion.button>
            </div>

            {/* Modale pour créer/modifier un événement */} 
            <AnimatePresence>
                {showEventModal && (
                    <EventFormModal 
                        isOpen={showEventModal}
                        onClose={handleCloseModal}
                        onSubmit={(data) => {
                            console.log('onSubmit appelé dans Evenements avec data:', data);
                            if (data instanceof FormData) {
                                // Convert browser FormData to our EventFormData structure
                                console.log('Data est une instance de FormData');
                                const eventData: EventFormData = {
                                    title: data.get('title') as string,
                                    description: data.get('description') as string,
                                    startDate: data.get('startDate') as string,
                                    endDate: data.get('endDate') as string,
                                    location: data.get('location') as string
                                };
                                handleSubmitEvent(eventData);
                            } else {
                                // Si c'est un objet EventFormData normal
                                console.log('Data est un objet normal');
                                handleSubmitEvent(data as EventFormData);
                            }
                        }}
                        eventToEdit={editingEvent}
                        isSubmitting={isSubmitting}
                    />
                )}
            </AnimatePresence>

            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    <p className="ml-4 text-lg text-gray-600">
                        {t('chargement_evenements', 'Chargement des événements...')}
                    </p>
                </div>
            )}

            {!isLoading && error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md text-center">
                    <div className="flex items-center justify-center mb-2">
                        <AlertTriangle className="h-8 w-8 mr-3" />
                        <p className="text-xl font-semibold">
                            {t('erreur_titre', 'Une erreur est survenue')}
                        </p>
                    </div>
                    <p className="text-md">{error}</p>
                    <button 
                        onClick={() => loadEvents()}
                        className='mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200'
                    >
                        {t('bouton_reessayer', 'Réessayer')}
                    </button>
                </div>
            )}

            {!isLoading && !error && events.length === 0 && (
                <div className="text-center py-12">
                    <CalendarDays className="mx-auto h-24 w-24 text-gray-300 mb-6" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                        {t('aucun_evenement_trouve', 'Aucun événement à afficher')}
                    </h2>
                    <p className="text-gray-500 mb-6">
                        {t('description_aucun_evenement', 'Soyez le premier à créer un événement et à rassembler votre communauté !')}
                    </p>
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
                            onEdit={handleOpenEditModal}
                            onDelete={handleDeleteEvent}
                            onParticipateToggle={handleParticipateToggle}
                            currentUserId={currentUserId ?? ''}
                            isParticipatingLoading={participationState}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Evenements;