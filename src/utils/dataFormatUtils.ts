/**
 * Utilitaires pour formater les données entre le frontend et le backend (Next.js/TypeScript)
 */

export const parseApiResponseData = (apiResponseDataString: string | object): object | any[] | null => {
    try {
        if (apiResponseDataString && typeof apiResponseDataString === 'string') {
            const parsed = JSON.parse(apiResponseDataString);
            if (typeof parsed === 'object' && parsed !== null) {
                return parsed;
            }
            return null;
        }
        if (typeof apiResponseDataString === 'object' && apiResponseDataString !== null) {
            return apiResponseDataString;
        }
        return null;
    } catch (error) {
        console.error("Erreur de parsing JSON des données de l'API:", error, "Données reçues:", apiResponseDataString);
        return null;
    }
};

export const formatDateForBackend = (date: Date | string): string | null => {
  if (!date) return null;
  try {
    if (typeof date === 'string' && date.includes('T')) {
      return date;
    }
    return new Date(date).toISOString();
  } catch (error) {
    console.error("Erreur lors du formatage de la date pour le backend:", date, error);
    return null;
  }
};

export const formatPublicationForBackend = (
  frontendPublication: any,
  currentUserId: string,
  currentUserInfo: { name?: string; profileImage?: string }
): any => {
    const defaultUsername = 'Utilisateur Anonyme';
    const defaultAvatar = '/default-avatar.png';
    return {
        content: frontendPublication.content,
        image: frontendPublication.image || null,
        authorId: currentUserId,
        authorName: currentUserInfo?.name || defaultUsername,
        authorAvatar: currentUserInfo?.profileImage || defaultAvatar
    };
};

export const formatPublicationFromBackend = (backendPublication: any): any | null => {
    if (!backendPublication || !backendPublication.id) {
        console.warn("Tentative de formater une publication backend invalide:", backendPublication);
        return null;
    }
    return {
        id: backendPublication.id,
        content: backendPublication.content,
        image: backendPublication.image,
        author: {
            id: backendPublication.author?.id || backendPublication.authorId || null,
            name: backendPublication.authorName || 'Utilisateur Inconnu',
            avatar: backendPublication.authorAvatar || '/default-avatar.png',
        },
        timestamp: formatDateForDisplay(backendPublication.createdAt),
    };
};

export const parseBackendDate = (isoString: string): Date | null => {
  try {
    return new Date(isoString);
  } catch {
    return null;
  }
};

export const formatDateForDisplay = (dateInput: Date | string): string => {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return "Date invalide";
    }
    return date.toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch {
    return "Date invalide";
  }
};

export const formatEventForBackend = (event: any, currentUserId: string, currentUserInfo: UserInfo | null): any => {
  return {
    ...event,
    startDate: formatDateForBackend(event.startDate),
    endDate: formatDateForBackend(event.endDate),
    isPublic: event.isPublic !== undefined ? event.isPublic : true,
    notifyMembers: event.notifyMembers !== undefined ? event.notifyMembers : true
  };
};

export const formatEventFromBackend = (backendEvent: any): any => {
  return {
    id: backendEvent.id,
    title: backendEvent.title,
    description: backendEvent.description,
    location: backendEvent.location,
    startDate: parseBackendDate(backendEvent.startDate),
    endDate: parseBackendDate(backendEvent.endDate),
    author: {
      id: backendEvent.authorId,
      name: backendEvent.authorName,
      profileImage: backendEvent.authorAvatar,
      role: backendEvent.authorRole || 'Membre'
    },
    participants: backendEvent.participants || [],
    images: backendEvent.images || [],
    category: backendEvent.category,
    isPublic: backendEvent.isPublic,
    isUpcoming: isUpcomingEvent(parseBackendDate(backendEvent.startDate))
  };
};

export const isUpcomingEvent = (startDate: Date | null): boolean => {
  if (!startDate) return false;
  return new Date(startDate) > new Date();
};

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getCurrentUserId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userId') || generateUUID();
};

export const getCurrentUserInfo = (): {
    id: any; name: string; profileImage?: string 
} | null => {
  if (typeof window === 'undefined') return null;
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      const user = JSON.parse(userString);
      return {
        name: user.name || 'Utilisateur',
        profileImage: user.profileImage
      };
    } catch (e) {
      console.error("Erreur parsing 'user' from localStorage", e);
      return null;
    }
  }
  return null;
};

export const getCurrentUsername = (): string => {
  if (typeof window === 'undefined') return 'Utilisateur';
  return localStorage.getItem('username') || 'Utilisateur';
};

export const formatDateForInput = (dateStringOrObject: string | Date): string => {
  if (!dateStringOrObject) return '';
  try {
    const date = new Date(dateStringOrObject);
    if (isNaN(date.getTime())) {
      return '';
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return '';
  }
};
