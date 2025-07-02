"use client";
import React from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Clock, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

export interface Publication {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
}

interface PublicationCardProps {
  publication: Publication;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ publication }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-md p-6 mb-6 relative w-full max-w-2xl mx-auto transform transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex items-center mb-4">
        <img
          src={publication.author.avatar || "/placeholder.svg"}
          alt={publication.author.name}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h4 className="font-semibold text-lg text-gray-800">{publication.author.name}</h4>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>{publication.timestamp}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{publication.content}</p>
      {publication.image && (
        <img
          src={publication.image || "/placeholder.svg"}
          alt="Publication content"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}
      <div className="flex justify-between text-sm text-gray-500">
        <span className="flex items-center">
          <Heart className="w-4 h-4 mr-1 text-red-500" />
          {publication.likes} {t("jaime")}
        </span>
        <span className="flex items-center">
          <MessageCircle className="w-4 h-4 mr-1 text-blue-500" />
          {publication.comments} Commentaires
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center text-blue-600"
        >
          <Share2 className="w-4 h-4 mr-1" />
          {t("partager")}
        </motion.button>
      </div>
    </motion.div>
  );
};

export const Publications: React.FC<{ limit?: number }> = ({ limit = 3 }) => {
  const publications: Publication[] = [
    {
      id: 1,
      author: {
        name: "Syndicat National des Transporteurs Routiers du Cameroun",
        avatar:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
      },
      content:
        "Nous sommes heureux d'annoncer que suite à nos négociations avec le Ministère des Transports, un nouveau programme de formation continue pour les chauffeurs de bus sera lancé le mois prochain. Cette initiative vise à améliorer la sécurité routière et la qualité du service dans notre secteur.",
      image:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
      timestamp: "Il y a 2 heures",
      likes: 245,
      comments: 37,
    },
    {
      id: 2,
      author: {
        name: "Association des Conducteurs de Taxi de Douala",
        avatar:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
      },
      content:
        "Chers collègues, nous organisons une réunion d'urgence ce samedi pour discuter de l'impact de la hausse des prix du carburant sur notre activité. Venez nombreux pour faire entendre votre voix et participer à l'élaboration de notre stratégie de réponse.",
      image:
        "https://images.unsplash.com/photo-1559223607-b4d0555ae227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
      timestamp: "Il y a 5 heures",
      likes: 189,
      comments: 56,
    },
    {
      id: 3,
      author: {
        name: "Fédération des Transporteurs Interurbains",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
      },
      content:
        "Nous sommes fiers d'annoncer le lancement de notre nouvelle application mobile qui permettra aux voyageurs de réserver leurs billets en ligne pour les trajets interurbains. Cette innovation vise à améliorer l'expérience client et à moderniser notre secteur.",
      image:
        "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2672&q=80",
      timestamp: "Il y a 1 jour",
      likes: 412,
      comments: 89,
    },
  ];

  return (
    <div className="space-y-6">
      {publications.slice(0, limit).map((publication) => (
        <PublicationCard key={publication.id} publication={publication} />
      ))}
    </div>
  );
};

export default Publications;
