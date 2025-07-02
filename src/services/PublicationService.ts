// PublicationService.ts - Gestion des publications (locale + API) compatible Next.js/TypeScript
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const PUBLICATIONS_STORAGE_KEY = 'publications';
const isBrowser = typeof window !== 'undefined';

export interface Author {
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  replies: Array<{
    id: string;
    author: {
      name: string;
      avatar: string;
    };
    content: string;
  }>;
}

export interface Publication {
  id: string;
  author: Author;
  content: string;
  image?: string;
  timestamp: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  isLocalOnly?: boolean;
  apiCompatible?: boolean;
  [key: string]: unknown;
}

export async function getAllPublications(): Promise<Publication[]> {
  try {
    const localData = getPublicationsFromLocalStorage();
    if (localData && localData.length > 0) return localData;
    return getFallbackPublications();
  } catch (error: unknown) {
    console.error('Erreur lors de la récupération des publications:', error);
    return getFallbackPublications();
  }
}

export function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  } catch (error: unknown) {
    console.error('Erreur de formatage de date:', error);
    return 'Date inconnue';
  }
}

export function getFallbackPublications(): Publication[] {
  const mockPosts: Publication[] = [
    {
      id: 'pub-001',
      author: {
        name: 'Jean Dupont',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
      },
      content: "Aujourd'hui, nous avons eu une réunion productive sur les nouvelles mesures de sécurité. Qu'en pensez-vous ?",
      image: '/src/images/bproo.png',
      timestamp: 'Il y a 2 heures',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 15,
      comments: [
        {
          id: 'comment-001',
          author: {
            name: 'Marie Martin',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
          },
          content: "Excellente initiative ! J'ai hâte de voir les résultats.",
          replies: []
        }
      ]
    },
    {
      id: 'pub-002',
      author: {
        name: 'Sophie Lefebvre',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
      },
      content: "Rappel : la formation sur les nouveaux outils de communication aura lieu demain à 14h. N'oubliez pas de vous inscrire !",
      timestamp: 'Il y a 5 heures',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 8,
      comments: []
    }
  ];
  return mockPosts;
}

export async function createPublication(publicationData: Omit<Publication, 'id' | 'timestamp' | 'createdAt' | 'likes' | 'comments'>): Promise<Publication> {
  const uniqueId = generateUniqueId();
  const newPublication: Publication = {
    id: uniqueId,
    author: publicationData.author as Author,
    content: publicationData.content as string,
    image: publicationData.image as string | undefined,
    timestamp: "À l'instant",
    createdAt: new Date(),
    likes: 0,
    comments: [],
    isLocalOnly: true,
    apiCompatible: true
  };
  const publications = getPublicationsFromLocalStorage() || [];
  publications.unshift(newPublication);
  savePublicationsToLocalStorage(publications);
  return newPublication;
}

export function generateUniqueId(): string {
  return 'pub-' + Math.random().toString(36).substr(2, 9);
}

export async function getPublicationById(publicationId: string): Promise<Publication | null> {
  const publications = getPublicationsFromLocalStorage() || [];
  return publications.find(p => p.id === publicationId) || null;
}

export async function updatePublication(publicationId: string, updateData: Partial<Publication>): Promise<{ success: boolean; error?: string }> {
  try {
    const publications = getPublicationsFromLocalStorage() || [];
    const updatedPublications = publications.map(pub =>
      pub.id === publicationId ? { ...pub, ...updateData } : pub
    );
    savePublicationsToLocalStorage(updatedPublications);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return { success: false, error: errorMessage };
  }
}

export async function deletePublication(publicationId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const publications = getPublicationsFromLocalStorage() || [];
    const filteredPublications = publications.filter(pub => pub.id !== publicationId);
    savePublicationsToLocalStorage(filteredPublications);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return { success: false, error: errorMessage };
  }
}

export function savePublicationsToLocalStorage(publications: Publication[]): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(PUBLICATIONS_STORAGE_KEY, JSON.stringify(publications));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des publications:', error);
  }
}

export function getPublicationsFromLocalStorage(): Publication[] {
  if (!isBrowser) return [];
  try {
    const storedPublications = localStorage.getItem(PUBLICATIONS_STORAGE_KEY);
    if (storedPublications) {
      // Parse the stored publications and ensure all required properties exist
      const parsedData = JSON.parse(storedPublications) as Record<string, unknown>[];
      
      // Properly type and validate each publication
      const publications = parsedData.map((pub): Publication => {
        const typedPub = pub as Record<string, unknown>;
        // Ensure we have all the required properties
        return {
          id: typeof typedPub.id === 'string' ? typedPub.id : generateUniqueId(),
          author: typedPub.author && typeof typedPub.author === 'object' 
            ? {
                name: typeof (typedPub.author as Record<string, unknown>).name === 'string' 
                  ? (typedPub.author as Record<string, unknown>).name as string : 'Utilisateur',
                avatar: typeof (typedPub.author as Record<string, unknown>).avatar === 'string' 
                  ? (typedPub.author as Record<string, unknown>).avatar as string : 'default-avatar.png'
              }
            : { name: 'Utilisateur', avatar: 'default-avatar.png' },
          content: typeof typedPub.content === 'string' ? typedPub.content : '',
          timestamp: typeof typedPub.timestamp === 'string' ? typedPub.timestamp : 'À l\'instant',
          createdAt: typedPub.createdAt ? new Date(String(typedPub.createdAt)) : new Date(),
          likes: typeof typedPub.likes === 'number' ? typedPub.likes : 0,
          comments: Array.isArray(typedPub.comments) 
            ? typedPub.comments.map((comment: unknown) => {
                const typedComment = comment as Record<string, unknown>;
                return {
                  id: typeof typedComment.id === 'string' ? typedComment.id : generateUniqueId(),
                  author: typedComment.author && typeof typedComment.author === 'object' 
                    ? {
                        name: typeof (typedComment.author as Record<string, unknown>).name === 'string' 
                          ? (typedComment.author as Record<string, unknown>).name as string : 'Anonyme',
                        avatar: typeof (typedComment.author as Record<string, unknown>).avatar === 'string' 
                          ? (typedComment.author as Record<string, unknown>).avatar as string : 'default-avatar.png'
                      } 
                    : { name: 'Anonyme', avatar: 'default-avatar.png' },
                  content: typeof typedComment.content === 'string' ? typedComment.content : '',
                  replies: Array.isArray(typedComment.replies) 
                    ? typedComment.replies.map((reply: unknown) => {
                        const typedReply = reply as Record<string, unknown>;
                        return {
                          id: typeof typedReply.id === 'string' ? typedReply.id : generateUniqueId(),
                          author: typedReply.author && typeof typedReply.author === 'object'
                            ? {
                                name: typeof (typedReply.author as Record<string, unknown>).name === 'string'
                                  ? (typedReply.author as Record<string, unknown>).name as string : 'Anonyme',
                                avatar: typeof (typedReply.author as Record<string, unknown>).avatar === 'string'
                                  ? (typedReply.author as Record<string, unknown>).avatar as string : 'default-avatar.png'
                              }
                            : { name: 'Anonyme', avatar: 'default-avatar.png' },
                          content: typeof typedReply.content === 'string' ? typedReply.content : ''
                        };
                      })
                    : []
                };
              })
            : [],
          image: typeof typedPub.image === 'string' ? typedPub.image as string : undefined,
          isLocalOnly: typeof typedPub.isLocalOnly === 'boolean' ? typedPub.isLocalOnly as boolean : undefined,
          apiCompatible: typeof typedPub.apiCompatible === 'boolean' ? typedPub.apiCompatible as boolean : undefined
        };
      });
      
      return publications;
    }
  } catch (error: unknown) {
    console.error('Erreur lors de la récupération des publications:', error);
  }
  return [];
}

// Pour la vraie intégration backend (API), il suffira d'ajouter les appels REST ici
