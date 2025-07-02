"use client";

/**
 * Composant HomePageWrapper simplifié
 * Correspond à l'implémentation originale React Router
 * Affiche le composant correspondant au rôle utilisateur passé en paramètre
 */
import LandingPage from './welcomePage/welcomePageNew';
import SimpleUserHomePage from '../SimpleUserComponent/HomePageSimpleUser';
import HomePage from './HomePage/HomePage';
import SyndicalistHomePage from '../SyndicalistComponents/HomePageSyndicaliste';
import { useEffect, useState } from 'react';
import { getRole } from '../services/AccountService';

interface HomePageWrapperProps {
  // Si userRole est fourni directement, l'utiliser, sinon le récupérer du token
  userRole?: string | null;
}

export default function HomePageWrapper({ userRole: propUserRole }: HomePageWrapperProps = {}) {
  const [userRole, setUserRole] = useState<string | null>(propUserRole || null);
  const [isLoading, setIsLoading] = useState(propUserRole === undefined);

  useEffect(() => {
    // Si le rôle n'est pas fourni en props, le récupérer du token
    if (propUserRole === undefined && typeof window !== 'undefined') {
      try {
        const role = getRole();
        setUserRole(role);
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    }
  }, [propUserRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#6BAED6] to-indigo-200">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-indigo-900">Chargement de SyndicManager...</p>
        </div>
      </div>
    );
  }

  // La logique de routage selon le rôle utilisateur
  switch (userRole) {
    case 'guest':
      return <SimpleUserHomePage />;
    case 'syndiqué':
      return <HomePage />;
    case 'syndicalist':
      return <SyndicalistHomePage />;
    default:
      // Rôle non reconnu ou utilisateur non authentifié
      return <LandingPage />;
  }
}
