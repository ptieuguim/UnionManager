import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Plus,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart,
  Award,
  TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface VoteData {
  id: number;
  description: string;
  closingDate: Date;
  votesFor: number;
  votesAgainst: number;
}

interface VoteCardProps {
  vote: VoteData;
}

const VoteCard: React.FC<VoteCardProps> = ({ vote }) => {
  const [userVote, setUserVote] = useState<null | "for" | "against">(null);
  const [isHovered, setIsHovered] = useState(false);
  const totalVotes = vote.votesFor + vote.votesAgainst;
  const forPercentage = totalVotes > 0 ? (vote.votesFor / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (vote.votesAgainst / totalVotes) * 100 : 0;
  const daysLeft = Math.ceil((vote.closingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft <= 3;

  const handleVote = (voteType: "for" | "against") => {
    if (userVote === null) {
      setUserVote(voteType);
      if (voteType === "for") {
        vote.votesFor++;
      } else {
        vote.votesAgainst++;
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
              {vote.description}
            </h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-blue-600">
                <Users className="w-4 h-4 mr-1" />
                <span>{totalVotes} votes</span>
              </div>
              <div className={`flex items-center ${isUrgent ? "text-red-500" : "text-gray-600"}`}>
                <Clock className="w-4 h-4 mr-1" />
                <span>{daysLeft} jours restants</span>
              </div>
            </div>
          </div>
          {isUrgent && (
            <div className="flex items-center bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Urgent
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-600">Pour</span>
              <span className="ml-2 text-sm font-bold text-gray-800">{forPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-600">Contre</span>
              <span className="ml-2 text-sm font-bold text-gray-800">{againstPercentage.toFixed(1)}%</span>
            </div>
          </div>
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${forPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${againstPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ left: `${forPercentage}%` }}
              className="absolute top-0 h-full bg-gradient-to-r from-red-500 to-red-600"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVote("for")}
            disabled={userVote !== null}
            className={`flex-1 mr-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
              userVote === "for"
                ? "bg-green-500 text-white shadow-lg"
                : userVote === null
                ? "bg-gray-100 text-gray-700 hover:bg-green-500 hover:text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ThumbsUp className="w-5 h-5 mr-2" />
            <span>Pour ({vote.votesFor})</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVote("against")}
            disabled={userVote !== null}
            className={`flex-1 ml-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
              userVote === "against"
                ? "bg-red-500 text-white shadow-lg"
                : userVote === null
                ? "bg-gray-100 text-gray-700 hover:bg-red-500 hover:text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ThumbsDown className="w-5 h-5 mr-2" />
            <span>Contre ({vote.votesAgainst})</span>
          </motion.button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              <span>
                Clôture le {vote.closingDate.toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {userVote && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>Vote enregistré</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const VotesList: React.FC = () => {
  const { t } = useTranslation();
  const votes: VoteData[] = [
    {
      id: 1,
      description: "Proposition de nouvelle convention collective",
      closingDate: new Date("2023-07-01T23:59:59"),
      votesFor: 45,
      votesAgainst: 15,
    },
    {
      id: 2,
      description: "Augmentation des cotisations syndicales de 2%",
      closingDate: new Date("2023-06-15T23:59:59"),
      votesFor: 30,
      votesAgainst: 25,
    },
    {
      id: 3,
      description: "Mise en place d'un comité pour l'amélioration des conditions de travail",
      closingDate: new Date("2023-07-31T23:59:59"),
      votesFor: 60,
      votesAgainst: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {t("votes_decisions")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("participez_aux_decisions_importantes_qui_faconnent_notre_avenir_collectif")}
          </p>
        </motion.div>

        <div className="mb-8 flex items-center justify-between">
          <div className="flex space-x-6">
            <div className="flex items-center px-4 py-2 bg-white rounded-xl shadow-sm">
              <BarChart className="w-5 h-5 text-blue-500 mr-2" />
              <div>
                <div className="text-sm text-gray-600">{t("votes_actifs")}</div>
                <div className="font-bold text-gray-800">{votes.length}</div>
              </div>
            </div>
            <div className="flex items-center px-4 py-2 bg-white rounded-xl shadow-sm">
              <Users className="w-5 h-5 text-green-500 mr-2" />
              <div>
                <div className="text-sm text-gray-600">{t("participants")}</div>
                <div className="font-bold text-gray-800">125</div>
              </div>
            </div>
            <div className="flex items-center px-4 py-2 bg-white rounded-xl shadow-sm">
              <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
              <div>
                <div className="text-sm text-gray-600">{t("taux_de_participation")}</div>
                <div className="font-bold text-gray-800">78%</div>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl inline-flex items-center transition duration-200 shadow-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            {t("nouveau_vote")}
          </motion.button>
        </div>

        <div className="space-y-6">
          <AnimatePresence>
            {votes.map((vote) => (
              <VoteCard key={vote.id} vote={vote} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VotesList;
