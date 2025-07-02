import { motion } from "framer-motion";
import { ArrowRightCircle, BarChart2, Bell, Calendar, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Syndicat {
  id: string | number;
  name: string;
  image: string;
  type: string;
  location: string;
  members: number;
  trend: "up" | "down" | "stable";
}

interface SyndicatCardProps {
  containerVariants?: any;
  itemVariants?: any;
  onJoinSyndicat: (syndicat: Syndicat) => void;
  listSyndicats: Syndicat[];
  adherer?: boolean;
}

export const SyndicatCard = ({
  containerVariants,
  itemVariants,
  onJoinSyndicat,
  listSyndicats,
  adherer
}: SyndicatCardProps) => {
  const { t } = useTranslation();
  return (
    <motion.div
      className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {listSyndicats.map((syndicat) => (
        <motion.div
          key={syndicat.id}
          className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
          variants={itemVariants}
          whileHover={{ y: -8 }}
        >
          <div className="relative aspect-video">
            <img
              src={syndicat.image}
              alt={syndicat.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-semibold text-white bg-blue-600/90 rounded-lg px-3 py-1.5">
                  {syndicat.type}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-white bg-black/30 px-2 py-1 rounded-full">
                    {syndicat.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 line-clamp-2 leading-snug">
              {syndicat.name}
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">
                  {syndicat.members.toLocaleString()} membres
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {syndicat.trend === "up" && (
                  <TrendingUp className="h-5 w-5 text-green-500 animate-pulse" />
                )}
                {syndicat.trend === "down" && (
                  <TrendingUp className="h-5 w-5 text-red-500 rotate-180" />
                )}
                {syndicat.trend === "stable" && (
                  <BarChart2 className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Prochain événement</span>
                </div>
                <span className="font-medium">
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric",
                    month: "short"
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>{t("notifications")}</span>
                </div>
                <span className="font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {Math.floor(Math.random() * 10)} nouveaux
                </span>
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <motion.button
              className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl hover:shadow-lg transition-all flex items-center justify-center font-semibold group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onJoinSyndicat(syndicat)}
            >
              <span>{t("accederEspace")}</span>
              <ArrowRightCircle className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
