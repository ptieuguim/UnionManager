import React from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  message: string;
  type?: NotificationType;
  isVisible?: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const typeColors: Record<NotificationType, string> = {
  success: 'bg-green-100 text-green-800 border-green-400',
  error: 'bg-red-100 text-red-800 border-red-400',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  info: 'bg-blue-100 text-blue-800 border-blue-400',
};

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  isVisible = true,
  onClose,
  autoClose = false,
  duration = 3000,
}) => {
  React.useEffect(() => {
    if (autoClose && isVisible && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-50 border px-4 py-3 rounded shadow-lg flex items-center gap-2 ${typeColors[type]}`}
      role="alert"
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-xl leading-none focus:outline-none"
          aria-label="Fermer la notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Notification;
