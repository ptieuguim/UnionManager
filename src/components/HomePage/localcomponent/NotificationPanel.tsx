import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { NotificationItem } from "./NotificationItem";
import { notifications } from "../../../fakeData/notificationFake";
import { useTranslation } from "react-i18next";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel = ({ isOpen, onClose }: NotificationsPanelProps) => {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {isOpen && (
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
                onClick={onClose}
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
  );
};
