"use client";

import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Bookmark, Share2, Clock, X } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import timeAgo from "@/utils/timeAgo";
import { CommentModal } from "@/components/Syndicat-App/s'exprimer/CommentComponent/Principal_Comment";
import { CommentData } from "@/components/Syndicat-App/s'exprimer/CommentComponent/Comment";
import { useTranslation } from "react-i18next";
// Définissons uniquement les interfaces nécessaires

export interface Author {
  name: string;
  avatar: string;
}

// Utilisation directe du type CommentData importé
export type PostComment = CommentData;

export interface PostType {
  id: string;
  author: Author;
  content: string;
  image?: string;
  timestamp: string;
  createdAt: string;
  likes: number;
  comments: PostComment[];
}

// Interface déjà définie plus haut
interface PostProps {
  post: PostType;
  onUpdatePost: (updatedPost: PostType) => void;
  onDeletePost?: (postId: string) => void;
}

export const Post: React.FC<PostProps> = ({ post, onUpdatePost, onDeletePost }) => {
  const [liked, setLiked] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(post.timestamp);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();

  // Initialement, vérifions si l'utilisateur a déjà aimé le post
  // Pour une version simplifiée sans APIs, on part du principe que non

// Remplacer l'effet avec une version simplifiée qui ne créera pas de boucles
useEffect(() => {
  // Initialisation unique, pas d'intervalle pour éviter les boucles
  // Le liked state sera géré par le handleLike directement
  
  // Initialiser le timestamp
  setCurrentTimestamp(timeAgo(new Date(post.createdAt)));
  
  // Mettre à jour le timestamp une fois par minute
  const timestampInterval = setInterval(() => {
      setCurrentTimestamp(timeAgo(new Date(post.createdAt)));
  }, 60000);
  
  return () => {
    clearInterval(timestampInterval);
  };
}, [post.createdAt]); // Dépendance minimale

      // --- Fonctions de logique métier (Handlers) ---
      const handleLike = () => {
        if (isLoading) return;
        
        setIsLoading(true);
        
        try {
            // Version locale optimiste sans appels API
            const newLikedState = !liked;
            const newLikesCount = newLikedState ? post.likes + 1 : Math.max(0, post.likes - 1);
            
            // Mettre à jour l'état local d'abord
            setLiked(newLikedState);
            
            // Puis mettre à jour le post parent - une seule fois
            // pour éviter des rendus en cascade
            onUpdatePost({ 
                ...post, 
                likes: newLikesCount 
            });
            
            // Notification après la mise à jour
            if (newLikedState) {
                toast.success(t('reaction_ajoutee', 'J\'aime ajouté'));
            } else {
                toast.success(t('reaction_retiree', 'J\'aime retiré'));
            }
        } catch (error: any) {
            console.error('Erreur lors de la gestion du like:', error);
            toast.error(t('erreur_reseau_like', 'Une erreur est survenue'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddComment = (newComment: PostComment) => {
      // Utiliser une copie profonde pour éviter de modifier l'objet d'origine
      const newComments = [...post.comments, newComment];
      
      // Mettre à jour en une seule fois pour éviter les rendus en cascade
      onUpdatePost({
          ...post,
          comments: newComments
      });
  };

  return (
    <>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 w-full max-w-2xl mx-auto transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
        >
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full object-cover ring-4 ring-blue-100"
                    />
                    <div className="ml-4 flex-grow">
                        <h3 className="font-bold text-lg text-gray-800">{post.author.name}</h3>
                        <div className="flex items-center text-sm text-gray-500"><Clock className="w-4 h-4 mr-1.5" /><span>{currentTimestamp}</span></div>
                    </div>
                    <div className="flex items-center">
                        <button onClick={() => setBookmarked(!bookmarked)} className={`p-2 rounded-full transition-colors ${bookmarked ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}><Bookmark className="w-6 h-6" fill={bookmarked ? "currentColor" : "none"} /></button>
                        {onDeletePost && (<button onClick={() => onDeletePost(post.id)} className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>)}
                    </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">{post.content}</p>

                {post.image && (
                    <div className="rounded-xl overflow-hidden mb-6 shadow-lg bg-gray-100">
                        <img src={post.image} alt="Contenu de la publication" className="w-full h-auto object-contain max-h-[600px]" />
                    </div>
                )}

                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>{post.likes > 0 ? `${post.likes} ${t('jaime', { count: post.likes })}` : ''}</span>
                    <span>{post.comments.length > 0 ? `${post.comments.length} ${t('commentaire', { count: post.comments.length })}` : ''}</span>
                </div>

                <div className="flex items-center justify-around border-t border-gray-100 pt-2">
                    <button onClick={handleLike} disabled={isLoading} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-colors ${isLoading ? 'opacity-50' : 'hover:bg-gray-100'} ${liked ? 'text-blue-600' : 'text-gray-600'}`}>
                        <Heart fill={liked ? "currentColor" : "none"} />{t("jaime", "J'aime")}
                    </button>
                    <button onClick={() => setShowCommentModal(true)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                        <MessageCircle />{t("commenter", "Commenter")}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                        <Share2/>{t("partager", "Partager")}
                    </button>
                </div>
            </div>
        </motion.div>

        <CommentModal
            post={{
                id: post.id,
                author: post.author,
                content: post.content,
                image: post.image,
                timestamp: post.timestamp,
                comments: post.comments as CommentData[] // Cast pour assurer la compatibilité
            }}
            isOpen={showCommentModal}
            onClose={() => setShowCommentModal(false)}
            onAddComment={handleAddComment}
        />
    </>
);
};


export default Post;
