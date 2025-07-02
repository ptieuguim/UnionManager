"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface NotificationProps {
  isVisible: boolean;
  message: string;
  type: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  isVisible,
  message,
  type,
  onClose,
  autoClose = false,
  duration = 5000,
}) => {
  useEffect(() => {
    if (isVisible && autoClose && typeof window !== "undefined") {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-6 right-6 z-50 max-w-md"
          role="alert"
        >
          <div
            className={`flex items-center p-4 rounded-lg shadow-lg ${
              type === 'error'
                ? 'bg-red-50 border-l-4 border-red-500 text-red-800'
                : 'bg-green-50 border-l-4 border-green-500 text-green-800'
            }`}
          >
            <div className="mr-3">
              {type === 'error' ? (
                <AlertCircle className="h-6 w-6 text-red-500" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-500" />
              )}
            </div>
            <div className="flex-1 mr-2">{message}</div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
