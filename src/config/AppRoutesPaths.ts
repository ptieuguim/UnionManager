/**
 * Configuration centralisée des chemins de routes de l'application
 * Équivalent Next.js de l'ancien AppRoutesPaths.js
 */

export const AppRoutesPaths = {
  // Routes publiques
  loginPage: "/login",
  registerPage: "/register",
  welcomePage: "/",
  profil: "/user/profile",
  
  // Routes utilisateur
  userPage: "/user",
  userHomePage: "/user/home",
  userSyndicat: "/user/syndicats",
  userSyndicatDetails: "/user/syndicat",  // Next.js : /user/syndicat/[id]
  userExplorer: "/user/explorer",
  userSyndicatApp: "/user/syndicat-app",
  userProfil: "/user/profile",
  createSyndicat: "/user/createSyndicat",
  
  // Routes business (syndicalistes)
  syndicalistHomePage: "/business/home",
};

/**
 * Fonctions utilitaires pour travailler avec les routes
 */

// Fonction pour obtenir l'URL du détail d'un syndicat
export const getSyndicatDetailsUrl = (id: string | number): string => {
  return `${AppRoutesPaths.userSyndicatDetails}/${id}`;
};

export default AppRoutesPaths;
