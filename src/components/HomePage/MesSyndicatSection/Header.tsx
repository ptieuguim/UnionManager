"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const MySyndicatHeader: React.FC = () => {
    const { t } = useTranslation();

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 relative"
        >
            <div
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-200 to-indigo-200 opacity-20 blur-3xl h-32 -z-10"></div>
            <div className="max-w-4xl mx-auto space-y-4">
                <div
                    className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm mb-4">
                    <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-600">{t("gestionSyndicale")}</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                    {t("mesSyndicats")}
                    <div
                        className="mt-4 w-16 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto"></div>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    {t("hubAffiliationsSyndicales")}
                </p>
            </div>
        </motion.header>
    );
};
