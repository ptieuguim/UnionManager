

import { jwtDecode, type JwtPayload } from 'jwt-decode';
import axios from 'axios';
import Cookies from 'js-cookie';

// --- CONSTANTES ---
const TOKEN_KEY = 'access_token'; // Modifié pour correspondre au nom dans le middleware
const ORGANISATION_TOKEN_KEY = 'organisation_token';
const USER_DATA_KEY = 'user_data';

// Options de cookie par défaut (7 jours d'expiration, disponible sur tout le site)
const COOKIE_OPTIONS = {
  expires: 7, // Expiration en jours
  path: '/', // Disponible sur tout le site
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production' // Sécurisé en production
};



// Type pour les données utilisateur stockées dans le localStorage
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
 
}

// Étend JwtPayload pour inclure les champs personnalisés de votre token
// C'est la source de vérité pour les informations contenues dans le JWT
interface DecodedTokenPayload extends JwtPayload {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}


// Vérifie si le code s'exécute côté client (dans le navigateur)
const isBrowser = typeof window !== 'undefined';

// --- GESTION DU LOCALSTORAGE (Côté Client Uniquement) ---

export const saveToken = (token: string): void => {
  if (isBrowser) Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
};

export const saveOrganisationToken = (token: string): void => {
  if (isBrowser) Cookies.set(ORGANISATION_TOKEN_KEY, token, COOKIE_OPTIONS);
};

// Sauvegarde les données utilisateur sous forme de chaîne JSON
export const saveUserData = (userData: UserData): void => {
  if (isBrowser) Cookies.set(USER_DATA_KEY, JSON.stringify(userData), COOKIE_OPTIONS);
};

export const getToken = (): string | null => {
  return isBrowser ? Cookies.get(TOKEN_KEY) || null : null;
};

export const getOrganisationToken = (): string | null => {
  return isBrowser ? Cookies.get(ORGANISATION_TOKEN_KEY) || null : null;
};

// Récupère et parse les données utilisateur en toute sécurité
export const getUserData = (): UserData | null => {
  if (!isBrowser) return null;
  
  const rawData = Cookies.get(USER_DATA_KEY);
  if (!rawData || rawData === 'undefined') return null;

  try {
    // CORRECTION : On parse et on s'assure que le résultat est bien un objet UserData
    const parsedData = JSON.parse(rawData) as UserData;
    // Vérification minimale pour s'assurer que l'objet a les propriétés attendues
    if (parsedData && typeof parsedData === 'object' && 'id' in parsedData && 'email' in parsedData) {
      return parsedData;
    }
    return null;
  } catch (error) {
    console.error("Erreur de parsing des données utilisateur:", error);
    // En cas d'erreur, on nettoie le cookie pour éviter des problèmes futurs
    Cookies.remove(USER_DATA_KEY, { path: '/' });
    return null;
  }
};

export const logout = (): void => {
  if (isBrowser) {
    Cookies.remove(TOKEN_KEY, { path: '/' });
    Cookies.remove(ORGANISATION_TOKEN_KEY, { path: '/' });
    Cookies.remove(USER_DATA_KEY, { path: '/' });
  
    delete axios.defaults.headers.common['Authorization'];
  }
};


// Décode le token de manière sécurisée et retourne une version typée
const getDecodedToken = (): DecodedTokenPayload | null => {
  if (!isBrowser) return null;

  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<DecodedTokenPayload>(token);
  } catch (error) {
    console.error("Erreur de décodage du token:", error);

    logout();
    return null;
  }
};

// Vérifie si l'utilisateur est authentifié de manière fiable
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  const decodedToken = getDecodedToken();
  if (!decodedToken || !decodedToken.exp) return false;
  

  const isExpired = Date.now() >= decodedToken.exp * 1000;
  if (isExpired) {
    logout(); 
    return false;
  }

  return true;
};

// Configure l'en-tête Authorization pour toutes les requêtes axios
export const setAuthHeader = (token: string | null): void => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Fonction à appeler au démarrage de l'application
export const initializeAuth = (): void => {
  if (isAuthenticated()) {
    setAuthHeader(getToken());
  }
};



export const getUserId = (): string | null => {
  return getDecodedToken()?.userId ?? null;
};

export const getEmail = (): string | null => {
  return getDecodedToken()?.email ?? null;
};

export const getFirstName = (): string | null => {
  return getDecodedToken()?.firstName ?? null;
};

export const getLastName = (): string | null => {
  return getDecodedToken()?.lastName ?? null;
};

export const getFullName = (): string | null => {
  const firstName = getFirstName();
  const lastName = getLastName();
  if (!firstName && !lastName) return null;
  return `${firstName ?? ''} ${lastName ?? ''}`.trim();
};

export const getRole = (): string | null => {
  return getDecodedToken()?.role ?? null;
};

export const hasRole = (requiredRoles: string | string[]): boolean => {
  const userRole = getRole();
  if (!userRole) return false;

  const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return rolesToCheck.some(role => userRole === role);
};

// --- GESTION DE L'EXPIRATION DU TOKEN ---

// Retourne l'URL de la photo de profil à partir du token décodé, ou une valeur par défaut
export const getProfilFromToken = (): string | null => {
  const decoded = getDecodedToken();
  // Essayez les propriétés courantes pour la photo de profil
  if (decoded && (decoded as any).profilePicture) {
    return (decoded as any).profilePicture;
  }
  if (decoded && (decoded as any).avatar) {
    return (decoded as any).avatar;
  }
  // Valeur par défaut si aucune photo trouvée
  return "/placeholder.svg";
};

export const getTokenExpirationDate = (): Date | null => {
  const decoded = getDecodedToken();
  if (!decoded || !decoded.exp) return null;
  return new Date(decoded.exp * 1000);
};

export const getTokenRemainingTime = (): number | null => {
  const expirationDate = getTokenExpirationDate();
  if (!expirationDate) return null;
  
  const remainingMs = expirationDate.getTime() - Date.now();
  return Math.max(0, Math.floor(remainingMs / 1000)); 
};