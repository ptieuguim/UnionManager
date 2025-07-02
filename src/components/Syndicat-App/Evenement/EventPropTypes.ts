// Types TypeScript pour Next.js - Remplacement de EventPropTypes.js
// Migration complète des PropTypes vers des interfaces TypeScript

import { ReactNode } from 'react';

// ===== TYPES DE BASE =====

/**
 * Représente un participant à un événement
 */
export interface Participant {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  joinedAt?: string | Date;
  role?: 'member' | 'admin' | 'guest';
}

/**
 * Représente l'auteur/créateur d'un événement
 */
export interface Author {
  id: string;
  name: string;
  profileImage?: string;
  role?: string;
  email?: string;
  isVerified?: boolean;
}

/**
 * Catégories d'événements disponibles
 */
export type EventCategory = 
  | 'meeting' 
  | 'training' 
  | 'social' 
  | 'vote' 
  | 'general' 
  | 'other';

/**
 * Statuts possibles d'un événement
 */
export type EventStatus = 
  | 'draft' 
  | 'published' 
  | 'ongoing' 
  | 'completed' 
  | 'cancelled';

// ===== INTERFACE PRINCIPALE ÉVÉNEMENT =====

/**
 * Interface complète pour un événement
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  location?: string;
  startDate: string | Date;
  endDate: string | Date;
  author: Author;
  participants?: Participant[];
  images?: string[];
  isUpcoming?: boolean;
  category?: EventCategory;
  isPublic?: boolean;
  notifyMembers?: boolean;
  status?: EventStatus;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  maxParticipants?: number;
  requiresApproval?: boolean;
  tags?: string[];
  attachments?: string[];
}

/**
 * Version légère d'un événement pour les listes
 */
export interface EventSummary {
  id: string;
  title: string;
  startDate: string | Date;
  location?: string;
  participantCount: number;
  category?: EventCategory;
  isPublic?: boolean;
}

/**
 * Données pour créer/modifier un événement
 */
export interface EventFormData {
  title: string;
  description: string;
  location?: string;
  startDate: string;
  endDate: string;
  category?: EventCategory;
  isPublic?: boolean;
  notifyMembers?: boolean;
  maxParticipants?: number;
  images?: string[] | File[];
}

// ===== PROPS DES COMPOSANTS =====

/**
 * Props pour le composant EventCard
 */
import PropTypes from 'prop-types';
// Renamed to avoid confusion with the TypeScript interface
export const EventCardPropTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    location: PropTypes.string,
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    author: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      // profileImage: PropTypes.string,
    }),
    participants: PropTypes.array,
    images: PropTypes.arrayOf(PropTypes.string),
    // category: PropTypes.string,
    // isPublic: PropTypes.bool,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onParticipateToggle: PropTypes.func,
  onViewParticipants: PropTypes.func,
  currentUserId: PropTypes.string,
  isParticipatingLoading: PropTypes.shape({
    eventId: PropTypes.string,
    loading: PropTypes.bool,
  }),
  showActions: PropTypes.bool,
  compact: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * Props pour le composant ParticipantsList
 */
export interface ParticipantsListProps {
  participants?: Participant[];
  eventId: string;
  onToggleParticipation?: (eventId: string) => void;
  currentUserId?: string | null;
  isLoading?: boolean;
  maxDisplayed?: number;
  showAvatars?: boolean;
  compact?: boolean;
  showStats?: boolean;
}

/**
 * Props pour la modal de liste des participants
 */
export interface ParticipantsListModalProps {
  event: {
    id: string;
    title: string;
    participants?: Participant[];
    maxParticipants?: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onParticipateToggle?: (eventId: string) => void;
  currentUserId?: string | null;
  isLoading?: boolean;
}

/**
 * Props pour le formulaire d'événement
 */
export interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData | FormData) => void;
  eventToEdit?: Event | null;
  isSubmitting: boolean;
  allowedCategories?: EventCategory[];
}

/**
 * Props pour la modal de formulaire d'événement
 */
export interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData | FormData) => void;
  eventToEdit?: Event | null;
  isSubmitting: boolean;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

/**
 * Props pour le composant de liste d'événements
 */
export interface EventsListProps {
  events: Event[];
  onEventEdit?: (event: Event) => void;
  onEventDelete?: (eventId: string) => void;
  onParticipateToggle?: (eventId: string) => void;
  currentUserId?: string | null;
  isLoading?: boolean;
  participationState?: {
    eventId: string | null;
    loading: boolean;
  };
  layout?: 'grid' | 'list';
  showFilters?: boolean;
  className?: string;
}

/**
 * Props pour les filtres d'événements
 */
export interface EventFiltersProps {
  onFilterChange: (filters: EventFilters) => void;
  categories?: EventCategory[];
  showDateRange?: boolean;
  showCategoryFilter?: boolean;
  showStatusFilter?: boolean;
  initialFilters?: Partial<EventFilters>;
}

// ===== TYPES POUR LES FILTRES ET RECHERCHE =====

/**
 * Filtres pour la recherche d'événements
 */
export interface EventFilters {
  search?: string;
  category?: EventCategory | 'all';
  status?: EventStatus | 'all';
  dateRange?: {
    start: string | Date;
    end: string | Date;
  };
  isPublic?: boolean;
  authorId?: string;
  isParticipating?: boolean;
}

/**
 * Options de tri pour les événements
 */
export interface EventSortOptions {
  field: 'startDate' | 'title' | 'createdAt' | 'participantCount';
  direction: 'asc' | 'desc';
}

// ===== TYPES POUR LES NOTIFICATIONS =====

/**
 * Types de notifications liées aux événements
 */
export type EventNotificationType = 
  | 'event_created'
  | 'event_updated'
  | 'event_cancelled'
  | 'participant_joined'
  | 'participant_left'
  | 'event_reminder'
  | 'event_starting_soon';

/**
 * Notification d'événement
 */
export interface EventNotification {
  id: string;
  type: EventNotificationType;
  eventId: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string | Date;
  data?: Record<string, any>;
}

// ===== TYPES POUR LES API =====

/**
 * Réponse API pour un événement
 */
export interface EventApiResponse {
  success: boolean;
  data: Event;
  message?: string;
}

/**
 * Réponse API pour une liste d'événements
 */
export interface EventsApiResponse {
  success: boolean;
  data: Event[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

/**
 * Réponse API pour la participation
 */
export interface ParticipationApiResponse {
  success: boolean;
  data: {
    event: Event;
    isParticipating: boolean;
  };
  message?: string;
}

// ===== TYPES UTILITAIRES =====

/**
 * État de chargement pour les opérations d'événements
 */
export interface EventLoadingState {
  isLoading: boolean;
  operation: 'create' | 'update' | 'delete' | 'participate' | 'fetch' | null;
  eventId?: string;
}

/**
 * Erreur liée aux événements
 */
export interface EventError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

/**
 * Contexte d'état global pour les événements
 */
export interface EventsContextValue {
  events: Event[];
  loading: EventLoadingState;
  error: EventError | null;
  filters: EventFilters;
  sortOptions: EventSortOptions;
  
  // Actions
  fetchEvents: (filters?: EventFilters) => Promise<void>;
  createEvent: (data: EventFormData) => Promise<Event>;
  updateEvent: (id: string, data: Partial<EventFormData>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  toggleParticipation: (eventId: string) => Promise<void>;
  setFilters: (filters: Partial<EventFilters>) => void;
  setSortOptions: (options: EventSortOptions) => void;
  clearError: () => void;
}

// ===== EXPORTS POUR COMPATIBILITÉ =====

/**
 * @deprecated Utilisez les interfaces TypeScript à la place
 * Maintenu pour la compatibilité pendant la migration
 */
export const LegacyEventShape = {
  id: 'string',
  title: 'string',
  description: 'string',
  location: 'string?',
  startDate: 'Date | string',
  endDate: 'Date | string',
  author: 'Author',
  participants: 'Participant[]?',
  images: 'string[]?',
  isUpcoming: 'boolean?',
  category: 'EventCategory?',
  isPublic: 'boolean?'
} as const;

// ===== TYPE GUARDS =====

/**
 * Vérifie si un objet est un Participant valide
 */
export function isParticipant(obj: any): obj is Participant {
  return obj && 
    typeof obj.id === 'string' && 
    typeof obj.name === 'string';
}

/**
 * Vérifie si un objet est un Event valide
 */
export function isEvent(obj: any): obj is Event {
  return obj && 
    typeof obj.id === 'string' && 
    typeof obj.title === 'string' && 
    typeof obj.description === 'string' &&
    (obj.startDate instanceof Date || typeof obj.startDate === 'string') &&
    (obj.endDate instanceof Date || typeof obj.endDate === 'string') &&
    obj.author && typeof obj.author.id === 'string';
}

/**
 * Vérifie si une date d'événement est dans le futur
 */
export function isUpcomingEvent(event: Event): boolean {
  const startDate = typeof event.startDate === 'string' 
    ? new Date(event.startDate) 
    : event.startDate;
  return startDate > new Date();
}

/**
 * Vérifie si un utilisateur participe à un événement
 */
export function isUserParticipating(event: Event, userId: string): boolean {
  return event.participants?.some(p => p.id === userId) ?? false;
}

export default {
  EventCardPropTypes,
  isParticipant,
  isEvent,
  isUpcomingEvent,
  isUserParticipating
};