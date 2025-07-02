"use client";

import React, { useState, ChangeEvent, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Handshake, Plus, X, Star, ChevronDown, ChevronUp,
    Phone, Mail, Globe, MapPin, Tag, Calendar, Gift
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Button Props
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: "default" | "outline" | "ghost";
}

const Button: FC<ButtonProps> = ({ children, onClick, className = "", variant = "default" }) => {
    const baseStyle = "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantStyles = {
        default: "bg-blue-500 text-white hover:bg-blue-600",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
        ghost: "text-gray-600 hover:bg-gray-100",
    };
    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${variantStyles[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

// Input Props
interface InputProps {
    id?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
}

const Input: FC<InputProps> = ({ id, value, onChange, placeholder, className = "" }) => (
    <input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md ${className}`}
    />
);

// TextArea Props
interface TextAreaProps {
    id?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    className?: string;
}

const TextArea: FC<TextAreaProps> = ({ id, value, onChange, placeholder, className = "" }) => (
    <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md resize-none ${className}`}
    />
);

// Partner type
interface Partner {
    id: number;
    name: string;
    category: string;
    logo: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    benefits: string[];
}

// Partner Card component
const PartnerCard: FC<{ partner: Partner }> = ({ partner }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md p-4 mb-4"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <img src={partner.logo} alt={partner.name} className="w-16 h-16 object-contain mr-4" />
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">{partner.name}</h3>
                        <p className="text-sm text-gray-500">{partner.category}</p>
                    </div>
                </div>
                <Button variant="ghost" onClick={() => setExpanded(!expanded)}>
                    {expanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </Button>
            </div>
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-2" />
                            <span>{partner.address}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Phone className="w-5 h-5 mr-2" />
                            <span>{partner.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Mail className="w-5 h-5 mr-2" />
                            <span>{partner.email}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Globe className="w-5 h-5 mr-2" />
                            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {partner.website}
                            </a>
                        </div>
                        <div>
                            <p className="font-semibold mb-1">Avantages :</p>
                            <ul className="list-disc pl-5">
                                {partner.benefits.map((benefit, idx) => (
                                    <li key={idx}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Main Partnerships component
export const Partnerships: FC = () => {
    const { t } = useTranslation();
    const [partners, setPartners] = useState<Partner[]>([]); // Remplacer par les données réelles si besoin
    const [showForm, setShowForm] = useState(false);
    const [newPartner, setNewPartner] = useState<Omit<Partner, "id">>({
        name: "",
        category: "",
        logo: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        benefits: [""]
    });

    // Gestion des avantages dynamiques
    const handleAddBenefit = () => {
        setNewPartner((prev) => ({ ...prev, benefits: [...prev.benefits, ""] }));
    };
    const handleRemoveBenefit = (index: number) => {
        setNewPartner((prev) => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }));
    };
    const handleBenefitChange = (index: number, value: string) => {
        setNewPartner((prev) => ({
            ...prev,
            benefits: prev.benefits.map((b, i) => (i === index ? value : b)),
        }));
    };
    const handleNewPartner = () => {
        setPartners((prev) => [
            ...prev,
            { ...newPartner, id: prev.length + 1 }
        ]);
        setShowForm(false);
        setNewPartner({
            name: "",
            category: "",
            logo: "",
            address: "",
            phone: "",
            email: "",
            website: "",
            benefits: [""]
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                    <Handshake className="w-7 h-7 mr-2 text-blue-500" />
                    {t("partenaires")}
                </h2>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="w-5 h-5 mr-2" />
                    {t("ajouter_un_partenaire")}
                </Button>
            </div>
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="bg-white rounded-lg shadow-md p-6 mb-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t("nom_du_partenaire")}</label>
                                <Input
                                    id="name"
                                    value={newPartner.name}
                                    onChange={e => setNewPartner(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder={t("nom_du_partenaire")}
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">{t("categorie")}</label>
                                <Input
                                    id="category"
                                    value={newPartner.category}
                                    onChange={e => setNewPartner(prev => ({ ...prev, category: e.target.value }))}
                                    placeholder={t("categorie")}
                                />
                            </div>
                            <div>
                                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">{t("logo")}</label>
                                <Input
                                    id="logo"
                                    value={newPartner.logo}
                                    onChange={e => setNewPartner(prev => ({ ...prev, logo: e.target.value }))}
                                    placeholder={t("url_du_logo")}
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">{t("adresse")}</label>
                                <Input
                                    id="address"
                                    value={newPartner.address}
                                    onChange={e => setNewPartner(prev => ({ ...prev, address: e.target.value }))}
                                    placeholder={t("adresse_du_partenaire")}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">{t("telephone")}</label>
                                <Input
                                    id="phone"
                                    value={newPartner.phone}
                                    onChange={e => setNewPartner(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder={t("numero_de_telephone")}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t("email")}</label>
                                <Input
                                    id="email"
                                    value={newPartner.email}
                                    onChange={e => setNewPartner(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder={t("adresse_email")}
                                />
                            </div>
                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">{t("site_web")}</label>
                                <Input
                                    id="website"
                                    value={newPartner.website}
                                    onChange={e => setNewPartner(prev => ({ ...prev, website: e.target.value }))}
                                    placeholder={t("site_web_du_partenaire")}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t("avantages")}</label>
                                {newPartner.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <Input
                                            value={benefit}
                                            onChange={e => handleBenefitChange(index, e.target.value)}
                                            placeholder={`${t("avantage")} ${index + 1}`}
                                            className="flex-grow mr-2"
                                        />
                                        <Button variant="ghost" onClick={() => handleRemoveBenefit(index)}>
                                            <X className="w-5 h-5 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={handleAddBenefit} className="mt-2">
                                    <Plus className="w-5 h-5 mr-2" />
                                    {t("ajouter_un_avantage")}
                                </Button>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleNewPartner}>
                                {t("ajouter_le_partenaire")}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="mt-8">
                {partners.length === 0 ? (
                    <p className="text-gray-500 text-center">{t("aucun_partenaire")}</p>
                ) : (
                    partners.map((partner) => (
                        <PartnerCard key={partner.id} partner={partner} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Partnerships;
