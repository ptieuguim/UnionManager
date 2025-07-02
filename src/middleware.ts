import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Interface pour le décodage du token JWT
interface JWTPayload {
  sub: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  exp: number;
  authorities?: string[];
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    emailVerified: boolean;
    phoneNumber: string | null;
    phoneNumberVerified: boolean;
  };
}

// Liste des routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = ['/', '/login', '/register'];

export function middleware(request: NextRequest) {
  // Récupération du token depuis les cookies
  const token = request.cookies.get('access_token')?.value;
  const path = request.nextUrl.pathname;
  
  console.log(`[Middleware] Path: ${path} | Token found: ${!!token}`);
  
  // Si la route est publique, autoriser l'accès sans vérification
  if (publicRoutes.includes(path)) {
    // Si l'utilisateur est déjà authentifié et essaie d'accéder à une route publique
    // le rediriger vers sa page d'accueil en fonction de son rôle
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        const currentTime = Date.now() / 1000;
        
        console.log(`[Middleware] Token décodé pour route publique. Rôle: ${decoded.role}, Expiration: ${new Date(decoded.exp * 1000).toISOString()}`);
        
        // Vérifier si le token n'est pas expiré
        if (decoded.exp > currentTime) {
          const role = decoded.role;
          
          // Rediriger en fonction du rôle
          // Mapper les rôles de l'API vers les rôles de l'application
          console.log(`[Middleware] Rôle détecté dans le token: ${role}`);
          switch (role) {
            case 'syndiqué':
            case 'USER': // Ajouter le rôle USER comme équivalent à syndiqué
              return NextResponse.redirect(new URL('/user/home', request.url));
            case 'syndicalist':
            case 'ADMIN': // Potentiellement mapper ADMIN à syndicalist
              return NextResponse.redirect(new URL('/business/home', request.url));
            case 'guest':
              return NextResponse.redirect(new URL('/user/home', request.url));
            default:
              console.log(`[Middleware] Rôle non reconnu: ${role}, accès à la page publique`);
              // Si le rôle n'est pas reconnu, laisser accéder à la page publique
              return NextResponse.next();
          }
        }
      } catch (err) {
        // En cas d'erreur de décodage, supprimer le cookie invalide
        console.error("[Middleware] Erreur de décodage du token pour route publique!", err);
        const response = NextResponse.next();
        response.cookies.delete('access_token');
        return response;
      }
    }
    
    // Si pas de token ou token expiré, laisser accéder à la route publique
    return NextResponse.next();
  }
  
  // Si la route nécessite une authentification, vérifier le token
  if (!token) {
    // Rediriger vers la page d'accueil si pas de token
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    
    // Déboguer le contenu complet du token décodé
    console.log('[Middleware] Token décodé:', JSON.stringify(decoded, null, 2));
    
    // Si le token est expiré, rediriger vers la page de connexion
    if (decoded.exp <= currentTime) {
      console.log('[Middleware] Token expiré, redirection vers /login');
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_token');
      return response;
    }
    
    // Déterminer le rôle à partir de authorities[] ou de role
    // Utiliser la première autorité comme rôle si authorities existe
    let role = decoded.role;
    if (!role && decoded.authorities && decoded.authorities.length > 0) {
      role = decoded.authorities[0];
      console.log(`[Middleware] Rôle extrait de authorities: ${role}`);
    }
    
    // Si aucun rôle n'est trouvé, vérifier dans l'objet user
    if (!role && decoded.user) {
      // Tenter d'extraire le rôle d'autres propriétés potentielles
      role = 'USER'; // Rôle par défaut si l'utilisateur existe mais sans rôle spécifié
      console.log(`[Middleware] Rôle par défaut utilisé: ${role}`);
    }
    
    if (!role) {
      console.log('[Middleware] Aucun rôle trouvé dans le token, accès refusé');
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_token');
      return response;
    }
    
    console.log(`[Middleware] Rôle déterminé: ${role}, Expiration: ${new Date(decoded.exp * 1000).toISOString()}`);
    
    // Routes spécifiques aux syndicalistes (syndicalist)
    if (path.startsWith('/business') && role !== 'syndicalist' && role !== 'ADMIN') {
      console.log(`[Middleware] Accès refusé à ${path}: rôle ${role} non autorisé pour /business`);
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Routes spécifiques aux utilisateurs standards et syndiqués
    // Ajouter le rôle USER comme autorisé pour les routes /user
    if (path.startsWith('/user') && role !== 'guest' && role !== 'syndiqué' && role !== 'USER') {
      console.log(`[Middleware] Accès refusé à ${path}: rôle ${role} non autorisé pour /user`);
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    console.log(`[Middleware] Accès autorisé à ${path} pour le rôle ${role}`);
    // Si tout est en ordre, autoriser l'accès
    return NextResponse.next();
  } catch (err) {
    // En cas d'erreur de décodage, rediriger vers la page de connexion
    console.error("[Middleware] Erreur de décodage du token pour route protégée!", err);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('access_token');
    return response;
  }
}

// Configurer sur quelles routes le middleware doit s'exécuter
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
