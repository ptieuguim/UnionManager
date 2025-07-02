"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Users, FileText, Calendar, ShoppingBag, MapPin, Edit, Trash2, Plus, Check, X, Settings, MessageSquare, Upload, Phone, Mail, Building, DollarSign, Save
} from "lucide-react";
import Modal from "./modal";
import ProductForm from "./product-form";
import ServiceForm from "./service-form";
import BranchForm from "./branch-form";
import { useTranslation } from "react-i18next";

// --- Interfaces strictes ---
export interface MembershipRequest {
  id: number;
  name: string;
  motivation: string;
  phone: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

export interface SyndicatConfigState {
  syndicatName: string;
  syndicatType: string;
  syndicatDescription: string;
  coverImage: string;
  contactPhone: string;
  contactEmail: string;
  membershipRequests: MembershipRequest[];
  products: Product[];
}

// --- Variants animations ---
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Users, FileText, Calendar, ShoppingBag, MapPin, Edit, Trash2, Plus, Check, X, Settings, MessageSquare, Upload, Phone, Mail, Building, DollarSign, Save
} from "lucide-react";
import Modal from "./modal";
import ProductForm from "./product-form";
import ServiceForm from "./service-form";
import BranchForm from "./branch-form";
import { useTranslation } from "react-i18next";

export interface MembershipRequest {
  id: number;
  name: string;
  motivation: string;
  phone: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface Branch {
  id: number;
  name: string;
  coordinates: { lat: number; lng: number };
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const SyndicatConfig: React.FC = () => {
  const { t } = useTranslation();
  const [syndicatName, setSyndicatName] = useState<string>("Syndicat des Mototaximan de Douala");
  const [syndicatType, setSyndicatType] = useState<string>("Syndicat professionnel");
  const [syndicatDescription, setSyndicatDescription] = useState<string>("Défendre les droits et améliorer les conditions de travail");
  const [coverImage, setCoverImage] = useState<string>("https://images.unsplash.com/photo-1594495894542-a46cc73e081a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80");
  const [contactPhone, setContactPhone] = useState<string>("01 23 45 67 89");
  const [contactEmail, setContactEmail] = useState<string>("contact@syndicat-tu.org");

  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([
    {
      id: 1,
      name: "Alice Dupont",
      motivation: "Je souhaite m'engager pour défendre nos droits",
      phone: "06 12 34 56 78",
      email: "alice.dupont@email.com",
    },
    {
      id: 2,
      name: "Bob Martin",
      motivation: "Passionné par l'action syndicale",
      phone: "06 98 76 54 32",
      email: "bob.martin@email.com",
    },
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "T-shirt du syndicat",
      description: "T-shirt 100% coton bio",
      price: "15€",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      id: 2,
      name: "Livre sur les droits des travailleurs",
      description: "Guide complet sur vos droits",
      price: "25€",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      id: 3,
      name: "Mug syndical",
      description: "Pour vos pauses café engagées",
      price: "10€",
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      id: 4,
      name: "Casquette syndicale",
      description: "Affichez fièrement vos couleurs",
      price: "12€",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      id: 5,
      name: "Poster revendicatif",
      description: "Décorez vos murs avec vos valeurs",
      price: "8€",
      image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      id: 6,
      name: "Stylo du syndicat",
      description: "Écrivez pour vos droits",
      price: "3€",
      image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=200&h=200&q=80",
    },
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: "Consultation juridique",
      description: "30 minutes de conseil avec un expert",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      id: 2,
      name: "Formation sur le droit du travail",
      description: "Session de 2 heures",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      id: 3,
      name: "Assistance négociation salariale",
      description: "Préparez votre entretien",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      id: 4,
      name: "Médiation employeur-employé",
      description: "Résolution de conflits",
      image: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      id: 5,
      name: "Atelier bien-être au travail",
      description: "Améliorez votre quotidien",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      id: 7,
      name: "Permanence syndicale",
      description: "Rencontrez vos représentants",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=200&h=200&q=80",
    },
  ]);

  const [branches, setBranches] = useState<Branch[]>([
    { id: 1, name: "Antenne Paris", coordinates: { lat: 48.8566, lng: 2.3522 } },
    { id: 2, name: "Antenne Lyon", coordinates: { lat: 45.7578, lng: 4.832 } },
  ]);

  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleMembershipRequest = (id: number, action: "approve" | "reject") => {
    setMembershipRequests(membershipRequests.filter((request) => request.id !== id));
    // Logique pour approuver ou rejeter la demande (API, notification, etc.)
  };

  const handleAddProduct = (product: Omit<Product, "id">) => {
    setProducts([...products, { ...product, id: Date.now() }]);
    setIsProductModalOpen(false);
  };

  const handleAddService = (service: Omit<Service, "id">) => {
    setServices([...services, { ...service, id: Date.now() }]);
    setIsServiceModalOpen(false);
  };

  const handleAddBranch = (branch: Omit<Branch, "id">) => {
    setBranches([...branches, { ...branch, id: Date.now() }]);
    setIsBranchModalOpen(false);
  };

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50">
      {/* En-tête avec image de couverture et nom du syndicat */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-blue-900 opacity-75 flex items-center justify-center">
          <h1 className="text-5xl font-extrabold text-white text-center">
            {syndicatName}
          </h1>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto p-8 space-y-12"
      >
        {/* Section 1 : Statistiques et Adhésions */}
        <motion.section
          variants={sectionVariants}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-200"
        >
          <h2 className="text-3xl font-bold mb-6 text-indigo-900 flex items-center">
            <Users className="mr-2 text-indigo-500" />
            Statistiques et Adhésions
          </h2>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: <Users className="text-indigo-500" />, label: t("membres"), value: "1,234" },
              { icon: <FileText className="text-indigo-500" />, label: "Publications", value: "56" },
              { icon: <Calendar className="text-indigo-500" />, label: t("evenements"), value: "12" },
              { icon: <ShoppingBag className="text-indigo-500" />, label: "Produits", value: products.length.toString() },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-2xl shadow-xl flex items-center justify-between transition-transform duration-300"
              >
                <div className="p-3 rounded-full bg-indigo-100 shadow-inner">
                  {stat.icon}
                </div>
                <div className="text-right">
                  <p className="text-sm text-indigo-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-indigo-900">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Gestion des adhésions */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-indigo-700 flex items-center">
              <Users className="mr-2 text-indigo-400" />
              Demandes d'adhésion
            </h3>
            {membershipRequests.map((request) => (
              <motion.div
                key={request.id}
                variants={sectionVariants}
                className="bg-white p-4 rounded-2xl shadow-lg border border-indigo-100 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg text-indigo-700">
                      {request.name}
                    </h4>
                    <p className="text-gray-600">{request.motivation}</p>
                    <p className="text-sm text-gray-500 flex items-center mt-2">
                      <Phone className="mr-2 text-indigo-500" size={16} />
                      {request.phone}
                      <Mail className="ml-4 mr-2 text-indigo-500" size={16} />
                      {request.email}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMembershipRequest(request.id, "approve")}
                      className="p-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      <Check size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMembershipRequest(request.id, "reject")}
                      className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section 2 : Gestion des Produits et Services */}
        <motion.section
          variants={sectionVariants}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-200"
        >
          <h2 className="text-3xl font-bold mb-6 text-indigo-900 flex items-center">
            <ShoppingBag className="mr-2 text-indigo-500" />
            Produits et Services
          </h2>

          {/* Gestion des produits */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-indigo-700 flex items-center">
              <ShoppingBag className="mr-2 text-indigo-400" />
              Produits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white p-6 rounded-2xl shadow-xl transition-transform duration-300"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h4 className="font-semibold text-lg text-indigo-700">{product.name}</h4>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                  <p className="text-indigo-900 font-bold mt-2 flex items-center">
                    <DollarSign size={16} className="mr-1" />
                    {product.price}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProductModalOpen(true)}
              className="mt-6 flex items-center justify-center w-full py-2 bg-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-800 transition-colors duration-200"
            >
              <Plus size={20} className="mr-2" /> Ajouter un produit
            </motion.button>
          </div>

          {/* Gestion des services */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-indigo-700 flex items-center">
              <MessageSquare className="mr-2 text-indigo-400" />
              Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white p-6 rounded-2xl shadow-xl transition-transform duration-300"
                >
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h4 className="font-semibold text-lg text-indigo-700">{service.name}</h4>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsServiceModalOpen(true)}
              className="mt-6 flex items-center justify-center w-full py-2 bg-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-800 transition-colors duration-200"
            >
              <Plus size={20} className="mr-2" /> Ajouter un service
            </motion.button>
          </div>
        </motion.section>

        {/* Section 3 : Configuration du profil */}
        <motion.section
          variants={sectionVariants}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-200"
        >
          <h2 className="text-3xl font-bold mb-6 text-indigo-900 flex items-center">
            <Settings className="mr-2 text-indigo-500" />
            {t("configuration_du_profil")}
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2 flex items-center">
                <Upload className="mr-2 text-indigo-500" />
                Image de couverture
              </label>
              <div className="relative h-48 bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={coverImage || "/placeholder.svg"}
                  alt="Couverture"
                  className="w-full h-full object-cover"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={triggerFileInput}
                  className="absolute bottom-2 right-2 p-2 bg-indigo-700 rounded-full shadow-lg hover:bg-indigo-800 transition-colors duration-200"
                >
                  <Edit size={20} className="text-white" />
                </motion.button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCoverImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            <div>
              <label htmlFor="syndicatName" className="block text-sm font-medium text-indigo-700 mb-2 flex items-center">
                <Users className="mr-2 text-indigo-500" />
                Nom du syndicat
              </label>
              <input
                type="text"
                id="syndicatName"
                value={syndicatName}
                onChange={e => setSyndicatName(e.target.value)}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="syndicatType" className="block text-sm font-medium text-indigo-700 mb-2 flex items-center">
                <FileText className="mr-2 text-indigo-500" />
                Type de syndicat
              </label>
              <input
                type="text"
                id="syndicatType"
                value={syndicatType}
                onChange={e => setSyndicatType(e.target.value)}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="syndicatDescription" className="block text-sm font-medium text-indigo-700 mb-2 flex items-center">
                <FileText className="mr-2 text-indigo-500" />
                Description du syndicat
              </label>
              <textarea
                id="syndicatDescription"
                value={syndicatDescription}
                onChange={e => setSyndicatDescription(e.target.value)}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                rows={4}
              />
            </div>
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-indigo-700 mb-2 flex items-center">
                <Phone className="mr-2 text-indigo-500" />
                {t("telephone")}
              </label>
              <input
                type="tel"
                id="contactPhone"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-indigo-700 mb-2 flex items-center">
                <Mail className="mr-2 text-indigo-500" />
                {t("email")}
              </label>
              <input
                type="email"
                id="contactEmail"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>
          </div>
        </motion.section>
      </motion.div>

      {/* Modales pour l’ajout de produit, service ou branche */}
      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)}>
        <ProductForm onSubmit={handleAddProduct} />
      </Modal>
      <Modal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)}>
        <ServiceForm onSubmit={handleAddService} />
      </Modal>
      <Modal isOpen={isBranchModalOpen} onClose={() => setIsBranchModalOpen(false)}>
        <BranchForm onSubmit={handleAddBranch} />
      </Modal>
    </div>
  );
};

export default SyndicatConfig;
