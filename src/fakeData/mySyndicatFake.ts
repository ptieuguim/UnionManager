// Données fake de mes syndicats - TypeScript
export interface Syndicat {
  id: number;
  name: string;
  type: string;
  members: number;
  location: string;
  image: string;
  trend: 'up' | 'down' | 'stable';
}

export const fakeData: Syndicat[] = [
  {
    id: 1,
    name: "Syndicat National des Transporteurs Routiers du Cameroun",
    type: "Routier",
    members: 15000,
    location: "National",
    image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    trend: "up",
  },
  {
    id: 2,
    name: "Association des Chauffeurs de Taxi de Douala",
    type: "Urbain",
    members: 8000,
    location: "Douala",
    image: "https://images.unsplash.com/photo-1559223607-a43c990c692c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    trend: "stable",
  },
  {
    id: 3,
    name: "Syndicat des Transporteurs Ferroviaires du Cameroun",
    type: "Ferroviaire",
    members: 5000,
    location: "National",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    trend: "down",
  },
  {
    id: 5,
    name: "Syndicat des Conducteurs de Moto-taxis de Yaoundé",
    type: "Moto-taxi",
    members: 12000,
    location: "Yaoundé",
    image: "https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    trend: "up",
  },
  {
    id: 6,
    name: "Association des Transporteurs Interurbains du Cameroun",
    type: "Interurbain",
    members: 7000,
    location: "National",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    trend: "stable",
  },
  {
    id: 8,
    name: "Association des Pilotes de Ligne du Cameroun",
    type: "Aérien",
    members: 500,
    location: "National",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    trend: "stable",
  },
  {
    id: 9,
    name: "Syndicat des Conducteurs de Bus Scolaires de Bamenda",
    type: "Scolaire",
    members: 2000,
    location: "Bamenda",
    image: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    trend: "up",
  },
  {
    id: 10,
    name: "Association des Transporteurs de Marchandises du Nord",
    type: "Fret",
    members: 4500,
    location: "Nord",
    image: "https://images.unsplash.com/photo-1586191582151-f73872dfd183?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    trend: "down",
  },
  {
    id: 12,
    name: "Association des Conducteurs de Taxis-Brousse de l'Ouest",
    type: "Rural",
    members: 3000,
    location: "Ouest",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    trend: "up",
  },
  {
    id: 13,
    name: "Syndicat des Transporteurs Touristiques du Cameroun",
    type: "Tourisme",
    members: 1800,
    location: "National",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    trend: "stable",
  },
];
