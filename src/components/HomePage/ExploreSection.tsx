"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, UserPlus, X, MapPin, AlertCircle, ChevronLeft, Sparkles, ShieldCheck, Star } from "lucide-react";
import { getUserId } from "../../services/AccountService";
import { AdhereSyndicatForm } from "./AdhesionForm/AdhesionForm";
import { ExploreCard } from "./ExploreSection/ExploreCard";
import { exploresyndicat } from "../../fakeData/exploreSyndicatFake";
import SyndicatProfile from "../ProfilPage/ProfilPage";

interface Syndicat {
    id: number | string;
    name: string;
    location: string;
    type: string;
    members: number;
    rating?: number;
    image: string;
    specialties?: string[];
    founded?: number;
}

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

export default function Explorer() {
    const [searchTerm, setSearchTerm] = useState("");
    const [syndicats, setSyndicats] = useState<Syndicat[]>(exploresyndicat as Syndicat[]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSyndicat, setSelectedSyndicat] = useState<Syndicat | null>(null);
    const [showAdhesionForm, setShowAdhesionForm] = useState(false);
    const [viewingSyndicatProfile, setViewingSyndicatProfile] = useState(false);
    const [filterType, setFilterType] = useState("all");
    const [sortBy, setSortBy] = useState("members");

    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUserId(getUserId());
        }
    }, []);

    useEffect(() => {
        const fetchSyndicats = async () => {
            try {
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            } catch (e) {
                setError("Erreur lors du chargement des syndicats.");
                setLoading(false);
            }
        };
        fetchSyndicats();
    }, []);

    // Types de syndicats pour le filtre
    const syndicatTypes = useMemo(() => {
        const types = [...new Set(syndicats.map(s => s.type))];
        return types;
    }, [syndicats]);

    const filteredSyndicats = useMemo(() => {
        let filtered = syndicats.filter((syndicat) =>
            syndicat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            syndicat.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (syndicat.specialties && syndicat.specialties.some(spec =>
                spec.toLowerCase().includes(searchTerm.toLowerCase())
            ))
        );
        if (filterType !== "all") {
            filtered = filtered.filter(syndicat =>
                syndicat.type.toLowerCase() === filterType.toLowerCase()
            );
        }
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "members":
                    return (b.members || 0) - (a.members || 0);
                case "rating":
                    return (b.rating || 0) - (a.rating || 0);
                case "name":
                    return a.name.localeCompare(b.name);
                case "newest":
                    return (b.founded || 0) - (a.founded || 0);
                default:
                    return 0;
            }
        });
        return filtered;
    }, [syndicats, searchTerm, filterType, sortBy]);

    // Syndicat suggéré (le mieux noté avec plus de 1000 membres)
    const suggestedSyndicat = useMemo(() => {
        return filteredSyndicats.find(s =>
            s.members > 1000 && (s.rating || 0) >= 4.5
        ) || filteredSyndicats[0];
    }, [filteredSyndicats]);

    const handleDemandeAdhesion = (syndicat: Syndicat) => {
        setSelectedSyndicat(syndicat);
        setShowAdhesionForm(true);
    };

    const handleSyndicatClick = (syndicat: Syndicat) => {
        setSelectedSyndicat(syndicat);
        setViewingSyndicatProfile(true);
    };

    const handleCloseAdhesion = () => {
        setShowAdhesionForm(false);
        setSelectedSyndicat(null);
    };

    const getSuggestionMessage = () => {
        if (!searchTerm) return null;
        if (filteredSyndicats.length === 0) {
            return `Aucun syndicat trouvé pour "${searchTerm}". Essayez une autre recherche.`;
        }
        if (filteredSyndicats.length < syndicats.length) {
            return `${filteredSyndicats.length} syndicat(s) trouvé(s) pour "${searchTerm}".`;
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12">
            {viewingSyndicatProfile ? (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors group"
                        onClick={() => setViewingSyndicatProfile(false)}
                    >
                        <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
                        <span className="text-lg font-medium">Retour à l'exploration</span>
                    </button>
                    {selectedSyndicat && <SyndicatProfile syndicat={selectedSyndicat} />}
                </div>
            ) : (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header avancé */}
                    <motion.header
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                        className="text-center mb-16 relative"
                    >
                        <div className="max-w-4xl mx-auto relative">
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
                            <h1 className="text-4xl sm:text-5xl font-bold mb-6 relative z-10">
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Explorer les Syndicats
                                </span>
                                <div className="mt-2 w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full"></div>
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                                Trouvez la communauté professionnelle qui correspond à vos besoins
                                <span className="block mt-2 text-blue-600 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 mr-2"/>
                                    Plus de {syndicats.length} syndicats référencés
                                </span>
                            </p>
                        </div>
                    </motion.header>

                    {/* Barre de recherche et filtres */}
                    <motion.div
                        className="mb-16 max-w-4xl mx-auto"
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.3}}
                    >
                        {/* Recherche */}
                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Rechercher un syndicat, lieu ou spécialité..."
                                className="w-full pl-14 pr-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg placeholder-gray-400 shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6"/>
                        </div>
                        {/* Filtres et tri */}
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            {/* Filtre par type */}
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700">Type:</span>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">Tous</option>
                                    {syndicatTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Tri */}
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700">Trier par:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="members">Nombre de membres</option>
                                    <option value="rating">Note</option>
                                    <option value="name">Nom A-Z</option>
                                    <option value="newest">Plus récent</option>
                                </select>
                            </div>
                            {/* Statistiques */}
                            <div className="text-sm text-gray-600">
                                {filteredSyndicats.length} syndicat(s) trouvé(s)
                            </div>
                        </div>
                        {/* Message de suggestion */}
                        {getSuggestionMessage() && (
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                className="mt-4 flex items-center bg-blue-100 text-blue-800 px-4 py-3 rounded-lg"
                            >
                                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0"/>
                                <span className="text-sm leading-tight">{getSuggestionMessage()}</span>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Syndicat suggéré */}
                    {suggestedSyndicat && !searchTerm && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-16"
                        >
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mr-4">
                                    Syndicat suggéré pour vous
                                </h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-blue-100 to-indigo-100"></div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/3 relative">
                                        <img
                                            src={suggestedSyndicat.image}
                                            alt={suggestedSyndicat.name}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm flex items-center">
                                            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                                            Recommandé
                                        </div>
                                    </div>
                                    <div className="md:w-2/3 p-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                            {suggestedSyndicat.name}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-center">
                                                <Users className="h-5 w-5 text-blue-600 mr-2" />
                                                <span>{suggestedSyndicat.members.toLocaleString()} membres</span>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                                                <span>{suggestedSyndicat.location}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <ShieldCheck className="h-5 w-5 text-blue-600 mr-2" />
                                                <span>Certifié par l'État</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Star className="h-5 w-5 text-blue-600 mr-2" />
                                                <span>{suggestedSyndicat.rating || 4.8}/5 ({Math.floor(Math.random() * 500) + 100} avis)</span>
                                            </div>
                                        </div>
                                        {/* Spécialités */}
                                        {suggestedSyndicat.specialties && (
                                            <div className="mb-6">
                                                <h4 className="font-medium text-gray-900 mb-2">Spécialités:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {suggestedSyndicat.specialties.slice(0, 4).map((spec, index) => (
                                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                            {spec}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex gap-4">
                                            <motion.button
                                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => handleDemandeAdhesion(suggestedSyndicat)}
                                            >
                                                <UserPlus className="h-5 w-5 mr-2" />
                                                Adhérer maintenant
                                            </motion.button>
                                            <motion.button
                                                className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => handleSyndicatClick(suggestedSyndicat)}
                                            >
                                                Voir les détails
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* États de chargement et d'erreur */}
                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-pulse flex space-x-4">
                                <div className="rounded-full bg-blue-100 h-12 w-12"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-blue-100 rounded w-24"></div>
                                    <div className="h-4 bg-blue-100 rounded w-32"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="mx-auto max-w-md bg-red-50 text-red-700 p-6 rounded-xl text-center">
                            <AlertCircle className="h-6 w-6 mx-auto mb-3"/>
                            {error}
                        </div>
                    )}

                    {/* Grille des syndicats */}
                    {!loading && !error && (
                        <>
                            {filteredSyndicats.length > 0 ? (
                                <>
                                    <div className="flex items-center mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mr-4">
                                            {searchTerm ? 'Résultats de recherche' : 'Tous les syndicats'}
                                        </h2>
                                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                                    </div>
                                    <ExploreCard
                                        listSyndicat={filteredSyndicats}
                                        containerVariants={containerVariants}
                                        itemVariants={itemVariants}
                                        details={(syndicat) => handleSyndicatClick(syndicat)}
                                        adherer={(syndicat) => handleDemandeAdhesion(syndicat)}
                                    />
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16"
                                >
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Aucun syndicat trouvé
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Essayez d'ajuster vos critères de recherche ou filtres.
                                    </p>
                                    <motion.button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setFilterType("all");
                                            setSortBy("members");
                                        }}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        Réinitialiser les filtres
                                    </motion.button>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            )}
            {/* Modal d'adhésion multi-étapes */}
            <AnimatePresence>
                {showAdhesionForm && selectedSyndicat && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.target === e.currentTarget && handleCloseAdhesion()}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto"
                            initial={{scale: 0.95, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.95, opacity: 0}}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-100 flex justify-between items-center p-6 z-10">
                                <div>
                                    <h3 className="text-2xl font-semibold text-gray-900">
                                        Adhésion à {selectedSyndicat.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Processus d'adhésion en 4 étapes simples
                                    </p>
                                </div>
                                <button
                                    className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                                    onClick={handleCloseAdhesion}
                                >
                                    <X className="h-6 w-6 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-6">
                                {selectedSyndicat && (
                                    <AdhereSyndicatForm
                                        syndicat={selectedSyndicat}
                                        onClose={handleCloseAdhesion}
                                    />
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
