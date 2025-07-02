"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import {
  X,
  Users,
  Calendar,
  MapPin,
  Zap,
  Heart,
  Share2,
  MessageCircle,
 
} from "lucide-react";

import {
  getFullName
} from "../../services/AccountService";

import dynamic from 'next/dynamic';

// Import dynamique de CreateSyndicatForm pour éviter le rendu côté serveur
const CreateSyndicatForm = dynamic(
  () => import("../NewCreateSyndicatPage/CreateSyndicatForm"),
  { ssr: false, loading: () => <div className="p-8 text-center">Chargement du formulaire...</div> }
);
import {Layout}  from "./localcomponent/Layout";

interface Author {
  name: string;
  avatar: string;
}

interface Comment {
  author: Author;
  content: string;
}

interface Syndicat {
  name: string;
  coverImage: string;
}

interface Publication {
  id: number;
  author: Author;
  content: string;
  image?: string;
  timestamp: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  syndicat: Syndicat;
  
  _type: 'publication';
  
}

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  author: Author;
  image?: string;
  isUpcoming: boolean;
  participants: { name: string }[];
  syndicat: Syndicat;
  _type: 'event';
}

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  author: Author;
  image?: string;
  isUpcoming: boolean;
  participants: { name: string }[];
  syndicat: Syndicat;
  _type: 'event';
}
type FeedItemType = (Publication | Event) & { _uniqueId: string };
// Données factices
const fakePublications: Publication[] = [ 
    {
        id: 1,
        author: {
            name: "Jean Dupont",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
        },
        content: "Aujourd'hui, nous avons eu une réunion productive sur les nouvelles mesures de sécurité. Qu'en pensez-vous ?",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop",
        timestamp: "Il y a 2 heures",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 15,
        comments: [
            {
                author: {
                    name: "Marie Martin",
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
                },
                content: "Excellente initiative ! J'ai hâte de voir les résultats.",
            },
            {
                author: {
                    name: "Luc Dubois",
                    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
                },
                content: "Pouvons-nous avoir plus de détails sur ces mesures ?",
            },
        ],
        syndicat: {
            name: "Syndicat des Travailleurs de l'Industrie",
            coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop",
        },
        _type: "publication"
    },
    {
        id: 2,
        author: {
            name: "Sophie Lefebvre",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
        },
        content: "Rappel : la formation sur les nouveaux outils de communication aura lieu demain à 14h. N'oubliez pas de vous inscrire !",
        timestamp: "Il y a 5 heures",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 8,
        comments: [],
        syndicat: {
            name: "Syndicat de l'Éducation Nationale",
            coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=400&fit=crop",
        },
        _type: "publication"
    },

    {
        id: 3,
        author: {
            name: "Sophie Martin",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
        },
        content: "Nouvelle proposition pour l'amélioration des conditions de travail en atelier. Vos suggestions sont les bienvenues !",
        image: "https://images.unsplash.com/photo-1521791055366-8d8d9e4c0f3c?w=1200&h=800&fit=crop",
        timestamp: "Il y a 3 heures",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        likes: 24,
        comments: [
            {
                author: {
                    name: "Marc Lambert",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                },
                content: "Il faudrait revoir l'ergonomie des postes de travail",
            },
            {
                author: {
                    name: "Julie Roux",
                    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
                },
                content: "Je propose une réunion thématique la semaine prochaine",
            },
        ],
        syndicat: {
            name: "Union des Ouvriers du Commerce",
            coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=400&fit=crop",
        },
        _type: "publication"
    },

    {
        id: 4,
        author: {
            name: "Éric Leroy",
            avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop",
        },
        content: "Appel à mobilisation pour la défense de nos acquis sociaux ! Réunion prévue vendredi à 18h.",
        image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ba?w=1200&h=800&fit=crop",
        timestamp: "Il y a 1 jour",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        likes: 42,
        comments: [
            {
                author: {
                    name: "Nathalie Petit",
                    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop",
                },
                content: "Présente ! Comptez sur moi pour diffuser l'info",
            }
        ],
        syndicat: {
            name: "Confédération des Métallurgistes",
            coverImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=400&fit=crop",
        },
        _type: "publication"
    },

    {
        id: 5,
        author: {
            name: "Isabelle Bernard",
            avatar: "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=150&h=150&fit=crop",
        },
        content: "Résultats du sondage sur la réforme des horaires : 78% d'avis favorables !",
        image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1200&h=800&fit=crop",
        timestamp: "Il y a 5 heures",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 33,
        comments: [
            {
                author: {
                    name: "Pauline Girard",
                    avatar: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=150&h=150&fit=crop",
                },
                content: "Super nouvelle ! Merci pour ce travail",
            },
            {
                author: {
                    name: "Antoine Moreau",
                    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop",
                },
                content: "Quand sera mise en place cette réforme ?",
            }
        ],
        syndicat: {
            name: "Fédération des Services Publics",
            coverImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=400&fit=crop",
        },
        _type: "publication"
    },

    {
        id: 6,
        author: {
            name: "Mohamed Ali",
            avatar: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=150&h=150&fit=crop",
        },
        content: "Atelier formation aux premiers secours : inscrivez-vous avant vendredi !",
        image: "https://images.unsplash.com/photo-1584722065001-ee7f8d5e0294?w=1200&h=800&fit=crop",
        timestamp: "Il y a 6 heures",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        likes: 19,
        comments: [],
        syndicat: {
            name: "Syndicat National des Transports",
            coverImage: "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=1200&h=400&fit=crop",
        },
        _type: "publication"
    },

    {
        id: 7,
        author: {
            name: "Camille Rousseau",
            avatar: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=150&h=150&fit=crop",
        },
        content: "Retour sur la manifestation d'hier : plus de 500 participants ! Merci à tous 🎉",
        image: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=1200&h=800&fit=crop",
        timestamp: "Il y a 4 jours",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        likes: 87,
        comments: [
            {
                author: {
                    name: "Thomas Legrand",
                    avatar: "https://images.unsplash.com/photo-1546820389-44d77e1f3b31?w=150&h=150&fit=crop",
                },
                content: "C'était historique ! À refaire vite",
            },
            {
                author: {
                    name: "Léa Fontaine",
                    avatar: "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=150&h=150&fit=crop",
                },
                content: "Quelle belle énergie ! Fière de notre mobilisation",
            }
        ],
        syndicat: {
            name: "Confédération Générale du Travail",
            coverImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=400&fit=crop",
        },
        _type: "publication"
    },

        {
            id: 8,
            author: {
                name: "Lucas Dupont",
                avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop",
            },
            content: "Victoire ! Notre négociation a abouti à une augmentation de 5% pour tous les employés. Merci à tous pour votre soutien indéfectible ! 💪",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop",
            timestamp: "Il y a 2 jours",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            likes: 156,
            comments: [
                {
                    author: {
                        name: "Sophie Martin",
                        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
                    },
                    content: "Bravo à toute l'équipe de négociation ! C'est une belle avancée pour nous tous.",
                },
                {
                    author: {
                        name: "Antoine Lefebvre",
                        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
                    },
                    content: "Excellent travail ! Cela montre l'importance d'un syndicat fort et uni.",
                }
            ],
            syndicat: {
                name: "Union des Travailleurs de l'Industrie",
                coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop",
            },
            _type: "publication"
        },
            {
                id: 9,
                author: {
                    name: "Marie Dubois",
                    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop",
                },
                content: "Rappel : Assemblée générale ce jeudi à 18h. Ordre du jour : conditions de travail et primes de fin d'année. Votre présence est cruciale !",
                image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=800&fit=crop",
                timestamp: "Il y a 6 heures",
                createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
                likes: 42,
                comments: [
                    {
                        author: {
                            name: "Pierre Moreau",
                            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
                        },
                        content: "Je serai présent. Ces sujets sont vraiment importants pour nous tous.",
                    }
                ],
                syndicat: {
                    name: "Syndicat National de l'Éducation",
                    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=400&fit=crop",
                },
                _type: "publication"
            },
            {
                id: 10,
                author: {
                    name: "Julien Leroy",
                    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop",
                },
                content: "Nouvelle loi sur le télétravail : quels sont vos droits ? Retrouvez notre analyse complète sur notre site web. Lien en commentaire.",
                image: "https://images.unsplash.com/photo-1585859615975-57a2e3e7c5a9?w=1200&h=800&fit=crop",
                timestamp: "Il y a 1 jour",
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                likes: 95,
                comments: [
                    {
                        author: {
                            name: "Emma Petit",
                            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
                        },
                        content: "Merci pour cette analyse ! Voici le lien pour ceux qui cherchent : www.syndicat-info.fr/teletravail",
                    },
                    {
                        author: {
                            name: "Thomas Roux",
                            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                        },
                        content: "Très utile, surtout avec tous ces changements récents. Merci !",
                    }
                ],
                syndicat: {
                    name: "Fédération Française des Travailleurs",
                    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop",
                },
                _type: "publication"
            },
            {
                id: 11,
                author: {
                    name: "Aurélie Blanc",
                    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
                },
                content: "Journée de la femme : retour sur notre table ronde sur l'égalité salariale. Merci à toutes les participantes pour ces échanges enrichissants !",
                image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=800&fit=crop",
                timestamp: "Il y a 3 jours",
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                likes: 128,
                comments: [
                    {
                        author: {
                            name: "Claire Durand",
                            avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop",
                        },
                        content: "Une journée inspirante ! J'espère que cela se traduira par des actions concrètes.",
                    },
                    {
                        author: {
                            name: "Marc Lemoine",
                            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
                        },
                        content: "Bravo pour cette initiative. L'égalité salariale est un combat qui nous concerne tous.",
                    }
                ],
                syndicat: {
                    name: "Syndicat pour l'Égalité Professionnelle",
                    coverImage: "https://images.unsplash.com/photo-1573164713619-24c711fe7878?w=1200&h=400&fit=crop",
                },
                _type: "publication"
            },
            {
                id: 12,
                author: {
                    name: "François Girard",
                    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop",
                },
                content: "Alerte : projet de fermeture de l'usine annoncé. Réunion d'urgence demain à 10h. Mobilisation générale !",
                image: "https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=1200&h=800&fit=crop",
                timestamp: "Il y a 5 heures",
                createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
                likes: 215,
                comments: [
                    {
                        author: {
                            name: "Nathalie Rousseau",
                            avatar: "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=150&h=150&fit=crop",
                        },
                        content: "C'est inadmissible ! Nous serons tous là pour défendre nos emplois.",
                    },
                    {
                        author: {
                            name: "Philippe Mercier",
                            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
                        },
                        content: "Je contacte la presse locale. Il faut que cette nouvelle soit connue de tous.",
                    },
                    {
                        author: {
                            name: "Isabelle Fournier",
                            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
                        },
                        content: "Nous ne laisserons pas faire ! Unissons-nous pour sauver notre usine et nos emplois.",
                    }
                ],
                syndicat: {
                    name: "Syndicat des Métallurgistes Unis",
                    coverImage: "https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=1200&h=400&fit=crop",
                },
                _type: "publication"
            },
            {
                id: 13,
                author: {
                    name: "Élodie Lambert",
                    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop",
                },
                content: "Succès de notre campagne pour de meilleures conditions de travail dans les hôpitaux ! La direction s'engage à embaucher 50 infirmiers supplémentaires. Continuons le combat ! 🏥👩‍⚕️👨‍⚕️",
                image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop",
                timestamp: "Il y a 8 heures",
                createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
                likes: 176,
                comments: [
                    {
                        author: {
                            name: "Dr. Martin Dupuis",
                            avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop",
                        },
                        content: "Une excellente nouvelle pour notre personnel et nos patients ! Merci pour votre engagement.",
                    },
                    {
                        author: {
                            name: "Sarah Nguyen",
                            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
                        },
                        content: "Enfin une avancée concrète ! Cela va vraiment améliorer nos conditions de travail.",
                    }
                ],
                syndicat: {
                    name: "Syndicat National de la Santé Publique",
                    coverImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=400&fit=crop",
                },
                _type: "publication"
            }


];
const fakeEvents: Event[] = [
    {
        id: 1,
        title: "Assemblée Générale Annuelle",
        description: "Rejoignez-nous pour notre Assemblée Générale Annuelle où nous discuterons des réalisations de l'année écoulée et planifierons l'avenir de notre syndicat. Votre voix compte !",
        location: "Salle de conférence principale, 123 Rue du Syndicat",
        startDate: new Date("2023-06-15T09:00:00"),
        endDate: new Date("2023-06-15T17:00:00"),
        author: {
            name: "Marie Dupont",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        },
        image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=1200&h=600&fit=crop",
        isUpcoming: true,
        participants: [
            { name: "Jean Dupont" },
            { name: "Marie Curie" },
            { name: "Pierre Martin" },
            { name: "Sophie Lefebvre" },
        ],
        syndicat: {
            name: "Syndicat des Travailleurs de l'Industrie",
            coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop",
        },
        _type: "event"
    },
    {
        id: 2,
        title: "Formation sur les Droits du Travail",
        description: "Ne manquez pas notre session de formation intensive sur les dernières mises à jour des lois du travail. Un expert juridique sera présent pour répondre à toutes vos questions.",
        location: "Salle de formation B, 45 Avenue des Travailleurs",
        startDate: new Date("2023-07-10T14:00:00"),
        endDate: new Date("2023-07-10T18:00:00"),
        author: {
            name: "Pierre Martin",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
        },
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=600&fit=crop",
        isUpcoming: true,
        participants: [{ name: "Lucie Moreau" }, { name: "Thomas Bernard" }, { name: "Camille Roux" }],
        syndicat: {
            name: "Syndicat de l'Éducation Nationale",
            coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=400&fit=crop",
        },
        _type: "event"
    },


        {
            id: 3,
            title: "Atelier sur la Négociation Collective",
            description: "Participez à notre atelier interactif sur les techniques de négociation collective. Apprenez à défendre efficacement les intérêts de vos collègues lors des discussions avec la direction.",
            location: "Centre de Conférences Étoile, 78 Rue de la République",
            startDate: new Date("2023-08-15T09:30:00"),
            endDate: new Date("2023-08-15T17:00:00"),
            author: {
                name: "Sophie Dubois",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
            },
            image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=600&fit=crop",
            isUpcoming: true,
            participants: [
                { name: "Marc Lefevre" },
                { name: "Julie Rousseau" },
                { name: "Antoine Dupuis" },
                { name: "Émilie Bouchard" }
            ],
            syndicat: {
                name: "Syndicat des Travailleurs du Commerce",
                coverImage: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1200&h=400&fit=crop",
            },
            _type: "event"
        },
        {
            id: 4,
            title: "Séminaire sur la Santé et la Sécurité au Travail",
            description: "Un séminaire essentiel pour tous les délégués syndicaux sur les dernières normes de santé et de sécurité au travail. Découvrez comment protéger vos collègues et améliorer les conditions de travail.",
            location: "Salle Harmonie, 15 Boulevard des Capucines",
            startDate: new Date("2023-09-05T10:00:00"),
            endDate: new Date("2023-09-05T16:30:00"),
            author: {
                name: "Laurent Mercier",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
            },
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&h=600&fit=crop",
            isUpcoming: true,
            participants: [
                { name: "Nathalie Lemoine" },
                { name: "Philippe Girard" },
                { name: "Isabelle Fournier" }
            ],
            syndicat: {
                name: "Syndicat de l'Industrie Métallurgique",
                coverImage: "https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=1200&h=400&fit=crop",
            },
            _type: "event"
        },
        {
            id: 5,
            title: "Conférence sur l'Égalité Professionnelle",
            description: "Rejoignez-nous pour une conférence inspirante sur l'égalité professionnelle entre les hommes et les femmes. Des intervenants de renom partageront leurs expériences et stratégies pour promouvoir l'égalité sur le lieu de travail.",
            location: "Palais des Congrès, 2 Place de la Porte Maillot",
            startDate: new Date("2023-10-12T13:00:00"),
            endDate: new Date("2023-10-12T18:00:00"),
            author: {
                name: "Marie-Claire Dupont",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
            },
            image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=600&fit=crop",
            isUpcoming: true,
            participants: [
                { name: "François Moreau" },
                { name: "Céline Petit" },
                { name: "Alexandre Lambert" },
                { name: "Aurélie Roux" },
                { name: "Thierry Martin" }
            ],
            syndicat: {
                name: "Syndicat Interprofessionnel pour l'Égalité",
                coverImage: "https://images.unsplash.com/photo-1573164713619-24c711fe7878?w=1200&h=400&fit=crop",
            },
            _type: "event"
        },
        {
            id: 6,
            title: "Forum sur la Digitalisation et l'Emploi",
            description: "Un forum crucial sur l'impact de la digitalisation sur l'emploi. Explorez les défis et les opportunités de l'ère numérique pour les travailleurs et les syndicats.",
            location: "Centre de Conventions Numérique, 55 Rue de l'Innovation",
            startDate: new Date("2023-11-08T09:00:00"),
            endDate: new Date("2023-11-08T17:30:00"),
            author: {
                name: "Julien Leclerc",
                avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop",
            },
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop",
            isUpcoming: true,
            participants: [
                { name: "Sandrine Durand" },
                { name: "Olivier Blanchard" },
                { name: "Valérie Rousseau" },
                { name: "Éric Lemaire" }
            ],
            syndicat: {
                name: "Syndicat des Travailleurs du Numérique",
                coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop",
            },
            _type: "event"
        },
        {
            id: 7,
            title: "Journée d'Étude sur les Retraites",
            description: "Une journée d'étude approfondie sur le système des retraites et les réformes en cours. Comprenez les enjeux et préparez-vous à défendre les droits des travailleurs.",
            location: "Maison des Syndicats, 32 Rue de la Solidarité",
            startDate: new Date("2023-12-03T08:30:00"),
            endDate: new Date("2023-12-03T16:00:00"),
            author: {
                name: "Gérard Bonnet",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
            },
            image: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=1200&h=600&fit=crop",
            isUpcoming: true,
            participants: [
                { name: "Martine Lefebvre" },
                { name: "Bernard Dubois" },
                { name: "Christine Morel" },
                { name: "Pascal Renard" },
                { name: "Sylvie Lambert" }
            ],
            syndicat: {
                name: "Syndicat National des Retraités",
                coverImage: "https://images.unsplash.com/photo-1574010498550-47bd2d56d962?w=1200&h=400&fit=crop",
            },
            _type: "event"
        },
        {
            id: 8,
            title: "Atelier sur la Gestion du Stress Professionnel",
            description: "Apprenez des techniques efficaces pour gérer le stress au travail et promouvoir le bien-être de vos collègues. Cet atelier pratique vous donnera des outils concrets pour améliorer la qualité de vie au travail.",
            location: "Espace Zen, 10 Rue de la Sérénité",
            startDate: new Date("2024-01-20T14:00:00"),
            endDate: new Date("2024-01-20T18:00:00"),
            author: {
                name: "Claire Dumont",
                avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop",
            },
            image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=600&fit=crop",
            isUpcoming: true,
            participants: [
                { name: "Thomas Leroy" },
                { name: "Anne Garnier" },
                { name: "Nicolas Perrin" },
                { name: "Hélène Bouvier" }
            ],
            syndicat: {
                name: "Syndicat pour le Bien-être au Travail",
                coverImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=400&fit=crop",
            },
            _type: "event"
        }

];

const stats = [
    { id: 1, title: "Membres", value: 1200, icon: Users },
    { id: 2, title: "Événements", value: 30, icon: Calendar },
    { id: 3, title: "Syndicats", value: 15, icon: MapPin },
];

const quickAccess = [
    { id: 1, title: "Créer un événement", icon: Calendar, action: () => console.log("Créer événement") },
    { id: 2, title: "Envoyer un message", icon: MessageCircle, action: () => console.log("Envoyer message") },
    { id: 3, title: "Consulter les statistiques", icon: Zap, action: () => console.log("Consulter les stats") },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};


const FeedItem = ({ item }: { item: FeedItemType }) => {
    // CORRECTION : Les hooks sont maintenant au plus haut niveau de ce composant, ce qui est correct.
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const { t } = useTranslation();

    // Rendu pour une Publication
    if (item._type === 'publication') {
        const pub = item as Publication;
        return (
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg mb-8 w-full max-w-2xl mx-auto">
                <div className="p-6">
                    <div className="flex items-center mb-4"><img src={pub.author.avatar} alt={pub.author.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover mr-4" /><div><h3 className="font-bold text-lg">{pub.author.name}</h3><p className="text-sm text-gray-500">{pub.timestamp}</p></div></div>
                    <p className="mb-4 text-gray-700">{pub.content}</p>
                    {pub.image && <div className="rounded-xl overflow-hidden"><img src={pub.image} alt="Publication" width={800} height={500} className="w-full h-auto object-cover" /></div>}
                </div>
                <div className="px-6 py-3 border-t flex justify-around text-gray-600 font-medium">
                    <button onClick={() => setLiked(!liked)} className={`flex items-center space-x-2 transition ${liked ? 'text-red-500' : 'hover:text-red-500'}`}><Heart size={20} fill={liked ? 'currentColor' : 'none'} /><span>J'aime</span></button>
                    <button onClick={() => setShowCommentModal(true)} className="flex items-center space-x-2 hover:text-blue-500 transition"><MessageCircle size={20}/><span>Commenter</span></button>
                    <button className="flex items-center space-x-2 hover:text-green-500 transition"><Share2 size={20}/><span>Partager</span></button>
                </div>
            </motion.div>
        );
    }

    // Rendu pour un Événement
    if (item._type === 'event') {
        const event = item as Event;
        return (
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg mb-8 w-full max-w-2xl mx-auto">
                {event.image && <img src={event.image} alt={event.title} width={800} height={300} className="w-full h-48 object-cover"/>}
                <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{event.title}</h3>
                    <p className="mb-4 text-gray-700">{event.description}</p>
                    <div className="flex items-center text-sm text-gray-500"><MapPin size={16} className="mr-2"/>{event.location}</div>
                </div>
            </motion.div>
        );
    }

    return null;
};

export function AcceuilSection() {
    const [fullName, setFullName] = useState<string | null>(null);
    const [showCreateSyndicatForm, setShowCreateSyndicatForm] = useState(false);
    const [feed, setFeed] = useState<FeedItemType[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setFullName(getFullName());
            
            // Déplacer toute la logique du feed à l'intérieur de la vérification window
            // pour éviter les problèmes de rendu côté serveur
            if (Array.isArray(fakePublications) && Array.isArray(fakeEvents)) {
                const publicationsWithType = fakePublications.map((pub) => ({
                    ...pub,
                    _type: "publication" as const,
                    _uniqueId: `pub-${pub.id}`,
                }));

                const eventsWithType = fakeEvents.map((event) => ({
                    ...event,
                    _type: "event" as const,
                    _uniqueId: `event-${event.id}`,
                }));

                const getItemDate = (item: Publication | Event): Date => {
                    return item._type === 'publication' ? item.createdAt : item.startDate;
                };
                
                const combinedFeed = [...publicationsWithType, ...eventsWithType].sort(
                    (a, b) => getItemDate(b).getTime() - getItemDate(a).getTime()
                );
                setFeed(combinedFeed);
            }
        }
    }, []);

    // CORRECTION : La fonction met à jour l'état, elle n'appelle pas le composant.
    const handleCreateSyndicat = () => {
        setShowCreateSyndicatForm(true);
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Bienvenue, {fullName || "Membre"} !</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">{t("votre_portail_syndical_personnalise", "Votre portail syndical personnalisé")}</p>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCreateSyndicat} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <Zap className="w-6 h-6 inline-block mr-2" />
                        {t("lancer_votre_syndicat", "Lancer votre Syndicat")}
                    </motion.button>
                </motion.div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat) => (
                        <motion.div key={stat.id} variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 border-l-4 border-blue-500">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><stat.icon size={28} /></div>
                            <div><p className="text-3xl font-bold text-gray-800">{stat.value}</p><p className="text-gray-500">{stat.title}</p></div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    {feed.map((item) => (
                        <FeedItem key={item._uniqueId} item={item} />
                    ))}
                </motion.div>

                <AnimatePresence>
                    {/* CORRECTION : On vérifie la variable d'état, pas le composant. */}
                    {showCreateSyndicatForm && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                             <motion.div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl relative overflow-hidden flex flex-col" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                                <button className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-800" onClick={() => setShowCreateSyndicatForm(false)}><X size={24} /></button>
                                <div className="flex-1 overflow-y-auto"><CreateSyndicatForm /></div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
}