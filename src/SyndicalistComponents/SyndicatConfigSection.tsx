import React, { useState, ChangeEvent, FormEvent } from "react";
import { Building, Camera, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface UnionProfile {
  name: string;
  type: string;
  domain: string;
  description: string;
  coverImage: string;
}

const defaultCoverImage =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200";

const SyndicatConfigSection: React.FC = () => {
  const { t } = useTranslation();
  const [unionProfile, setUnionProfile] = useState<UnionProfile>({
    name: "",
    type: "",
    domain: "",
    description: "",
    coverImage: defaultCoverImage,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUnionProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    // eslint-disable-next-line no-console
    console.log("Profile updated:", unionProfile);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
            <Building className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t("syndicat_config.title")}</h2>
            <p className="text-gray-600">{t("syndicat_config.subtitle")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative h-48 rounded-xl overflow-hidden mb-8">
            <img
              src={unionProfile.coverImage}
              alt={t("syndicat_config.cover_alt")}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg flex items-center gap-2 hover:bg-white transition-colors"

            >
              <Camera className="h-5 w-5" />
              <span>{t("syndicat_config.change_image")}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("syndicat_config.name_label")}
              </label>
              <input
                type="text"
                name="name"
                value={unionProfile.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                placeholder={t("syndicat_config.name_placeholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("syndicat_config.type_label")}
              </label>
              <select
                name="type"
                value={unionProfile.type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
              >
                <option value="">{t("syndicat_config.type_select")}</option>
                <option value="professional">{t("syndicat_config.type_professional")}</option>
                <option value="industry">{t("syndicat_config.type_industry")}</option>
                <option value="service">{t("syndicat_config.type_service")}</option>
                <option value="other">{t("syndicat_config.type_other")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("syndicat_config.domain_label")}
              </label>
              <input
                type="text"
                name="domain"
                value={unionProfile.domain}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                placeholder={t("syndicat_config.domain_placeholder")}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("syndicat_config.description_label")}
            </label>
            <textarea
              name="description"
              value={unionProfile.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
              placeholder={t("syndicat_config.description_placeholder")}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Save className="h-5 w-5" />
            {t("syndicat_config.save_btn")}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default SyndicatConfigSection;
