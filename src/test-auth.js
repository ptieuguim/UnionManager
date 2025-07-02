// Script de test pour simuler l'authentification avec différents rôles
// Exécutez ce script dans la console du navigateur

// Ajout de la dépendance js-cookie
if (typeof Cookies === 'undefined') {
  console.log('📝 Chargement de js-cookie...');
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js';
  document.head.appendChild(script);
  console.log('Veuillez attendre que js-cookie soit chargé, puis réessayez.');
} else {
  console.log('✅ js-cookie est déjà chargé!');
}

function createTestToken(role) {
  // Création d'un payload JWT simplifié avec le rôle spécifié
  const payload = {
    sub: 'user123',
    userId: 'user123', // Ajouté pour correspondre à la structure attendue
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    role: role, // 'guest', 'syndiqué', ou 'syndicalist'
    exp: Math.floor(Date.now() / 1000) + 3600 // Token valide pour 1 heure
  };

  // Encode en Base64URL (simplifié, pas un vrai JWT)
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })).replace(/=/g, '');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');
  const signature = 'test_signature'; // Signature factice pour le test

  return `${header}.${encodedPayload}.${signature}`;
}

// Fonction pour tester un rôle spécifique
function testRole(role) {
  if (typeof Cookies === 'undefined') {
    console.error('❌ js-cookie n\'est pas chargé. Veuillez recharger la page et réessayer.');
    return;
  }
  
  console.log(`🔑 Simulation connexion avec le rôle: ${role}`);
  Cookies.set('access_token', createTestToken(role), { expires: 7, path: '/' });
  
  // Créer aussi les données utilisateur
  const userData = {
    id: 'user123',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    role: role
  };
  
  Cookies.set('user_data', JSON.stringify(userData), { expires: 7, path: '/' });
  
  // Recharger la page pour que le token prenne effet
  window.location.reload();
}

// Fonction pour se déconnecter (supprimer le token)
function testLogout() {
  if (typeof Cookies === 'undefined') {
    console.error('❌ js-cookie n\'est pas chargé. Veuillez recharger la page et réessayer.');
    return;
  }
  
  console.log('🚪 Simulation déconnexion');
  Cookies.remove('access_token', { path: '/' });
  Cookies.remove('user_data', { path: '/' });
  Cookies.remove('organisation_token', { path: '/' });
  
  // Recharger la page pour que la déconnexion prenne effet
  window.location.reload();
}

// Fonction pour vérifier l'état actuel
function checkStatus() {
  if (typeof Cookies === 'undefined') {
    console.error('❌ js-cookie n\'est pas chargé. Veuillez recharger la page et réessayer.');
    return;
  }
  
  const token = Cookies.get('access_token');
  if (!token) {
    console.log('❌ Non connecté. Aucun token trouvé.');
    return;
  }
  
  try {
    // Décoder le token pour extraire le rôle
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('❌ Format de token invalide.');
      return;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    console.log('✅ Connecté avec:');
    console.log(`- Rôle: ${payload.role}`);
    console.log(`- Nom: ${payload.firstName} ${payload.lastName}`);
    console.log(`- Email: ${payload.email}`);
    const expDate = new Date(payload.exp * 1000);
    console.log(`- Expiration: ${expDate.toLocaleString()}`);
  } catch (e) {
    console.error('❌ Erreur lors de l\'analyse du token:', e);
  }
}

// Affiche les commandes disponibles
console.log('== SCRIPT DE TEST AUTHENTIFICATION ==');
console.log('Pour tester, exécutez:');
console.log('- testRole("guest") - pour simuler un utilisateur simple');
console.log('- testRole("syndiqué") - pour simuler un utilisateur syndiqué');
console.log('- testRole("syndicalist") - pour simuler un syndicalist');
console.log('- testLogout() - pour simuler une déconnexion');
console.log('- checkStatus() - pour vérifier l\'authentification actuelle');

// Vérifier l'état actuel au chargement
if (typeof Cookies !== 'undefined') {
  checkStatus();
} else {
  console.log('ℹ️ Chargez d\'abord js-cookie, puis appelez checkStatus() pour voir l\'authentification actuelle.');
}
