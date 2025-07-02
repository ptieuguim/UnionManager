"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ChevronRight, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  participants: number;
}

interface EventCardProps {
  event: EventData;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden mb-6 relative w-full max-w-2xl mx-auto transform transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
          <div className="flex items-center text-white text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{event.date}</span>
            <Clock className="w-4 h-4 ml-4 mr-2" />
            <span>{event.time}</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-5 h-5 mr-2 text-blue-500" />
          <span>{event.location}</span>
        </div>
        <p className="text-gray-700 mb-4">
          {isExpanded ? event.description : `${event.description.slice(0, 100)}...`}
        </p>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 font-semibold flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExpanded ? "Voir moins" : "Lire la suite"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </motion.button>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center text-gray-600">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            <span>
              {event.participants} {t("participants")}
            </span>
          </div>
          <motion.button
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("sinscrire")}
            <ExternalLink className="w-4 h-4 ml-2" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export const EventsList: React.FC<{ limit?: number }> = ({ limit = 3 }) => {
  const events: EventData[] = [
    {
      id: "1",
      title: "Forum sur la Sécurité Routière",
      date: "15 Juillet 2023",
      time: "09:00 - 17:00",
      location: "Palais des Congrès, Yaoundé",
      description:
        "Rejoignez-nous pour une journée de discussions et d'ateliers sur l'amélioration de la sécurité routière au Cameroun. Nous aborderons les défis actuels, les meilleures pratiques internationales et les solutions innovantes pour réduire les accidents de la route.",
      image:
        "https://images.unsplash.com/photo-1632276536839-84cad7fd03b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      participants: 250,
    },
    {
      id: "2",
      title: "Conférence sur le Transport Durable",
      date: "22 Août 2023",
      time: "10:00 - 16:00",
      location: "Hôtel Hilton, Douala",
      description:
        "Explorez l'avenir du transport durable au Cameroun lors de notre conférence annuelle. Des experts nationaux et internationaux partageront leurs insights sur les technologies vertes, les politiques de transport urbain et les opportunités pour un secteur des transports plus écologique.",
      image:
        "https://images.unsplash.com/photo-1530099486328-e021101a494a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2547&q=80",
      participants: 180,
    },
    {
      id: "3",
      title: "Atelier sur les Droits des Chauffeurs",
      date: "5 Septembre 2023",
      time: "14:00 - 18:00",
      location: "Centre Culturel Français, Yaoundé",
      description:
        "Cet atelier interactif vise à informer les chauffeurs de taxi et de bus sur leurs droits et responsabilités. Des avocats spécialisés en droit du travail et des représentants syndicaux animeront des sessions sur la législation du travail, la sécurité sociale et la négociation collective.",
      image:
        "https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2669&q=80",
      participants: 100,
    },
  ];

  return (
    <div className="max-w-full mx-auto py-6 px-4">
      <AnimatePresence>
        {events.slice(0, limit).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default EventsList;
