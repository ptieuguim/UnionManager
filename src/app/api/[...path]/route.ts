import { NextRequest, NextResponse } from 'next/server';

/**
 * Ce fichier route.ts permet de créer un proxy API pour rediriger les requêtes 
 * vers le serveur backend Spring Boot.
 * 
 * Il intercepte toutes les requêtes qui commencent par /api/ et les redirige.
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'PATCH');
}

export async function OPTIONS(
  // Next.js requires this function to have the correct signature, even if we don't use the parameters
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: NextRequest,
  // Removed unused params parameter
) {
  return handleCorsRequest();
}

// Fonction de gestion commune pour tous les types de requêtes
async function handleRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  
  const url = new URL(request.url);
  
  // Le chemin capturé par [...path] est déjà sans le préfixe '/api/'
  const pathWithoutPrefix = pathSegments.join('/');
  let targetUrl = `http://localhost:7014/synd/${pathWithoutPrefix}`;
  
  // Récupérer les paramètres de requête
  const searchParams = new URLSearchParams(url.search);
  if (searchParams.toString()) {
    targetUrl += `?${searchParams.toString()}`;
  }
  
  try {
    // Préparer les options pour la requête fetch
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
      },
    };
    
    // Ajouter le corps de la requête pour les méthodes non-GET
    if (method !== 'GET' && method !== 'HEAD') {
      const contentType = request.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        const body = await request.json();
        options.body = JSON.stringify(body);
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        options.body = formData;
      } else {
        // Pour les autres types de contenu
        options.body = await request.text();
      }
    }
    
    // Ajouter les en-têtes d'autorisation s'ils existent
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      options.headers = {
        ...options.headers,
        'Authorization': authHeader
      };
    }
    
    // Exécuter la requête vers le backend
    const response = await fetch(targetUrl, options);
    
    // Construire la réponse avec les en-têtes CORS
    const responseData = await response.text();
    
    // Utiliser exactement les mêmes en-têtes CORS que dans la configuration Vite
    const newResponse = new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
    
    return newResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse(JSON.stringify({ error: 'Erreur de proxy' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Traitement spécial pour les requêtes OPTIONS (CORS pre-flight)
function handleCorsRequest() {
  // Utiliser exactement les mêmes en-têtes CORS que dans la configuration Vite
  return new NextResponse(null, {
    status: 204, // No content
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400' // 24 heures
    }
  });
}
