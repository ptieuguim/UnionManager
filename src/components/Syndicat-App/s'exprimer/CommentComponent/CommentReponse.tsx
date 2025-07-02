"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface ReplyData {
  id: string;
  author: { name: string; avatar: string };
  content: string;
  liked?: boolean;
  likes?: number;
}

interface ReplyProps {
  reply: ReplyData;
  onLike: (replyId: string) => void;
  onDeleteComment?: (replyId: string, isReply?: boolean, parentCommentId?: string) => void;
  parentCommentId?: string;
  isDeleting?: boolean;
}

export const Reply: React.FC<ReplyProps> = ({ reply, onLike, onDeleteComment, parentCommentId, isDeleting }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex space-x-3"
    >
      <img
        src={reply.author.avatar}
        alt={reply.author.name}
        className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100"
      />
      <div className="flex-1">
        <div className="bg-gray-50 rounded-2xl px-4 py-3">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-800">{reply.author.name}</p>
            {onDeleteComment && (
              <motion.button
                whileHover={{ scale: 1.1, color: "rgb(239 68 68)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDeleteComment(reply.id, true, parentCommentId)}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full text-xs"
                title={t("supprimer_reponse", "Supprimer la réponse")}
              >
                <X className="w-3 h-3" />
              </motion.button>
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">{reply.content}</p>
        </div>
        <div className="flex gap-4 mt-1 text-sm text-gray-500 px-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center space-x-1 ${reply.liked ? "text-blue-500 font-medium" : ""}`}
            onClick={() => onLike(reply.id)}
          >
            <Heart className="w-4 h-4" fill={reply.liked ? "currentColor" : "none"} />
            <span>{t("jaime")} {reply.likes && reply.likes > 0 && `(${reply.likes})`}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Reply;
