"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, TrendingUp, ChevronRight, Building, BarChart2 } from "lucide-react";
import SearchInterface from "../HomePage/SearchSection";
import { useRouter } from "next/navigation";
import Header from "./Header";
import EvenList from "./ActuSection/EvenList";
import Publications from "./ActuSection/PublicationList";
import { useTranslation } from "react-i18next";

// Typescript interfaces
interface Syndicat {
  id: number;
  name: string;
  members: number;
  image: string;
}

interface Stat {
  id: number;
  name: string;
  value: number;
  icon: React.ElementType;
}

const popularSyndicats: Syndicat[] = [
  {
    id: 1,
    name: "Syndicat National de l'Éducation",
    members: 250000,
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 2,
    name: "Union des Travailleurs de la Santé",
    members: 180000,
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 3,
    name: "Fédération des Employés du Commerce",
    members: 150000,
    image:
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
];

const statistics: Stat[] = [
  { id: 1, name: "Syndicats inscrits", value: 1500, icon: Building },
  { id: 2, name: "Utilisateurs actifs", value: 50000, icon: Users },
  { id: 3, name: "Taux de satisfaction", value: 98, icon: TrendingUp },
  { id: 4, name: "Événements organisés", value: 3200, icon: BarChart2 },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#6BAED6] to-indigo-200">
      <Header />
      <main className="flex-grow">
        {/* Section Héros */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-gradient-to-r from-[#6BAED6] to-indigo-700 text-white py-20"
        >
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t("gérerSyndicats")}
              </h1>
              <p className="text-xl mb-8">
                {t("syndicmanager_description")}
              </p>
              <motion.button
                className="bg-gradient-to-r from-[#6BAED6] to-indigo-700 text-white px-8 py-3 rounded-full font-semibold flex items-center hover:opacity-90 transition duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/register")}
              >
                {t("commencer_maintenant")}
                <ChevronRight className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt={t("gestionSyndicale")}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </motion.section>

        {/* Section Fonctionnalités */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="py-16 bg-white"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-indigo-800 mb-12 text-center">
              {t("pourquoi_choisir_syndicmanager")}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full p-4 inline-block mb-4">
                  <TrendingUp className="h-8 w-8 text-indigo-700" />
                </div>
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">{t("gestion_efficace")}</h3>
                <p className="text-gray-600">
                  {t("description_gestion_efficace")}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full p-4 inline-block mb-4">
                  <Users className="h-8 w-8 text-indigo-700" />
                </div>
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">{t("collaboration_simplifiee")}</h3>
                <p className="text-gray-600">
                  {t("description_collaboration_simplifiee")}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full p-4 inline-block mb-4">
                  <Building className="h-8 w-8 text-indigo-700" />
                </div>
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">{t("transparence_accrue")}</h3>
                <p className="text-gray-600">
                  {t("description_transparence_accrue")}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section Recherche */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="py-16 bg-white"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-indigo-800 mb-8 text-center">
              {t("trouver_votre_syndicat")}
            </h2>
            <div className="max-w-xl mx-auto relative">
              <input
                type="text"
                placeholder={t("placeholder_nom_syndicat")}
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-[#6BAED6] focus:border-indigo-700 focus:ring focus:ring-indigo-300 transition duration-300 shadow-sm"
                onClick={() => setIsSearchOpen(true)}
                readOnly
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6BAED6]" />
            </div>
          </div>
        </motion.section>

        {/* Section Syndicats Populaires */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          className="py-16 bg-gradient-to-r from-[#6BAED6] to-indigo-200"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-indigo-800 mb-8 text-center">
              {t("syndicats_populaires")}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {popularSyndicats.map((syndicat) => (
                <motion.div
                  key={syndicat.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
                  whileHover={{ y: -5 }}
                >
                  <img
                    src={syndicat.image}
                    alt={syndicat.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                      {syndicat.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <Users className="h-5 w-5 mr-2 text-[#6BAED6]" />
                      <span>{syndicat.members.toLocaleString()} membres</span>
                    </div>
                    <motion.button
                      className="w-full bg-gradient-to-r from-[#6BAED6] to-indigo-700 text-white py-2 rounded-md flex items-center justify-center transition duration-300 hover:opacity-90 shadow-md"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t("en_savoir_plus")}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Section Publications & Événements */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
          className="py-16 bg-gradient-to-r from-[#6BAED6] to-indigo-200"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-indigo-800 mb-12 text-center">
              {t("actualites_et_evenements")}
            </h2>
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-indigo-800 mb-6">
                  {t("publications_recentes")}
                </h3>
                <Publications limit={3} />
                <div className="text-center mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#6BAED6] to-indigo-700 text-white px-6 py-2 rounded-full font-semibold inline-flex items-center transition duration-300 hover:opacity-90 shadow-md"
                    onClick={() => router.push("/publications")}
                  >
                    {t("voir_plus_de_publications")}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </motion.button>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-indigo-800 mb-6">
                  {t("evenements_a_venir")}
                </h3>
                <EvenList limit={3} />
                <div className="text-center mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#6BAED6] to-indigo-700 text-white px-6 py-2 rounded-full font-semibold inline-flex items-center transition duration-300 hover:opacity-90 shadow-md"
                    onClick={() => router.push("/events")}
                  >
                    {t("voir_plus_d_evenements")}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section Statistiques */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
          className="py-16 bg-gradient-to-r from-[#6BAED6] to-indigo-200"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-indigo-800 mb-12 text-center">
              {t("syndicmanager_en_chiffres")}
            </h2>
            <div className="grid gap-8 md:grid-cols-4">
              {statistics.map((stat) => (
                <motion.div
                  key={stat.id}
                  className="bg-white rounded-lg p-6 text-center shadow-md transition duration-300 hover:shadow-xl"
                  whileHover={{ y: -5 }}
                >
                  <stat.icon className="h-12 w-12 text-[#6BAED6] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-indigo-800 mb-2">
                    {stat.name === "Taux de satisfaction" ? `${stat.value}%` : stat.value.toLocaleString()}
                  </h3>
                  <p className="text-indigo-700">{stat.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      {/* Pied de page */}
      <motion.footer
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
        className="bg-gradient-to-r from-[#6BAED6] to-indigo-700 text-white py-8"
      >
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-6 w-6" />
                <span className="text-xl font-semibold">SyndicManager</span>
              </div>
              <p className="text-indigo-100">
                {t("description_plateforme")}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t("liens_rapides")}</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-indigo-100 hover:text-indigo-200 transition duration-300">
                    {t("a_propos")}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-100 hover:text-indigo-200 transition duration-300">
                    {t("services")}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-100 hover:text-indigo-200 transition duration-300">
                    {t("contact")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t("suivez_nous")}</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-indigo-100 hover:text-indigo-200 transition duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-indigo-100 hover:text-indigo-200 transition duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
      <SearchInterface syndicats={[]} />
    </div>
  );
};

export default LandingPage;
