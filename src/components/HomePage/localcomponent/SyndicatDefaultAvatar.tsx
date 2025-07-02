import React from "react";

interface SyndicatDefaultAvatarProps {
  name?: string;
  size?: number;
  className?: string;
}

export const SyndicatDefaultAvatar: React.FC<SyndicatDefaultAvatarProps> = ({ name = "", size = 200, className = "" }) => {
  // Générer une couleur unique basée sur le nom du syndicat
  const generateColor = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = ((hash % 60) + 210) % 360; // Entre 210 et 270 (bleu à violet)
    const saturation = 65 + (hash % 20); // Entre 65% et 85%
    const lightness = 45 + (hash % 20); // Entre 45% et 65%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Obtenir les initiales à partir du nom
  const getInitials = (text: string) => {
    if (!text) return "S";
    const words = text.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);
  const bgColor = generateColor(name || "Syndicat");
  const textColor = "white";

  // Identifiant unique pour les éléments SVG basé sur le nom
  const safeId = (name || "").replace(/[^a-z0-9]/gi, '-').toLowerCase() || "default";
  const uniqueId = `syndicat-${safeId}-${Math.floor(Math.random() * 1000)}`;

  // Deuxième couleur complémentaire pour le dégradé
  const getComplementaryColor = (hslColor: string) => {
    const matches = hslColor.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);
    if (!matches) return 'hsl(230, 70%, 50%)';
    const h = (parseInt(matches[1]) + 30) % 360;
    const s = matches[2];
    const l = parseInt(matches[3]) - 10;
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const secondaryColor = getComplementaryColor(bgColor);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${bgColor}, ${secondaryColor})`,
        color: textColor,
        position: "relative",
      }}
    >
      {/* Image de fond SVG occupant tout l'espace */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        }}
      >
        <defs>
          <filter id={`shadow-${uniqueId}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
          </filter>
          <linearGradient id={`overlay-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {/* Arrière-plan avec dégradé subtil */}
        <rect width="100%" height="100%" fill={`url(#overlay-${uniqueId})`} />
        {/* Motif de grille - structure/organisation */}
        <g opacity="0.07">
          <line x1="0" y1="20" x2="100" y2="20" stroke="white" strokeWidth="1" />
          <line x1="0" y1="40" x2="100" y2="40" stroke="white" strokeWidth="1" />
          <line x1="0" y1="60" x2="100" y2="60" stroke="white" strokeWidth="1" />
          <line x1="0" y1="80" x2="100" y2="80" stroke="white" strokeWidth="1" />
          <line x1="20" y1="0" x2="20" y2="100" stroke="white" strokeWidth="1" />
          <line x1="40" y1="0" x2="40" y2="100" stroke="white" strokeWidth="1" />
          <line x1="60" y1="0" x2="60" y2="100" stroke="white" strokeWidth="1" />
          <line x1="80" y1="0" x2="80" y2="100" stroke="white" strokeWidth="1" />
        </g>
        {/* Formes symbolisant la collaboration */}
        <g opacity="0.13">
          <circle cx="50" cy="50" r="34" fill="none" stroke="white" strokeWidth="4" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="2" />
        </g>
        {/* Icône "mains" centrale */}
        <g opacity="0.25" filter={`url(#shadow-${uniqueId})`}>
          <path
            d="M 45 55
               C 40 50, 37 48, 35 45
               C 33 42, 33 38, 35 35
               C 37 32, 40 32, 43 34
               C 43 34, 45 35, 47 37
               L 50 40
               L 50 25
               C 50 23, 52 20, 55 20
               C 58 20, 60 23, 60 25
               L 60 35
               L 60 30
               C 60 28, 62 25, 65 25
               C 68 25, 70 28, 70 30
               Z"
            fill="white"
          />
          <path
            d="M 70 55
               C 75 50, 78 48, 80 45
               C 82 42, 82 38, 80 35
               C 78 32, 75 32, 72 34
               C 72 34, 70 35, 68 37
               L 65 40
               L 65 25
               C 65 23, 63 20, 60 20
               C 57 20, 55 23, 55 25
               L 55 35
               L 55 30
               C 55 28, 53 25, 50 25
               C 47 25, 45 28, 45 30
               Z"
            fill="white"
          />
          {/* Cercle central unifiant les mains */}
          <circle cx="50" cy="55" r="5" fill="white" />
        </g>
        {/* Symbole d'unité (chaîne/maillon) au bas */}
        <g opacity="0.2" transform="translate(25, 75) scale(0.5)">
          <path
            d="M 20 20
               C 10 20, 10 30, 20 30
               L 30 30
               C 40 30, 40 20, 30 20
               Z"
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M 50 20
               C 40 20, 40 30, 50 30
               L 60 30
               C 70 30, 70 20, 60 20
               Z"
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M 80 20
               C 70 20, 70 30, 80 30
               L 90 30
               C 100 30, 100 20, 90 20
               Z"
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeLinejoin="round"
          />
        </g>
        {/* Formes symbolisant l'équilibre des forces */}
        <g opacity="0.15">
          <rect x="20" y="10" width="20" height="5" rx="2" fill="white" />
          <rect x="60" y="10" width="20" height="5" rx="2" fill="white" />
          <rect x="40" y="85" width="20" height="5" rx="2" fill="white" />
        </g>
        {/* Symboles aux coins pour remplir l'espace */}
        <g opacity="0.1">
          <circle cx="10" cy="10" r="8" fill="white" />
          <circle cx="90" cy="10" r="8" fill="white" />
          <circle cx="10" cy="90" r="8" fill="white" />
          <circle cx="90" cy="90" r="8" fill="white" />
        </g>
        {/* Éléments de fond supplémentaires pour remplir l'espace */}
        <g opacity="0.05">
          <path d="M 0 0 L 100 100" stroke="white" strokeWidth="0.5" />
          <path d="M 100 0 L 0 100" stroke="white" strokeWidth="0.5" />
          <rect x="0" y="0" width="100" height="100" stroke="white" strokeWidth="1" fill="none" />
        </g>
      </svg>
      {/* Cercle avec initiales */}
      <div
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{
          width: `${size * 0.45}px`,
          height: `${size * 0.45}px`,
          fontSize: `${size * 0.22}px`,
          fontWeight: "bold",
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.1), inset 0 0 5px rgba(255, 255, 255, 0.1)'
        }}
      >
        <span
          style={{
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.05em'
          }}
        >
          {initials}
        </span>
      </div>
    </div>
  );
};

export default SyndicatDefaultAvatar;
