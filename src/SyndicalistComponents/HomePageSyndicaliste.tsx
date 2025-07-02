'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building, LifeBuoy, Plus, Flag, MessageCircle, Heart, Smile, Eye, Bookmark, 
  Clock, Camera, Building2, ImageIcon, Video, Paperclip, MapPin, Send, 
  Search, Bell, Settings, Home, ChevronRight, Calendar, FileText, 
  LogOut, X, AlertCircle, CheckCircle, ChevronLeft, Briefcase 
} from "lucide-react";
import Image from 'next/image';
import { useTranslation } from "react-i18next";

// Import des composants (adaptés pour Next.js)
import { AcceuilSection } from "../components/HomePage/AcceuilSection";
import  Explorer  from "../components/HomePage/ExploreSection";
import { getFirstName, getLastName } from "../services/AccountService";
import { ProfilUser } from "../components/HomePage/ProfilUser/ProfilUser";
import OrganisationSection from "./OrganisationGestion/OrganisationSection";
import { BusinessNavigationTabs } from "./BusinessSection/BusinessNavigationTabs";
import  SyndicatDashboard from "./SyndicatDashboard";
import timeAgo from '../utils/timeAgo';

// Interface TypeScript pour Next.js
interface Notification {
  title: string;
  description: string;
  time: string;
  icon: React.ComponentType<any>;
  gradient: string;
}

interface NavItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  gradient: string;
  description: string;
}

interface Author {
  name: string;
  avatar: string;
}

interface Comment {
  id?: number;
  author: Author;
  content: string;
  image?: string;
  timestamp?: string;
  liked?: boolean;
  likes?: number;
  replies?: Comment[];
  showReplies?: boolean;
  isReply?: boolean;
}

interface Post {
  id: number;
  author: Author;
  content: string;
  image?: string;
  timestamp: string;
  createdAt?: Date;
  likes: number;
  comments: Comment[];
}

// Configuration de navigation
const navItems: NavItem[] = [
  {
    id: "dashboard",
    icon: Home,
    label: "Accueil",
    gradient: "from-blue-500 to-indigo-600",
    description: "Actualité",
  },
  {
    id: "organisation",
    icon: Building2,
    label: "Organisation",
    gradient: "from-blue-500 to-indigo-600",
    description: "Gérez votre Syndicat",
  },
  {
    id: "business",
    icon: Briefcase,
    label: "Business",
    gradient: "from-blue-500 to-indigo-600",
    description: "Gérer vos organisations",
  },
  {
    id: "parametres",
    icon: Settings,
    label: "Paramètres",
    gradient: "from-blue-500 to-indigo-600",
    description: "Configuration du compte",
  },
  {
    id: "help",
    icon: LifeBuoy,
    label: "Help",
    gradient: "from-blue-500 to-indigo-600",
    description: "Découvrir de nouveaux syndicats",
  },
];

// Configuration des notifications
const notifications: Notification[] = [
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

// Les fonctions timeAgo, getFirstNameToken, getLastNameToken sont maintenant importées

// Composant NotificationItem
const NotificationItem: React.FC<Notification> = ({ title, description, time, icon: Icon, gradient }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group"
  >
    <div className={`h-1 bg-gradient-to-r ${gradient}`} />
    <div className="p-4">
      <div className="flex items-center mb-2">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient} text-white`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="ml-auto text-xs text-gray-500">{time}</span>
      </div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </motion.div>
);

// Composant Button réutilisable
const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
}> = ({ children, onClick, className = "", variant = "default" }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";
  const variantStyles = {
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
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

// Composant Input réutilisable
const Input: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, placeholder, className = "" }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 ${className}`}
  />
);

// Composant TextArea réutilisable
const TextArea: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, placeholder, className = "" }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 resize-none ${className}`}
  />
);

// Composant VideoPreview
const VideoPreview: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          setStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("Erreur d'accès à la caméra:", err));
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Caméra</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </motion.button>
        </div>
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-xl"
          />
          <div className="absolute bottom-4 right-4 flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
            >
              <Camera className="w-6 h-6 text-blue-500" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
            >
              <Video className="w-6 h-6 text-red-500" />
            </motion.button>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button>
            Capturer
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Composant CommentModal
const CommentModal: React.FC<{
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (comments: Comment[]) => void;
}> = ({ post, isOpen, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const [replyToComment, setReplyToComment] = useState<Comment | null>(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [comments, setComments] = useState<Comment[]>(
    post.comments.map(comment => ({
      ...comment,
      id: comment.id || Date.now() + Math.random(),
      liked: false,
      likes: 0,
      replies: [],
      showReplies: false
    }))
  );

  const handleSubmitComment = () => {
    if (newComment.trim() || commentImage) {
      const newCommentObj: Comment = {
        id: Date.now(),
        author: { 
          name: "Vous", 
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" 
        },
        content: newComment,
        image: commentImage || undefined,
        timestamp: "À l'instant",
        liked: false,
        likes: 0,
        replies: [],
        showReplies: false
      };

      if (replyToComment) {
        const updatedComments = comments.map(comment => {
          if (comment.id === replyToComment.id) {
            return {
              ...comment,
              replies: [...(comment.replies || []), {
                ...newCommentObj,
                isReply: true
              }]
            };
          }
          return comment;
        });
        setComments(updatedComments);
        setReplyToComment(null);
      } else {
        setComments([...comments, newCommentObj]);
      }
      
      onAddComment([...comments, newCommentObj]);
      setNewComment('');
      setCommentImage(null);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLikeComment = (commentId: number, isReply = false, parentCommentId?: number) => {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (isReply && parentCommentId === comment.id) {
          return {
            ...comment,
            replies: (comment.replies || []).map(reply => 
              reply.id === commentId
                ? { ...reply, liked: !reply.liked, likes: (reply.likes || 0) + (reply.liked ? -1 : 1) }
                : reply
            )
          };
        }
        if (!isReply && comment.id === commentId) {
          return {
            ...comment,
            liked: !comment.liked,
            likes: (comment.likes || 0) + (comment.liked ? -1 : 1)
          };
        }
        return comment;
      })
    );
  };

  const handleToggleReplies = (commentId: number) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, showReplies: !comment.showReplies }
          : comment
      )
    );
  };

  const handleEmojiClick = (emoji: string) => {
    setNewComment((prev) => prev + emoji);
    setEmojiPickerVisible(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl w-full max-w-2xl h-[90vh] flex flex-col shadow-2xl"
            onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Publication</h2>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose} 
                className="p-2 hover:bg-white/50 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <Image 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      width={48}
                      height={48}
                      className="rounded-full object-cover ring-4 ring-blue-100"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-lg text-gray-800">{post.author.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1 text-blue-500" />
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{post.content}</p>
                {post.image && (
                  <motion.div 
                    className="mt-4 rounded-xl overflow-hidden shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image 
                      src={post.image} 
                      alt="Post content" 
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </motion.div>
                )}
              </div>

              <div className="p-6 space-y-6">
                {comments.map((comment) => (
                  <motion.div 
                    key={comment.id} 
                    className="flex space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Image 
                      src={comment.author.avatar} 
                      alt={comment.author.name} 
                      width={40}
                      height={40}
                      className="rounded-full object-cover ring-2 ring-blue-100"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-2xl px-6 py-4">
                        <p className="font-semibold text-gray-800">{comment.author.name}</p>
                        <p className="text-gray-600 mt-1">{comment.content}</p>
                        {comment.image && (
                          <Image 
                            src={comment.image} 
                            alt="Comment" 
                            width={300}
                            height={200}
                            className="mt-3 rounded-lg max-w-full h-auto"
                          />
                        )}
                      </div>
                      <div className="flex gap-6 mt-2 text-sm text-gray-500 px-4">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`flex items-center space-x-1 ${comment.liked ? 'text-blue-500 font-medium' : ''}`}
                          onClick={() => handleLikeComment(comment.id!)}
                        >
                          <Heart className="w-4 h-4" fill={comment.liked ? "currentColor" : "none"} />
                          <span>J'aime {(comment.likes || 0) > 0 && `(${comment.likes})`}</span>
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center space-x-1"
                          onClick={() => setReplyToComment(comment)}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Répondre</span>
                        </motion.button>
                        {(comment.replies?.length || 0) > 0 && (
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center space-x-1"
                            onClick={() => handleToggleReplies(comment.id!)}
                          >
                            {comment.showReplies ? (
                              <>
                                <X className="w-4 h-4" />
                                <span>Masquer</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                <span>{comment.replies?.length} réponses</span>
                              </>
                            )}
                          </motion.button>
                        )}
                      </div>

                      <AnimatePresence>
                        {comment.showReplies && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-8 mt-4 space-y-4"
                          >
                            {comment.replies?.map((reply) => (
                              <motion.div
                                key={reply.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex space-x-3"
                              >
                                <Image 
                                  src={reply.author.avatar} 
                                  alt={reply.author.name} 
                                  width={32}
                                  height={32}
                                  className="rounded-full object-cover ring-2 ring-blue-100"
                                />
                                <div className="flex-1">
                                  <div className="bg-gray-50 rounded-2xl px-4 py-3">
                                    <p className="font-semibold text-gray-800">{reply.author.name}</p>
                                    <p className="text-gray-600 text-sm mt-1">{reply.content}</p>
                                  </div>
                                  <div className="flex gap-4 mt-1 text-sm text-gray-500 px-4">
                                    <motion.button 
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className={`flex items-center space-x-1 ${reply.liked ? 'text-blue-500 font-medium' : ''}`}
                                      onClick={() => handleLikeComment(reply.id!, true, comment.id)}
                                    >
                                      <Heart className="w-4 h-4" fill={reply.liked ? "currentColor" : "none"} />
                                      <span>J'aime {(reply.likes || 0) > 0 && `(${reply.likes})`}</span>
                                    </motion.button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t bg-white rounded-b-2xl">
              {replyToComment && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-blue-50 rounded-lg flex justify-between items-center"
                >
                  <span className="text-sm text-blue-600">
                    Répondre à <strong>{replyToComment.author.name}</strong>
                  </span>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setReplyToComment(null)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
              <div className="flex items-center gap-4">
                <Image 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" 
                  alt="Your avatar" 
                  width={40}
                  height={40}
                  className="rounded-full object-cover ring-2 ring-blue-100"
                />
                <div className="flex-1 flex items-center bg-gray-50 rounded-full px-6 py-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Écrivez un commentaire..."
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmitComment();
                      }
                    }}
                  />
                  <div className="flex gap-3 ml-4">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                    >
                      <Smile className="w-5 h-5 text-yellow-500" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="w-5 h-5 text-green-500" />
                    </motion.button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-blue-100 rounded-full transition-colors duration-200"
                      onClick={handleSubmitComment}
                    >
                      <Send className="w-5 h-5 text-blue-500" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {emojiPickerVisible && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-24 left-4 bg-white shadow-xl rounded-xl p-4 grid grid-cols-4 gap-2"
                >
                  {["😊", "😂", "❤️", "👍", "😍", "🎉", "🔥", "👏"].map((emoji) => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-2xl hover:bg-gray-100 p-2 rounded-lg"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Composant Post
const Post: React.FC<{
  post: Post;
  onUpdatePost: (post: Post) => void;
}> = ({ post, onUpdatePost }) => {
  const [liked, setLiked] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(post.timestamp);

  useEffect(() => {
    const interval = setInterval(() => {
      if (post.createdAt) {
        setCurrentTimestamp(timeAgo(post.createdAt));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [post.createdAt]);

  const handleLike = () => {
    setLiked(!liked);
    onUpdatePost({
      ...post,
      likes: post.likes + (liked ? -1 : 1),
    });
  };

  const handleAddComment = (newComments: Comment[]) => {
    onUpdatePost({
      ...post,
      comments: newComments,
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
      >
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="relative">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={48}
                height={48}
                className="rounded-full object-cover ring-4 ring-blue-100"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-4 flex-grow">
              <h3 className="font-bold text-xl text-gray-800 hover:text-blue-600 transition-colors duration-200">
                {post.author.name}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1 text-blue-500" />
                <span>{currentTimestamp}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-full ${bookmarked ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'} transition-colors duration-200`}
            >
              <Bookmark className="w-6 h-6" fill={bookmarked ? "currentColor" : "none"} />
            </motion.button>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">{post.content}</p>

          {post.image && (
            <motion.div 
              className="rounded-xl overflow-hidden mb-6 shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={post.image}
                alt="Post content"
                width={600}
                height={400}
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs ring-2 ring-white">
                  {post.likes}
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white text-xs ring-2 ring-white">
                  <Heart className="w-3 h-3" />
                </div>
              </div>
              <span className="ml-2">{post.likes} réactions</span>
            </div>
            <span>{post.comments.length} commentaires</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={`flex items-center px-4 py-2 rounded-xl ${
                liked 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              } transition-all duration-200`}
            >
              <Heart className="w-5 h-5 mr-2" fill={liked ? "currentColor" : "none"} />
              J'aime
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCommentModal(true)}
              className="flex items-center px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Commenter
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200"
            >
              <Flag className="w-5 h-5 mr-2" />
              Signaler
            </motion.button>
          </div>
        </div>
      </motion.div>

      <CommentModal
        post={post}
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        onAddComment={handleAddComment}
      />
    </>
  );
};

// Composant Publications
const Publications: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: { 
        name: "Jean Dupont", 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
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
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
          }, 
          content: "Excellente initiative ! J'ai hâte de voir les résultats." 
        },
        { 
          author: { 
            name: "Luc Dubois", 
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
          }, 
          content: "Pouvons-nous avoir plus de détails sur ces mesures ?" 
        }
      ]
    },
    {
      id: 2,
      author: { 
        name: "Sophie Lefebvre", 
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
      },
      content: "Rappel : la formation sur les nouveaux outils de communication aura lieu demain à 14h. N'oubliez pas de vous inscrire !",
      timestamp: "Il y a 5 heures",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop",
      likes: 8,
      comments: []
    }
  ]);

  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewPost = () => {
    if (newPostContent.trim() || newPostImage) {
      const newPost: Post = {
        id: posts.length + 1,
        author: { 
          name: "Vous", 
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
        },
        content: newPostContent,
        image: newPostImage || undefined,
        timestamp: "À l'instant",
        createdAt: new Date(),
        likes: 0,
        comments: []
      };
      setPosts([newPost, ...posts]);
      handleCancelPost();
    }
  };

  const handleCancelPost = () => {
    setNewPostContent('');
    setNewPostImage(null);
    setShowNewPostModal(false);
    setShowCamera(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            S'exprimer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Partagez vos idées, vos expériences et vos réflexions avec la communauté.
          </p>
        </motion.div>

        {posts.map(post => (
          <Post 
            key={post.id} 
            post={post}
            onUpdatePost={handleUpdatePost}
          />
        ))}

        <motion.button
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowNewPostModal(true)}
        >
          <Plus className="w-6 h-6" />
        </motion.button>

        <AnimatePresence>
          {showNewPostModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl p-8 w-full max-w-xl shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Nouvelle publication</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCancelPost}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </motion.button>
                </div>

                {newPostImage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 relative rounded-xl overflow-hidden shadow-lg"
                  >
                    <Image 
                      src={newPostImage} 
                      alt="Preview" 
                      width={500}
                      height={256}
                      className="w-full h-64 object-cover"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNewPostImage(null)}
                      className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}

                <TextArea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Que voulez-vous partager ?"
                  className="mb-6 h-32"
                />

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="w-6 h-6 text-green-500" />
                    </motion.button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                      onClick={() => setShowCamera(true)}
                    >
                      <Camera className="w-6 h-6 text-red-500" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                    >
                      <MapPin className="w-6 h-6 text-blue-500" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                    >
                      <Paperclip className="w-6 h-6 text-orange-500" />
                    </motion.button>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={handleCancelPost}>
                      Annuler
                    </Button>
                    <Button onClick={handleNewPost}>
                      <Send className="w-5 h-5 mr-2" />
                      Publier
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showCamera && (
            <VideoPreview onClose={() => setShowCamera(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Composant principal - SyndicalistHomePage
const SyndicalistHomePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");

  // const { t } = useTranslation();

  // Simulation de la fonction de traduction pour la démonstration
  const t = (key: string) => {
    const translations: Record<string, string> = {
      "rechercher": "Rechercher...",
      "notifications": "Notifications",
      "voir_toutes_les_notifications": "Voir toutes les notifications"
    };
    return translations[key] || key;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSection = localStorage.getItem("activeSection");
      if (savedSection) {
        setActiveSection(savedSection);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("activeSection", activeSection);
    }
  }, [activeSection]);
 useEffect(() => {
    setFirstName(getFirstName() ?? "");
    setLastName(getLastName() ?? "");
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <SyndicatDashboard />;
      case "organisation":
        return <OrganisationSection />;
      case "business":
        return <BusinessNavigationTabs />;
      case "explorer":
        return <Explorer />;
      case "parametres":
        return <ProfilUser />;
      default:
        return <SyndicatDashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.header
        className="bg-white shadow-lg z-20"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none"
              >
                {isSidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
              </motion.button>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SyndicManager
                </h1>
              </motion.div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("rechercher")}
                  className="w-64 pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative bg-white p-2 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    4
                  </span>
                </motion.button>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center cursor-pointer shadow-lg"
              >
                {firstName && lastName && (
                  <span className="font-semibold text-lg">
                    {firstName.charAt(0)}
                    {lastName.charAt(0)}
                  </span>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.nav
          initial={{ width: isSidebarOpen ? 256 : 64 }}
          animate={{ width: isSidebarOpen ? 256 : 64 }}
          transition={{ duration: 0.3 }}
          className={`bg-white shadow-xl flex flex-col z-20 ${isSidebarOpen ? "" : "absolute inset-y-0 left-0"}`}
        >
          <div className="flex-grow overflow-y-auto p-6">
            <nav className="space-y-4">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full p-3 rounded-xl transition-all duration-300 group ${
                    activeSection === item.id
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  } ${isSidebarOpen ? "flex items-center" : "flex justify-center"}`}
                >
                  <item.icon className={`w-5 h-5 ${isSidebarOpen ? "mr-3" : ""}`} />
                  {isSidebarOpen && (
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className={`text-xs ${activeSection === item.id ? "text-white/80" : "text-gray-500"}`}>
                        {item.description}
                      </div>
                    </div>
                  )}
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="p-6 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center ${isSidebarOpen ? "justify-center" : ""}`}
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span className="font-medium ml-2">Déconnexion</span>}
            </motion.button>
          </div>
        </motion.nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Notifications Panel */}
        <AnimatePresence>
          {isNotificationOpen && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-30"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{t("notifications")}</h3>
                    <p className="text-sm text-gray-500">Vous avez 4 nouvelles notifications</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsNotificationOpen(false)}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <NotificationItem key={index} {...notification} />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {t("voir_toutes_les_notifications")}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SyndicalistHomePage;