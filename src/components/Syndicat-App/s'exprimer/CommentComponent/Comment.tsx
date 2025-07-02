"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Eye, X } from "lucide-react";
import Reply, { ReplyData } from "./CommentReponse";
import { useTranslation } from "react-i18next";

export interface CommentData {
  id: string;
  author: { name: string; avatar: string };
  content: string;
  image?: string;
  liked?: boolean;
  likes?: number;
  replies: ReplyData[];
  showReplies?: boolean;
}

interface CommentProps {
  comment: CommentData;
  onLike: (commentId: string, isReply?: boolean, parentCommentId?: string) => void;
  onReply: (comment: CommentData) => void;
  onToggleReplies: (commentId: string) => void;
  showReplies: boolean;
  onDeleteComment?: (commentId: string, isReply?: boolean, parentCommentId?: string) => void;
  isDeleting?: boolean;
}

export const Comment: React.FC<CommentProps> = ({
  comment,
  onLike,
  onReply,
  onToggleReplies,
  showReplies,
  onDeleteComment,
  isDeleting,
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      className="flex space-x-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <img
        src={comment.author.avatar}
        alt={comment.author.name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
      />
      <div className="flex-1">
        <div className="bg-gray-50 rounded-2xl px-6 py-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-800">{comment.author.name}</p>
            {onDeleteComment && (
              <motion.button
                whileHover={{ scale: 1.1, color: "rgb(239 68 68)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDeleteComment(comment.id)}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full"
                title={t("supprimer_commentaire", "Supprimer le commentaire")}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
          <p className="text-gray-600 mt-1">{comment.content}</p>
          {comment.image && (
            <img
              src={comment.image}
              alt="Comment"
              className="mt-3 rounded-lg max-w-full h-auto"
            />
          )}
        </div>
        <div className="flex gap-6 mt-2 text-sm text-gray-500 px-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center space-x-1 ${comment.liked ? "text-blue-500 font-medium" : ""}`}
            onClick={() => onLike(comment.id)}
          >
            <Heart className="w-4 h-4" fill={comment.liked ? "currentColor" : "none"} />
            <span>{t("jaime")} {comment.likes && comment.likes > 0 && `(${comment.likes})`}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-1"
            onClick={() => onReply(comment)}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Répondre</span>
          </motion.button>
          {comment.replies.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-1"
              onClick={() => onToggleReplies(comment.id)}
            >
              {showReplies ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Masquer</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>{comment.replies.length} réponses</span>
                </>
              )}
            </motion.button>
          )}
        </div>
        <AnimatePresence>
          {showReplies && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-8 mt-4 space-y-4"
            >
              {comment.replies.map((reply) => (
                <Reply
                  key={reply.id}
                  reply={reply}
                  onLike={(replyId) => onLike(replyId, true, comment.id)}
                  parentCommentId={comment.id}
                  onDeleteComment={onDeleteComment}
                  isDeleting={isDeleting}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Comment;
