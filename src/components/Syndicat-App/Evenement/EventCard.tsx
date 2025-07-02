"use client";

import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Edit3, Trash2, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDateForDisplay } from "@/utils/dataFormatUtils";
import ParticipantsList from "./ParticipantsList";

interface Author {
  id: string;
  name: string;
  // profileImage?: string;
}

interface Participant {
  id: string;
  name?: string;
}

export interface EventCardProps {
  event: {
    id: string | number;
    title: string;
    description: string;
    location?: string;
    startDate: string | Date;
    endDate: string | Date;
    author?: Author;
    participants?: Participant[];
    images?: string[];
    // category?: string;
    // isPublic?: boolean;
  };
  onEdit: (event: any) => void;
  onDelete: (eventId: string | number) => void;
  onParticipateToggle: (eventId: string | number) => void;
  currentUserId?: string | null;
  isParticipatingLoading?: {
    eventId?: string | number;
    loading?: boolean;
  } | null;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onParticipateToggle,
  currentUserId,
  isParticipatingLoading,
}) => {
  const { t } = useTranslation();
  const isAuthor = event.author?.id === currentUserId;

  // Limite la description à un certain nombre de caractères pour l'aperçu
  const truncateDescription = (text: string, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.03, boxShadow: "0px 8px 16px rgba(0,0,0,0.08)" },
    tap: { scale: 0.99 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 flex flex-col h-full"
    >
      {event.images && event.images.length > 0 ? (
        <img
          src={event.images[0]}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <ImageIcon className="w-16 h-16 text-gray-400" />
        </div>
      )}

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3
          className="text-lg sm:text-xl font-semibold text-blue-700 mb-2 truncate"
          title={event.title}
        >
          {event.title}
        </h3>

        <div className="text-xs sm:text-sm text-gray-500 mb-3 space-y-1">
          <div className="flex items-center">
            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-indigo-500 flex-shrink-0" />
            <span>
              {formatDateForDisplay(event.startDate)} - {formatDateForDisplay(event.endDate)}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-indigo-500 flex-shrink-0" />
              <span className="truncate" title={event.location}>
                {event.location}
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 flex-grow min-h-[40px] sm:min-h-[60px]">
          {truncateDescription(event.description)}
        </p>

        <ParticipantsList
          eventId={event.id}
          participants={event.participants || []}
          currentUserId={currentUserId}
          onToggleParticipation={onParticipateToggle}
          isLoading={!!isParticipatingLoading && isParticipatingLoading.eventId === event.id && isParticipatingLoading.loading}
        />

        {isAuthor && (
          <div className="flex space-x-2 mt-4 border-t border-gray-200 pt-4">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(event)}
              className="flex-1 flex items-center justify-center text-xs sm:text-sm text-blue-600 hover:text-blue-700 py-2 px-3 rounded-md border border-blue-400 hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
              title={t("modifier_evenement", "Modifier l'événement")}
            >
              <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
              {t("modifier", "Modifier")}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.05)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(event.id)}
              className="flex-1 flex items-center justify-center text-xs sm:text-sm text-red-600 hover:text-red-700 py-2 px-3 rounded-md border border-red-400 hover:border-red-500 hover:bg-red-50 transition-colors duration-200"
              title={t("supprimer_evenement", "Supprimer l'événement")}
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
              {t("supprimer", "Supprimer")}
            </motion.button>
          </div>
        )}
        {!isAuthor && event.author?.name && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-center">
            <span className="text-xs text-gray-500">
              {t("organise_par", "Organisé par")}: <span className="font-medium">{event.author.name}</span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
