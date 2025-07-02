// Données des antennes - TypeScript
export interface Antenne {
  id: number;
  nom: string;
  localisation: string;
  responsable: string;
  telephone: string;
  email: string;
  membres: number;
  specialites: string[];
  description: string;
}

export const antennesData: Antenne[] = [
  {
    id: 1,
    nom: "Antenne Centre-Ville",
    localisation: "Avenue de l'Indépendance, Yaoundé",
    responsable: "Marie Nguema",
    telephone: "+237 6XX XX XX XX",
    email: "centre@syndicat.cm",
    membres: 1250,
    specialites: ["Administration", "Finance", "RH"],
    description: "Antenne principale située au cœur de Yaoundé, spécialisée dans les services administratifs."
  },
  {
    id: 2,
    nom: "Antenne Douala Port",
    localisation: "Zone Portuaire, Douala",
    responsable: "Jean-Claude Mbida",
    telephone: "+237 6XX XX XX XX",
    email: "douala@syndicat.cm",
    membres: 890,
    specialites: ["Transport", "Logistique", "Commerce"],
    description: "Antenne spécialisée dans les secteurs du transport et de la logistique portuaire."
  },
  {
    id: 3,
    nom: "Antenne Nord",
    localisation: "Garoua, Région du Nord",
    responsable: "Aminata Soulé",
    telephone: "+237 6XX XX XX XX",
    email: "nord@syndicat.cm",
    membres: 456,
    specialites: ["Agriculture", "Élevage", "Artisanat"],
    description: "Antenne dédiée aux secteurs agricoles et artisanaux du Nord Cameroun."
  },
  {
    id: 4,
    nom: "Antenne Ouest",
    localisation: "Bafoussam, Région de l'Ouest",
    responsable: "Paul Kamdem",
    telephone: "+237 6XX XX XX XX",
    email: "ouest@syndicat.cm",
    membres: 623,
    specialites: ["Agriculture", "Café", "Cacao"],
    description: "Antenne spécialisée dans les filières café-cacao et l'agriculture de l'Ouest."
  }
];
