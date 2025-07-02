"use client";

import { motion } from "framer-motion";
import {
    MapPin,
    User,
    Users,
    Phone,
    Mail,
    CheckCircle,
    Clock,
    Award,
    Building2,
    Navigation,
    Star,
    Zap
} from "lucide-react";

interface Antenne {
    id: number;
    nom: string;
    localisation: string;
    responsables?: string[];
    membres?: number;
    horairesOuverture?: string;
    [key: string]: any;
}

interface AntenneSelectionProps {
    antennes: Antenne[];
    onSelect: (antenne: Antenne) => void;
    selectedAntenne: Antenne | null;
}

export const AntenneSelection = ({ antennes, onSelect, selectedAntenne }: AntenneSelectionProps) => {
    // Animation variants pour les cartes
    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
        hover: {
            y: -12,
            scale: 1.03,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        },
        tap: { scale: 0.97 }
    };

    // Fonction pour obtenir l'image d'illustration selon la région
    const getAntenneImage = (antenne: Antenne) => {
        const images: Record<string, string> = {
            'yaoundé': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop&crop=center',
            'douala': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop&crop=center',
            'garoua': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=200&fit=crop&crop=center',
            'bafoussam': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=200&fit=crop&crop=center',
            'ebolowa': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&crop=center',
            'maroua': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=200&fit=crop&crop=center'
        };
        const key = Object.keys(images).find(city =>
            antenne.localisation.toLowerCase().includes(city)
        );
        return images[key ?? 'yaoundé'] || images['yaoundé'];
    };

    // Fonction pour obtenir les couleurs de gradient selon l'antenne
    const getGradientColors = (antenneId: number) => {
        const gradients = [
            'from-blue-500 via-blue-600 to-indigo-700',
            'from-emerald-500 via-teal-600 to-cyan-700',
            'from-purple-500 via-violet-600 to-indigo-700',
            'from-orange-500 via-red-600 to-pink-700',
            'from-green-500 via-emerald-600 to-teal-700',
            'from-amber-500 via-orange-600 to-red-700'
        ];
        return gradients[(antenneId - 1) % gradients.length];
    };

    // Fonction pour calculer la distance (simulée)
    const getDistance = (antenne: Antenne) => {
        const distances = [2.3, 5.7, 15.2, 8.9, 12.4, 18.6];
        return distances[(antenne.id - 1) % distances.length];
    };

    return (
        <div className="space-y-8">
            {/* Header amélioré */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
            >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                    <Building2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
                    Choisissez votre antenne
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Sélectionnez l'antenne la plus proche de vous ou celle qui correspond le mieux à votre secteur d'activité
                </p>
                <div className="mt-4 inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                    <Navigation className="w-4 h-4 mr-2" />
                    {antennes.length} antennes disponibles
                </div>
            </motion.div>
            {/* Grille des antennes */}
            <motion.div
                className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                initial="hidden"
                animate="visible"
            >
                {antennes.map((antenne) => {
                    const isSelected = selectedAntenne && selectedAntenne.id === antenne.id;
                    return (
                        <motion.div
                            key={antenne.id}
                            className={`relative rounded-3xl shadow-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                                isSelected ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-100'
                            }`}
                            variants={cardVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => onSelect(antenne)}
                        >
                            {/* Image et gradient */}
                            <div className={`relative aspect-video bg-gradient-to-br ${getGradientColors(antenne.id)}`}>
                                <img
                                    src={getAntenneImage(antenne)}
                                    alt={antenne.nom}
                                    className="w-full h-full object-cover rounded-t-3xl"
                                    loading="lazy"
                                />
                                <div className="absolute top-4 left-4 bg-white/80 rounded-lg px-3 py-1.5 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-blue-700">{antenne.localisation}</span>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/80 rounded-lg px-3 py-1.5 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-yellow-500" />
                                    <span className="font-medium text-yellow-700">{getDistance(antenne)} km</span>
                                </div>
                            </div>
                            {/* Infos principales */}
                            <div className="p-6 space-y-2">
                                <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center">
                                    {antenne.nom}
                                    {isSelected && <CheckCircle className="ml-2 w-5 h-5 text-blue-500" />}
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 mb-2">
                                    <Users className="w-4 h-4 mr-1" />
                                    <span>{antenne.membres ?? Math.floor(Math.random() * 100) + 20} membres</span>
                                </div>
                                {antenne.responsables && (
                                    <div className="flex items-center text-xs text-gray-500 mb-2">
                                        <User className="w-4 h-4 mr-1" />
                                        <span>Responsable : {antenne.responsables.join(', ')}</span>
                                    </div>
                                )}
                                {antenne.horairesOuverture && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                            <Clock className="w-3 h-3 text-orange-600" />
                                        </div>
                                        <span className="font-medium">{antenne.horairesOuverture}</span>
                                    </div>
                                )}
                            </div>
                            {/* Footer avec rating simulé */}
                            <div className="px-6 pb-6">
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                                    <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-bold text-gray-900">4.8</span>
                                        <span className="text-gray-500 ml-1">({Math.floor(Math.random() * 100) + 50} avis)</span>
                                    </div>
                                </div>
                            </div>
                            {/* Effet de sélection */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-3xl pointer-events-none"
                                />
                            )}
                            {/* Bordure animée pour la sélection */}
                            {isSelected && (
                                <motion.div
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    className="absolute inset-0 rounded-3xl"
                                    style={{
                                        background: `conic-gradient(from 0deg, #3b82f6, #8b5cf6, #3b82f6)`,
                                        padding: '2px',
                                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        maskComposite: 'xor'
                                    }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>
            {/* Footer informatif */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center pt-8"
            >
                <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 px-6 py-3 rounded-2xl text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Vous pourrez toujours changer d'antenne après votre adhésion
                </div>
            </motion.div>
        </div>
    );
};
