// Données fake d'exploration de syndicats - TypeScript
export interface ExploreSyndicat {
  id: number;
  name: string;
  type: string;
  members: number;
  location: string;
  image: string;
}

export const exploresyndicat: ExploreSyndicat[] = [
  {
    id: 1,
    name: "Fédération des Transporteurs de l'Ouest Cameroun",
    type: "Régional",
    members: 9500,
    location: "Ouest Cameroun",
    image: "https://images.unsplash.com/photo-1594495894542-a46cc73e081a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 2,
    name: "Syndicat des Conducteurs de Bus de Yaoundé",
    type: "Urbain",
    members: 6200,
    location: "Yaoundé",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 3,
    name: "Association des Transporteurs Maritimes du Littoral",
    type: "Maritime",
    members: 2800,
    location: "Littoral",
    image: "https://images.unsplash.com/photo-1577032229840-33197764440d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 4,
    name: "Union des Chauffeurs de Camions du Nord",
    type: "Fret",
    members: 4100,
    location: "Nord",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 5,
    name: "Coopérative des Moto-taximen de Douala",
    type: "Moto-taxi",
    members: 15000,
    location: "Douala",
    image: "https://images.unsplash.com/photo-1582558720963-5b43f8b2e5af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 6,
    name: "Syndicat National des Transporteurs Aériens",
    type: "Aérien",
    members: 1800,
    location: "National",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 7,
    name: "Syndicat National des Transporteurs Maritimes",
    type: "Maritime",
    members: 2200,
    location: "National",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80"
  },
  {
    id: 8,
    name: "Syndicat National des Conducteurs de Train",
    type: "Ferroviaire",
    members: 4500,
    location: "National",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 9,
    name: "Syndicat National des Chauffeurs de Taxi",
    type: "Taxi",
    members: 35000,
    location: "National",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 10,
    name: "Syndicat National des Transporteurs Sanitaires",
    type: "Médical",
    members: 6800,
    location: "National",
    image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 11,
    name: "Syndicat National des Livreurs Professionnels",
    type: "Livraison",
    members: 12500,
    location: "National",
    image: "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 12,
    name: "Syndicat National des Conducteurs de Bus",
    type: "Bus",
    members: 28000,
    location: "National",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 13,
    name: "Syndicat National des Transporteurs de Matières Dangereuses",
    type: "Dangereux",
    members: 3400,
    location: "National",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 14,
    name: "Syndicat National des Pêcheurs-Transporteurs",
    type: "Aquatique",
    members: 8900,
    location: "National",
    image: "https://images.unsplash.com/photo-1534375970777-9d3398845a83?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 15,
    name: "Syndicat National des Transporteurs Touristiques",
    type: "Tourisme",
    members: 5600,
    location: "National",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 16,
    name: "Syndicat National des Conducteurs de Poids Lourds",
    type: "Camions",
    members: 41200,
    location: "National",
    image: "https://images.unsplash.com/photo-1548534441-e99c2d96a798?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];
