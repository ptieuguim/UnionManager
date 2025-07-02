"use client";

import React, { useState, useRef, useEffect, ChangeEvent, MouseEvent } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Send, X, Paperclip, MapPin, Camera, Plus } from "lucide-react";
import Image from "next/image";
import VideoPreview from "./PublicationComponents/VideoPreview";
import { Post as PostComponent, PostType } from "./PublicationComponents/Post";
import { getCurrentUserInfo } from "../../../utils/dataFormatUtils";
import { useTranslation } from "react-i18next";
import { savePublicationsToLocalStorage, getPublicationsFromLocalStorage } from "@/services/PublicationService";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

// Types pour les posts et les props
export interface PublicationData extends Omit<PostType, 'createdAt'> {
  createdAt: Date | string; 
  reactions?: {
    like: number;
    love: number;
    support: number;
  };
  
  timestamp: string;
  likes: number;
  comments: Array<{
    id: string;
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    replies: Array<{
      id: string;
      author: {
        name: string;
        avatar: string;
      };
      content: string;
    }>;
  }>;
}

// Type pour les mises à jour des publications
interface UpdatedPostData {
  content?: string;
  image?: string;
  authorId?: string;
  authorName?: string;
  authorAvatar?: string;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "danger";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", variant = "default", disabled }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";
  const variantStyles: Record<string, string> = {
    default: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl",
    outline: "border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-500",
    ghost: "text-gray-600 hover:bg-gray-100",
    danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl"
  };
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyle} ${variantStyles[variant || "default"]} ${className}`}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

interface TextAreaProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ value, onChange, placeholder, className = "" }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 resize-none ${className}`}
  />
);

export const Publications: React.FC = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<PublicationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [showNewPostForm, setShowNewPostForm] = useState<boolean>(false);

  const postsContainerRef = useRef<HTMLDivElement>(null);
  const firstPostRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadPublications() {
      setIsLoading(true);
      try {
        // Instead of API call, directly use local storage or fallback data
        const cachedPosts = getPublicationsFromLocalStorage();
        if (cachedPosts && cachedPosts.length > 0) {
          setPosts(cachedPosts as unknown as PublicationData[]);
        } else {
          import('@/services/PublicationService').then(({ getFallbackPublications }) => {
            const fallbackPosts = getFallbackPublications();
            setPosts(fallbackPosts as unknown as PublicationData[]);
            savePublicationsToLocalStorage(fallbackPosts);
          });
        }
      } catch (error: unknown) {
        console.error(t("erreur_chargement_publications", "Erreur lors du chargement des publications:"), error);
        toast.error(t("erreur_chargement_publications", "Erreur lors du chargement des publications"));
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPublications();
  }, [t]);

  const handleNewPost = async () => {
    if (!newContent.trim() && !newImage) return;
    setIsSubmitting(true);
    try {
      // Use the local storage function to create a publication
      import('@/services/PublicationService').then(({ createPublication }) => {
        const newPublication = createPublication({
          author: {
            name: getCurrentUserInfo()?.name || "Utilisateur",
            avatar: getCurrentUserInfo()?.profileImage || "/default-avatar.png"
          },
          content: newContent,
          image: newImage || undefined
        });
        
        // Update the UI with the new post
        setPosts((prev) => [newPublication as unknown as PublicationData, ...prev]);
        setNewContent("");
        setNewImage(null);
        setShowNewPostForm(false); // Hide the form after successful post
        toast.success(t("publication_ajoutee", "Publication ajoutée !"));
      });
    } catch (error: unknown) {
      console.error(t("erreur_creation_publication", "Erreur lors de la création de la publication:"), error);
      toast.error(t("erreur_ajout_publication", "Erreur lors de l'ajout de la publication"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPost = () => {
    setNewContent("");
    setNewImage(null);
    setShowNewPostForm(false); // Hide form when cancelled
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Handle updating a post with new content or image
  const handleUpdatePost = (postId: string, updatedData: UpdatedPostData): void => {
    // Update posts in state and localStorage in a single operation
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post =>
        post.id === postId ? { ...post, ...updatedData } : post
      );
      
      // Update localStorage with the new state
      savePublicationsToLocalStorage(updatedPosts as any);
      
      return updatedPosts;
    });
    
    toast.success(t("post_updated", "Publication mise à jour"));
  };

  // Handle deleting a post
  const handleDeletePost = (postId: string): void => {
    // Update posts in state and localStorage in a single operation
    setPosts(prevPosts => {
      const filteredPosts = prevPosts.filter(post => post.id !== postId);
      
      // Update localStorage with the new state
      savePublicationsToLocalStorage(filteredPosts as any);
      
      return filteredPosts;
    });
    
    toast.success(t("post_deleted", "Publication supprimée"));
  };

  // Adapter function to match the expected type signature for onUpdatePost
  const handleUpdatePostAdapter = (updatedPost: PostType): void => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((p) =>
        p.id === updatedPost.id ? { ...p, ...updatedPost } : p
      );
      
      // Update localStorage with the new state
      savePublicationsToLocalStorage(updatedPosts as any);
      
      return updatedPosts;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 relative">
      {/* New Publication Button - Floating Action Button (FAB) */}
      {!showNewPostForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-8 right-8 z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setShowNewPostForm(true)}
            className="rounded-full w-16 h-16 shadow-xl flex items-center justify-center"
          >
            <Plus className="w-7 h-7" />
          </Button>
        </motion.div>
      )}

      {/* Publication Form */}
      {showNewPostForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-700">{t("creer_publication", "Créer une publication")}</h2>
            <button
              onClick={() => setShowNewPostForm(false)}
              className="text-gray-400 hover:text-gray-600 rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <TextArea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={t("quoi_de_neuf", "Quoi de neuf aujourd'hui?")}
              className="h-32"
            />
          </div>
          
          {newImage && (
            <div className="relative mb-4 rounded-xl overflow-hidden">
              <img
                src={newImage}
                alt="Preview"
                className="w-full h-auto max-h-80 object-contain"
              />
              <button
                onClick={() => setNewImage(null)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <ImageIcon className="w-5 h-5" />
                {t("ajouter_image", "Image")}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Button
                variant="outline"
                onClick={() => setShowCamera(true)}
                className="flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                {t("prendre_photo", "Photo")}
              </Button>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={handleCancelPost}
                className="px-6"
              >
                {t("annuler", "Annuler")}
              </Button>
              <Button
                onClick={handleNewPost}
                disabled={isSubmitting || (!newContent.trim() && !newImage)}
                className="px-6"
              >
                {isSubmitting ? t("publication_en_cours", "Publication en cours...") : t("publier", "Publier")}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {showCamera && <VideoPreview onClose={() => setShowCamera(false)} />}

      {/* Posts List */}
      <div ref={postsContainerRef} className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">{t("aucune_publication", "Aucune publication")}</h3>
            <p className="text-gray-500">
              {t("soyez_premier_publier", "Soyez le premier à partager quelque chose avec la communauté!")}
            </p>
          </div>
        ) : (
          posts.map((post, idx) => (
            <div key={post.id} ref={idx === 0 ? firstPostRef : undefined}>
              <PostComponent 
                post={{
                  ...post,
                  createdAt: typeof post.createdAt === 'object' ? post.createdAt.toISOString() : post.createdAt
                } as PostType}
                onUpdatePost={handleUpdatePostAdapter}
                onDeletePost={handleDeletePost}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Publications;
