import { Compass, Home, Settings, Users, LucideIcon } from "lucide-react";

export interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  gradient: string;
  description: string;
  route: string;
}

export const navItems: NavItem[] = [
  {
    id: "dashboard",
    icon: Home,
    label: "Accueil",
    gradient: "from-blue-500 to-indigo-600",
    description: "Actualité",
    route: "/user/home",
  },
  {
    id: "syndicats",
    icon: Users,
    label: "Mes Syndicats",
    gradient: "from-blue-500 to-indigo-600",
    description: "Gérer vos organisations",
    route: "/user/syndicats",
  },
  {
    id: "explorer",
    icon: Compass,
    label: "Explorer",
    gradient: "from-blue-500 to-indigo-600",
    description: "Découvrir de nouveaux syndicats",
    route: "/user/explorer",
  },
  {
    id: "parametres",
    icon: Settings,
    label: "Paramètres",
    gradient: "from-blue-500 to-indigo-600",
    description: "Configuration du compte",
    route: "/parametres",
  },
];
