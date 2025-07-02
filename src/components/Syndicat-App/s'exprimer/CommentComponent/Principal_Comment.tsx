"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Image as ImageIcon, Send, X,  } from "lucide-react";
import Comment, { CommentData } from "./Comment";
import EmojiPicker from "./EmojiPicker";
import { useTranslation } from "react-i18next";
import { apiClient } from "@/services/AxiosConfig";
import toast from "react-hot-toast";

interface Author {
  name: string;
  avatar: string;
}

interface PrincipalCommentProps {
  post: {
    id: string;
    author: Author;
    content: string;
    image?: string;
    timestamp: string;
    comments: CommentData[];
  };
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (comment: CommentData) => void;
}

export const CommentModal: React.FC<PrincipalCommentProps> = ({ post, isOpen, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState("");
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const [replyToComment, setReplyToComment] = useState<CommentData | null>(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const lastCommentRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [comments, setComments] = useState<CommentData[]>(
    post.comments.map((comment) => ({
      ...comment,
      liked: false,
      likes: 0,
      replies: [],
      showReplies: false,
    }))
  );

  // Fonction pour faire défiler vers le dernier commentaire
  const scrollToBottom = (smooth = true) => {
    setTimeout(() => {
      if (lastCommentRef.current) {
        lastCommentRef.current.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "end",
        });
      } else if (commentsEndRef.current) {
        commentsEndRef.current.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "end",
        });
      }
    }, 100);
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(false);
    }
  }, [isOpen]);

  const handleSubmitComment = () => {
    if (newComment.trim() || commentImage) {
      const newCommentObj: CommentData = {
        id: Date.now().toString(),
        author: {
          name: "Vous",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
        },
        content: newComment,
        image: commentImage || undefined,
        liked: false,
        likes: 0,
        replies: [],
      };
      let updatedComments;
      if (replyToComment) {
        updatedComments = comments.map((comment) =>
          comment.id === replyToComment.id
            ? { ...comment, replies: [...comment.replies, { ...newCommentObj, isReply: true }] }
            : comment
        );
        setComments(updatedComments);
        setReplyToComment(null);
        toast.success(t("reply_added", "Réponse ajoutée"));
      } else {
        updatedComments = [...comments, newCommentObj];
        setComments(updatedComments);
        toast.success(t("comment_added", "Commentaire ajouté"));
      }
      onAddComment(newCommentObj);
      setNewComment("");
      setCommentImage(null);
      scrollToBottom();
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCommentImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLikeComment = (commentId: string, isReply = false, parentCommentId?: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (isReply && parentCommentId && comment.id === parentCommentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId ? { ...reply, liked: !reply.liked, likes: (reply.likes || 0) + (reply.liked ? -1 : 1) } : reply
            ),
          };
        } else if (!isReply && comment.id === commentId) {
          return { ...comment, liked: !comment.liked, likes: (comment.likes || 0) + (comment.liked ? -1 : 1) };
        }
        return comment;
      })
    );
  };

  const handleToggleReplies = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, showReplies: !comment.showReplies } : comment
      )
    );
  };

  const handleDeleteComment = async (commentId: string, isReply = false, parentCommentId?: string) => {
  // Demande de confirmation utilisateur
  if (!window.confirm(t('confirm_delete_comment', 'Êtes-vous sûr de vouloir supprimer ce commentaire ?')))
    return;

  setIsDeletingComment(true);
  const toastId = toast.loading(t('deleting_comment', 'Suppression du commentaire...'));

  try {
    let response;
    // Récupérer l'userId depuis le localStorage (comme dans le backend)
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('Utilisateur non authentifié');

    if (isReply && parentCommentId) {
      // À adapter selon l'API réelle (ici, suppression par ID générique)
      response = await apiClient.delete(`/api/comments/${commentId}?userId=${userId}`);
    } else {
      response = await apiClient.delete(`/api/comments/${commentId}?userId=${userId}`);
    }

    if (response.status === 200 || response.status === 204) {
      setComments((prevComments) => {
        if (isReply && parentCommentId) {
          return prevComments.map((comment) =>
            comment.id === parentCommentId
              ? { ...comment, replies: comment.replies.filter((reply) => reply.id !== commentId) }
              : comment
          );
        } else {
          return prevComments.filter((comment) => comment.id !== commentId);
        }
      });
      toast.success(t('comment_deleted_successfully', 'Commentaire supprimé avec succès !'), { id: toastId });
      // Optionnel : notifier le parent si besoin
    } else {
      toast.error(t('error_deleting_comment_server', 'Erreur serveur lors de la suppression.'), { id: toastId });
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    toast.error(t('error_deleting_comment_network', 'Impossible de supprimer le commentaire.'), { id: toastId });
  } finally {
    setIsDeletingComment(false);
  }
};

  const handleEmojiClick = (emoji: string) => {
    setNewComment((prev) => prev + emoji);
    setEmojiPickerVisible(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
            <Smile className="w-7 h-7 mr-2 text-blue-500" />
            {t("commentaires", "Commentaires")}
          </h2>
          <div ref={commentsContainerRef} className="max-h-96 overflow-y-auto pr-2 mb-4">
            {comments.length === 0 ? (
              <div className="text-center text-gray-500 py-6">{t("aucun_commentaire", "Aucun commentaire.")}</div>
            ) : (
              comments.map((comment, idx) => (
                <div key={comment.id} ref={idx === comments.length - 1 ? lastCommentRef : undefined}>
                  <Comment
                    comment={comment}
                    onLike={handleLikeComment}
                    onReply={setReplyToComment}
                    onToggleReplies={handleToggleReplies}
                    showReplies={!!comment.showReplies}
                    onDeleteComment={handleDeleteComment}
                    isDeleting={isDeletingComment}
                  />
                </div>
              ))
            )}
            <div ref={commentsEndRef} />
          </div>
          <div className="relative mt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEmojiPickerVisible((v) => !v)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <Smile className="w-6 h-6" />
              </button>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyToComment ? t("repondre_commentaire", "Répondre au commentaire...") : t("ecrire_un_commentaire", "Écrire un commentaire...")}
                className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newComment.trim()) {
                    handleSubmitComment();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-gray-100 text-green-500"
              >
                <ImageIcon className="w-6 h-6" />
              </button>
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
                className={`p-3 rounded-full transition-colors duration-200 ${newComment.trim() || commentImage ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 text-gray-400"}`}
                onClick={handleSubmitComment}
                disabled={!newComment.trim() && !commentImage}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
            {emojiPickerVisible && (
              <div className="absolute bottom-16 right-4 z-10">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            {commentImage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 relative rounded-lg overflow-hidden shadow-sm max-h-32"
              >
                <img
                  src={commentImage}
                  alt="Preview"
                  className="w-auto h-full object-cover"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCommentImage(null)}
                  className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommentModal;
