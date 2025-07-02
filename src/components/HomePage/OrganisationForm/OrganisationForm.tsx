"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, FileText, Tag, Briefcase, ChevronRight, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { apiClient } from '../../../services/AxiosConfig';
import { getUserId } from '../../../services/AccountService';

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

export function OrganisationForm() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "",
        domain: "",
    });

    const handleInputChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const UserId = getUserId();
    const router = useRouter();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/organisation/create', {
                name: formData.name,
                description: formData.description,
                type: formData.type,
                domain: formData.domain,
                userId: UserId
            });
            const responseData = response?.data;
            if (response.data.value === "200") {
                await Swal.fire({
                    icon: "success",
                    title: "Succès",
                    text: responseData.text || "Syndicat créé avec succès !",
                });
                // Rediriger vers la page des syndicats de l'utilisateur après création
                router.push("/user/syndicat-app");
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: response.data.text,
                });
            }
        } catch (error) {
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
                    <h1 className="text-3xl font-bold mb-2">Créer un nouveau syndicat</h1>
                    <p className="text-lg opacity-90">
                        Remplissez les informations ci-dessous pour créer votre nouveau syndicat.
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
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom du syndicat *
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Users className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className={`${inputClasses} focus:ring-blue-300 border-blue-200`}
                                            placeholder="Nom du syndicat"
                                            value={formData.name}
                                            onChange={handleInputChange("name")}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                        Type de syndicat *
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Tag className="h-5 w-5 text-green-500" />
                                        </div>
                                        <input
                                            type="text"
                                            id="type"
                                            name="type"
                                            required
                                            className={`${inputClasses} focus:ring-green-300 border-green-200`}
                                            placeholder="Ex: Professionnel, Étudiant, etc."
                                            value={formData.type}
                                            onChange={handleInputChange("type")}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                                            <FileText className="h-5 w-5 text-purple-500" />
                                        </div>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            required
                                            className={`${inputClasses} focus:ring-purple-300 border-purple-200`}
                                            placeholder="Décrivez les objectifs et les activités de votre syndicat..."
                                            value={formData.description}
                                            onChange={handleInputChange("description")}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                                        Domaine d'activité *
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Briefcase className="h-5 w-5 text-yellow-500" />
                                        </div>
                                        <input
                                            type="text"
                                            id="domain"
                                            name="domain"
                                            required
                                            className={`${inputClasses} focus:ring-yellow-300 border-yellow-200`}
                                            placeholder="Ex: Éducation, Santé, Industrie, etc."
                                            value={formData.domain}
                                            onChange={handleInputChange("domain")}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex items-center justify-between mt-8">
                                <div className="flex items-center text-sm text-gray-500">
                                    <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                                    <span>Les champs marqués d'un * sont obligatoires</span>
                                </div>
                                <button
                                    type="submit"
                                    className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Créer le syndicat
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </button>
                            </motion.div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}


