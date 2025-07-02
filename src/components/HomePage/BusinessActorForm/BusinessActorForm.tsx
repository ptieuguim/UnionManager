"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { User, Phone, MapPin, Key, DollarSign, Globe, ChevronRight, AlertCircle } from "lucide-react";
import axios from "axios";
import apiClient from "../../../services/AxiosConfig";
import Swal from "sweetalert2";
import { getUserIdFromToken } from '../../../services/AccountService';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
};

const inputClasses =
    "focus:ring-2 focus:ring-opacity-50 block w-full pl-10 pr-3 py-2 sm:text-sm border-2 rounded-md transition duration-150 ease-in-out";

interface BusinessActorFormData {
    description: string;
    phoneNumber: string;
    residence: string;
    businessId: string;
    capital: string;
    website: string;
}

export const BusinessActorForm = () => {
    const [formData, setFormData] = useState<BusinessActorFormData>({
        description: "",
        phoneNumber: "",
        residence: "",
        businessId: "",
        capital: "",
        website: "",
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const UserId = getUserIdFromToken();
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/business_actors/create', {
                description: formData.description,
                contact: formData.phoneNumber,
                location: formData.residence,
                businessRegistration: formData.businessId,
                capital: formData.capital,
                website: formData.website,
                userId: UserId
            });
            const responseData = response?.data;
            if (response.data.value === "200") {
                await Swal.fire({
                    icon: "success",
                    title: "Succès",
                    text: responseData.text || "Profil complété avec succès !",
                });
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: response.data.text,
                });
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du formulaire:", error);
            await Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Une erreur est survenue. Veuillez réessayer.",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold mb-2">Complétez votre profil</h1>
                    <p className="text-lg opacity-90">
                        Avant de pouvoir créer un syndicat, vous devez d&#39;abord compléter votre profil.
                    </p>
                </div>
            </div>
            <motion.div
                className="container mx-auto px-4 py-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-blue-500">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description de l&#39;activité <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <textarea
                                            id="description"
                                            name="description"
                                            className={`${inputClasses} focus:ring-blue-300 border-blue-200 resize-none min-h-[80px]`}
                                            placeholder="Décrivez votre activité professionnelle"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Numéro de téléphone <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-green-500" />
                                        </div>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            className={`${inputClasses} focus:ring-green-300 border-green-200`}
                                            placeholder="0600000000"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="residence" className="block text-sm font-medium text-gray-700 mb-1">
                                        Lieu de résidence <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-pink-500" />
                                        </div>
                                        <input
                                            type="text"
                                            id="residence"
                                            name="residence"
                                            className={`${inputClasses} focus:ring-pink-300 border-pink-200`}
                                            placeholder="Ville"
                                            value={formData.residence}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="businessId" className="block text-sm font-medium text-gray-700 mb-1">
                                        Identifiant d&#39;enregistrement (RC, SIRET...) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key className="h-5 w-5 text-yellow-500" />
                                        </div>
                                        <input
                                            type="text"
                                            id="businessId"
                                            name="businessId"
                                            className={`${inputClasses} focus:ring-yellow-300 border-yellow-200`}
                                            placeholder="SIRET, RC..."
                                            value={formData.businessId}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="capital" className="block text-sm font-medium text-gray-700 mb-1">
                                        Capital
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign className="h-5 w-5 text-indigo-500" />
                                        </div>
                                        <input
                                            type="text"
                                            id="capital"
                                            name="capital"
                                            className={`${inputClasses} focus:ring-indigo-300 border-indigo-200`}
                                            placeholder="10000"
                                            value={formData.capital}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                                        Site Web
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Globe className="h-5 w-5 text-teal-500" />
                                        </div>
                                        <input
                                            type="url"
                                            id="website"
                                            name="website"
                                            className={`${inputClasses} focus:ring-teal-300 border-teal-200`}
                                            placeholder="https://www.example.com"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex items-center justify-between mt-8">
                                <div className="flex items-center text-sm text-gray-500">
                                    <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                                    <span>Les champs marqués d&#39;un * sont obligatoires</span>
                                </div>
                                <button
                                    type="submit"
                                    className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Compléter mon profil
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </button>
                            </motion.div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
