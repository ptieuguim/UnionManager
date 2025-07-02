// Données fake de notifications - TypeScript
import { AlertCircle, Calendar, CheckCircle, FileText } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NotificationFake {
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  gradient: string;
}

export const notifications: NotificationFake[] = [
  {
    title: "Nouvelle réunion planifiée",
    description: "Assemblée générale prévue pour demain à 14h",
    time: "Il y a 5 minutes",
    icon: Calendar,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "Cotisation reçue",
    description: "Paiement confirmé de Jean Dupont",
    time: "Il y a 30 minutes",
    icon: CheckCircle,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    title: "Nouveau document partagé",
    description: "Rapport mensuel disponible",
    time: "Il y a 1 heure",
    icon: FileText,
    gradient: "from-purple-500 to-pink-600",
  },
  {
    title: "Alerte importante",
    description: "Mise à jour des statuts requise",
    time: "Il y a 2 heures",
    icon: AlertCircle,
    gradient: "from-orange-500 to-red-600",
  },
];
