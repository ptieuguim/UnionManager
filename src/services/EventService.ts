// EventService.ts - Gestion locale des événements compatible Next.js/TypeScript

const EVENTS_STORAGE_KEY = 'syndic_manager_events';
const isBrowser = typeof window !== 'undefined';

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location: string;
  participants?: Array<{ id: string; name: string; }>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

/**
 * Sauvegarde les événements dans le localStorage (CSR only)
 */
export const saveEventsToLocalStorage = (events: Event[]): void => {
  if (!isBrowser) return;
  try {
    const serializedEvents = JSON.stringify(events);
    localStorage.setItem(EVENTS_STORAGE_KEY, serializedEvents);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des événements dans le localStorage:', error);
  }
};

/**
 * Récupère les événements depuis le localStorage (CSR only)
 */
export const getEventsFromLocalStorage = (): Event[] => {
  if (!isBrowser) return [];
  try {
    const serializedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (serializedEvents === null) return getFallbackEvents();
    return JSON.parse(serializedEvents) as Event[];
  } catch (error) {
    console.error('Erreur lors de la récupération des événements depuis le localStorage:', error);
    return getFallbackEvents();
  }
};

/**
 * Génère un UUID simple
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Crée un nouvel événement avec les données fournies
 */
export const createEvent = (eventData: {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  createdBy: string;
}): Event => {
  const now = new Date().toISOString();
  const newEvent: Event = {
    id: generateUUID(),
    title: eventData.title,
    description: eventData.description,
    date: eventData.startDate,
    location: eventData.location,
    participants: [],
    createdBy: eventData.createdBy,
    createdAt: now,
    updatedAt: now
  };
  
  // Ajouter au localStorage
  const currentEvents = getEventsFromLocalStorage();
  saveEventsToLocalStorage([newEvent, ...currentEvents]);
  
  return newEvent;
};

/**
 * Fournit des événements factices pour le développement
 */
export const getFallbackEvents = (): Event[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const month = new Date(now);
  month.setMonth(month.getMonth() + 1);
  
  return [
    {
      id: 'event-1',
      title: 'Assemblée Générale Annuelle',
      description: 'Réunion annuelle pour discuter du bilan et des projets futurs du syndicat.',
      date: tomorrow.toISOString(),
      location: 'Salle de conférence principale',
      participants: [
        { id: 'user-1', name: 'Jean Dupont' },
        { id: 'user-2', name: 'Marie Curie' },
      ],
      createdBy: 'admin',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    },
    {
      id: 'event-2',
      title: 'Formation Droits des Travailleurs',
      description: 'Session de formation sur les droits fondamentaux des travailleurs et les récentes modifications législatives.',
      date: nextWeek.toISOString(),
      location: 'Salle de formation B',
      participants: [
        { id: 'user-3', name: 'Pierre Martin' },
      ],
      createdBy: 'admin',
      createdAt: new Date(now.getTime() - 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000).toISOString()
    },
    {
      id: 'event-3',
      title: 'Rencontre avec la Direction',
      description: 'Négociation des nouvelles conditions de travail et discussion sur les projets d\'entreprise.',
      date: month.toISOString(),
      location: 'Siège de l\'entreprise',
      participants: [],
      createdBy: 'admin',
      createdAt: new Date(now.getTime() - 172800000).toISOString(),
      updatedAt: new Date(now.getTime() - 172800000).toISOString()
    },
  ];
};

// Pour la vraie intégration backend (API), ajouter ici les appels à l'API REST Next.js/Java
// Ex: export async function fetchEventsFromAPI() { ... }
