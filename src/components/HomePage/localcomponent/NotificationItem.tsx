import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  gradient: string;
}

export const NotificationItem = ({ title, description, time, icon: Icon, gradient }: NotificationItemProps) => (
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
