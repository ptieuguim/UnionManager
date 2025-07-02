'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, User, Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Types TypeScript pour Next.js
interface Participant {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
}

interface ParticipantsListProps {
    participants?: Participant[];
    eventId: string;
    onToggleParticipation?: (eventId: string) => void;
    currentUserId?: string | null;
    isLoading?: boolean;
    maxDisplayed?: number;
    showAvatars?: boolean;
    compact?: boolean;
}

/**
 * Composant pour afficher et gérer la liste des participants à un événement
 */
const ParticipantsList: React.FC<ParticipantsListProps> = ({ 
    participants = [], 
    eventId, 
    onToggleParticipation, 
    currentUserId,
    isLoading = false,
    maxDisplayed = 10,
    showAvatars = false,
    compact = false
}) => {
    const { t } = useTranslation();
    
    // Vérifier si l'utilisateur actuel participe
    const isCurrentUserParticipating = participants.some(p => p.id === currentUserId);
    
    // Nombre de participants à afficher
    const displayedParticipants = participants.slice(0, maxDisplayed);
    const remainingCount = Math.max(0, participants.length - maxDisplayed);

    const handleToggle = () => {
        if (onToggleParticipation && !isLoading) {
            onToggleParticipation(eventId);
        }
    };

    // Variant d'animation pour les participants
    const participantVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (index: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: index * 0.05 }
        })
    };

    return (
        <div className={`participants-container ${compact ? 'mt-2 pt-2' : 'mt-4 pt-4'} border-t border-gray-200`}>
            {/* Header avec compteur et bouton d'action */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <Users className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0" />
                    <h4 className={`font-semibold text-gray-700 ${compact ? 'text-sm' : 'text-sm sm:text-base'}`}>
                        {participants.length === 0
                            ? t('aucun_participant', 'Aucun participant')
                            : participants.length === 1 
                                ? `1 ${t('participant_singular', 'Participant')}`
                                : `${participants.length} ${t('participants_plural', 'Participants')}`
                        }
                    </h4>
                </div>
                
                {/* Bouton de participation */}
                {currentUserId && onToggleParticipation && (
                    <motion.button
                        whileHover={{ scale: isLoading ? 1 : 1.05 }}
                        whileTap={{ scale: isLoading ? 1 : 0.95 }}
                        onClick={handleToggle}
                        disabled={isLoading}
                        className={`flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
                            ${isLoading 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-400' 
                                : isCurrentUserParticipating 
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200 border border-red-400 hover:border-red-500 focus:ring-red-500' 
                                    : 'bg-blue-500 text-white hover:bg-blue-600 border border-blue-500 hover:border-blue-700 focus:ring-blue-500'
                            }`}
                        aria-label={isCurrentUserParticipating 
                            ? t('se_desinscrire_evenement', 'Se désinscrire de l\'événement')
                            : t('participer_evenement', 'Participer à l\'événement')
                        }
                    >
                        {isLoading ? (
                            <>
                                <span 
                                    className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" 
                                    role="status" 
                                    aria-label={t('chargement', 'Chargement')}
                                />
                                {t('chargement_court', 'Chargement...')}
                            </>
                        ) : isCurrentUserParticipating ? (
                            <>
                                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0" />
                                <span className="hidden sm:inline">{t('ne_plus_participer', 'Se désinscrire')}</span>
                                <span className="sm:hidden">{t('quitter', 'Quitter')}</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0" />
                                <span className="hidden sm:inline">{t('participer_action', 'Participer')}</span>
                                <span className="sm:hidden">{t('rejoindre', 'Rejoindre')}</span>
                            </>
                        )}
                    </motion.button>
                )}
            </div>

            {/* Liste des participants */}
            {participants.length === 0 ? (
                <div className="text-center py-4">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm italic">
                        {t('aucun_participant_pour_le_moment', 'Aucun participant pour le moment.')}
                    </p>
                    {currentUserId && onToggleParticipation && (
                        <p className="text-gray-400 text-xs mt-1">
                            {t('premier_participant', 'Soyez le premier à participer !')}
                        </p>
                    )}
                </div>
            ) : (
                <div className={`participants-list ${compact ? 'max-h-24' : 'max-h-32'} overflow-y-auto pr-1`}>
                    <div className="flex flex-wrap -mx-1">
                        {displayedParticipants.map((participant, index) => (
                            <motion.div 
                                key={participant.id || `participant-${index}`}
                                custom={index}
                                variants={participantVariants}
                                initial="hidden"
                                animate="visible"
                                className="px-1 mb-2"
                            >
                                <div 
                                    className={`flex items-center bg-gray-100 hover:bg-gray-200 transition-colors px-2.5 py-1.5 rounded-full shadow-sm hover:shadow-md cursor-default group
                                        ${compact ? 'text-xs' : 'text-xs sm:text-sm'}`}
                                    title={`${participant.name}${participant.email ? ` (${participant.email})` : ''}`}
                                >
                                    {showAvatars && participant.avatar ? (
                                        <img 
                                            src={participant.avatar} 
                                            alt={`Avatar de ${participant.name}`}
                                            className="w-4 h-4 rounded-full mr-1.5 flex-shrink-0 object-cover border border-gray-300"
                                            onError={(e) => {
                                                // Fallback vers icône si l'image ne charge pas
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const icon = target.nextSibling as HTMLElement;
                                                if (icon) icon.style.display = 'block';
                                            }}
                                        />
                                    ) : null}
                                    
                                    <User 
                                        className={`w-3.5 h-3.5 text-gray-500 mr-1.5 flex-shrink-0 ${
                                            showAvatars && participant.avatar ? 'hidden' : 'block'
                                        }`} 
                                    />
                                    
                                    <span className={`truncate text-gray-700 group-hover:text-gray-900 transition-colors
                                        ${compact ? 'max-w-[70px]' : 'max-w-[80px] sm:max-w-[100px]'}`}>
                                        {participant.name}
                                        {participant.id === currentUserId && (
                                            <span className="font-medium text-blue-600">
                                                {` (${t('vous', 'Vous')})`}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
           
                        {/* Indicateur pour les participants supplémentaires */}
                        {remainingCount > 0 && (
                            <motion.div 
                                className="px-1 mb-2"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: displayedParticipants.length * 0.05 }}
                            >
                                <div 
                                    className={`flex items-center bg-gray-200 hover:bg-gray-300 transition-colors px-2.5 py-1.5 rounded-full shadow-sm cursor-pointer group
                                        ${compact ? 'text-xs' : 'text-xs sm:text-sm'}`}
                                    title={t('voir_plus_participants', 'Cliquez pour voir tous les participants')}
                                >
                                    <Plus className="w-3 h-3 text-gray-600 mr-1 group-hover:text-gray-800 transition-colors" />
                                    <span className="text-gray-600 group-hover:text-gray-800 font-medium transition-colors">
                                        +{remainingCount} {t('autres', 'autres')}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            )}

            {/* Statistiques additionnelles (optionnel) */}
            {participants.length > 0 && !compact && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                            {t('total_participants', 'Total')}: {participants.length}
                        </span>
                        {isCurrentUserParticipating && (
                            <span className="text-blue-600 font-medium">
                                {t('vous_participez', 'Vous participez')}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParticipantsList;