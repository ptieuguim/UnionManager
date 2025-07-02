"use client";

import { useState, useEffect, useCallback } from "react";
import { motion,  } from "framer-motion";
import { Member } from "../../SyndicalistComponents/OrganisationGestion/Members/MemberTypes";
import {
    Users,
    Calendar,
    Mail,
    Phone,
    MapPin,
    ChevronRight,
    ChevronLeft,
    ExternalLink,
    LogIn,
    Download,
    Trophy,
    Newspaper,
    FileText,
    HeartHandshake,
    ShoppingBag,
    Package,
    Building2,
    Clock,
    HashIcon,
    DollarSign,
    Briefcase,
    Tag
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// We need to dynamically import the GeolocationControl component since it uses useMap hook
const GeolocationControl = dynamic(
  () => import("../../utils/LeafletUtils").then((mod) => mod.GeolocationControl),
  { ssr: false }
);

// We'll handle the CSS directly in the component

const markerIcon = "/marker-icon.png";

import { SyndicatDefaultAvatar } from "../HomePage/localcomponent/SyndicatDefaultAvatar";
import { useTranslation } from "react-i18next";

type TimelineItem = {
  year: number;
  event: string;
};



interface LatLng {
    lat: number;
    lng: number;
}

interface BranchOffice {
    id: number;
    name: string;
    address: string;
    phone: string;
    lat: number;
    lng: number;
}

const branchOffices: BranchOffice[] = [
    {
        id: 1,
        name: "Antenne Yaoundé",
        address: "123 Rue de l&apos;Unité, Yaoundé",
        phone: "+237 99 12 34 56",
        lat: 3.848,
        lng: 11.5021,
    },
    {
        id: 2,
        name: "Antenne Douala",
        address: "456 Avenue de la Liberté, Douala",
        phone: "+237 99 87 65 43",
        lat: 4.0511,
        lng: 9.7679,
    },
    {
        id: 3,
        name: "Antenne Bafoussam",
        address: "321 Rue de la Paix, Bafoussam",
        phone: "+237 99 45 67 89",
        lat: 5.4768,
        lng: 10.4214,
    },
];

// GeolocationControl component is now imported dynamically from LeafletUtils

interface BranchOfficesMapProps {
    setSelectedOffice: (office: BranchOffice | null) => void;
}

const BranchOfficesMap: React.FC<BranchOfficesMapProps> = ({ setSelectedOffice }) => {
    const [userLocation, setUserLocation] = useState<LatLng | null>(null);

    const handleLocationUpdate = (location: LatLng) => {
        setUserLocation(location);
    };

    const getClosestOffice = useCallback(() => {
        if (!userLocation) return null;
        return branchOffices.reduce<{ distance: number } & BranchOffice | null>((closest, office) => {
            const distance = L.latLng(office.lat, office.lng).distanceTo(userLocation);
            if (!closest || distance < closest.distance) {
                return { ...office, distance };
            }
            return closest;
        }, null);
    }, [userLocation]);

    useEffect(() => {
        if (userLocation) {
            const closest = getClosestOffice();
            setSelectedOffice(closest);
        }
    }, [userLocation, getClosestOffice, setSelectedOffice]);

    const defaultCenter: [number, number] = [4.6125, 13.1535];

    return (
        <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
            <MapContainer center={defaultCenter} zoom={6} className="h-full w-full">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <GeolocationControl onLocationUpdate={handleLocationUpdate} />
                {userLocation && (
                    <Marker position={userLocation}>
                        <Popup>Vous êtes ici</Popup>
                    </Marker>
                )}
                {branchOffices.map((office) => (
                    <Marker key={office.id} position={[office.lat, office.lng]}>
                        <Popup>
                            <div>
                                <strong>{office.name}</strong>
                                <br />{office.address}
                                <br />{office.phone}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

// ...
// (Préserver et typer les autres constantes, données fictives et utilitaires comme dans le code d'origine)
// ...

// Mapping for organization type display names
const organizationTypes: { [key: string]: string } = {
    "SOLE_PROPRIETORSHIP": "Entreprise individuelle",
    "LIMITED_LIABILITY_COMPANY": "SARL",
    "CORPORATION": "Société anonyme",
    "COOPERATIVE": "Coopérative",
    "ASSOCIATION": "Association"
};


interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image?: string;
}

interface Syndicat {
    id?: string | number;
    name?: string;
    long_name?: string;
    short_name?: string;
    description?: string;
    location?: string;
    type?: string;
    members?: Member[];
    events?: Array<{
        id: string | number;
        title: string;
        date: string;
        image?: string;
        description?: string;
        [key: string]: unknown;
    }>;
    publications?: Array<{
        id: string | number;
        title: string;
        content?: string;
        date?: string;
        author?: string;
        image?: string;
        [key: string]: unknown;
    }>;
    services?: Service[];
    products?: Product[];
    status?: string;
    business_registration_number?: string;
    tax_number?: string;
    capital_share?: number;
    ceo_name?: string;
    registration_date?: string;
    year_founded?: string;
    logo_url?: string;
    keywords?: string[];
    // For any other properties that may exist
    [key: string]: unknown;
}

interface Service {
    id: number;
    name: string;
    description: string;
    image?: string;
    // Ajoutez d'autres champs si nécessaire
}

const ProfilPage: React.FC<{ syndicat: Syndicat }> = ({ syndicat }) => {
    useEffect(() => {
      // Only run this on the client side
      if (typeof window === "undefined") return;
      
      // Dynamically import Leaflet
      import('leaflet').then(L => {
        // @ts-expect-error - Known issue with Leaflet typings
        if (L.Icon.Default.prototype._getIconUrl) {
          // @ts-expect-error - Known issue with Leaflet typings
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: "/marker-icon-2x.png",
            iconUrl: markerIcon,
            shadowUrl: "/marker-shadow.png",
          });
        }
      });

      // Import Leaflet CSS on client side
      import("leaflet/dist/leaflet.css");
    }, []);
    const [, setSelectedOffice] = useState<BranchOffice | null>(null);
    const router = useRouter();
    const members: Member[] = syndicat.members || [];
    const services = Array.isArray(syndicat.services) ? syndicat.services : [];
    const products = Array.isArray(syndicat.products) ? syndicat.products : [];
    const activities = Array.isArray(syndicat.events) ? syndicat.events : [];
    const [currentPage, setCurrentPage] = useState(1);
    const membersPerPage = 4;
    const totalPages = Math.ceil(members.length / membersPerPage);
    const { t } = useTranslation();
    const paginatedMembers = members.slice((currentPage - 1) * membersPerPage, currentPage * membersPerPage);

    // Statistiques principales à afficher
    const stats = [
        {
            name: t('Membres'),
            value: members.length,
        },
        {
            name: t('Événements'),
            value: Array.isArray(syndicat.events) ? syndicat.events.length : 0,
        },
        {
            name: t('Publications'),
            value: Array.isArray(syndicat.publications) ? syndicat.publications.length : 0,
        },
    ];


    // Utilitaires
    const formatDate = (isoDate?: string) => {
        if (!isoDate) return "N/A";
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return isoDate;
        return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    };
    const getYearFromDate = (isoDate?: string) => {
        if (!isoDate) return "N/A";
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return isoDate;
        return date.getFullYear();
    };
    const generateTimeline = (): TimelineItem[] => {
        const timeline: TimelineItem[] = [];
        if (syndicat.year_founded) {
            timeline.push({ year: Number(getYearFromDate(syndicat.year_founded)), event: "Fondation du syndicat" });
        }
        if (syndicat.registration_date && syndicat.registration_date !== syndicat.year_founded) {
            timeline.push({ year: Number(getYearFromDate(syndicat.registration_date)), event: "Enregistrement officiel" });
        }
        if (timeline.length < 4) {
            const baseYear = timeline.length > 0 ? parseInt(String(timeline[0].year)) : 2000;
            const placeholders = [
                { offset: 10, event: "Première convention collective" },
                { offset: 15, event: "Ouverture de la première antenne régionale" },
                { offset: 20, event: "Adoption de la charte éthique" },
            ];
            placeholders.forEach((item) => {
                if (timeline.length < 4) {
                    timeline.push({ year: baseYear + item.offset, event: item.event });
                }
            });
        }
        return timeline.sort((a, b) => a.year - b.year);
    };
    const timeline = generateTimeline();
    const defaultCoverImages: Record<string, string> = {
    "SOLE_PROPRIETORSHIP": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    "LIMITED_LIABILITY_COMPANY": "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    "CORPORATION": "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    "COOPERATIVE": "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    "ASSOCIATION": "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
};
const getCoverImage = () => {
        if (syndicat.logo_url) return syndicat.logo_url;
        return defaultCoverImages[syndicat.type ?? ""] || "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80";
    };
    const getDisplayType = (type?: string) => organizationTypes[type ?? ""] || type;
    // Navigation
    const navigate = (url: string) => router.push(url);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            {/* En-tête */}
            <div className="relative h-96 w-full overflow-hidden">
                <motion.div className="w-full h-full" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                    <img src={getCoverImage()} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end pb-12">
                    <div className="container mx-auto px-4 relative">
                        <motion.div className="flex items-center space-x-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                                {syndicat.logo_url ? (
                                    <Image src={syndicat.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <SyndicatDefaultAvatar name={syndicat.long_name || syndicat.short_name} size={128} className="w-full h-full" />
                                )}
                            </div>
                            <div className="text-white">
                                <h1 className="text-4xl font-bold mb-2">{syndicat.long_name}</h1>
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="px-4 py-1 bg-blue-600/80 rounded-full text-sm">{getDisplayType(syndicat.type)}</span>
                                    {syndicat.status === "ACTIVE" && (
                                        <span className="flex items-center"><Trophy className="h-5 w-5 mr-2" />Organisation active</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
                <motion.button
                    className="absolute top-6 right-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/register")}
                >
                    <LogIn className="h-6 w-6 transition-transform group-hover:rotate-12" />
                    <span className="font-semibold">{t("rejoindre")}</span>
                </motion.button>
            </div>
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-12 lg:grid-cols-3">
                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* À propos */}
                        <motion.section className="bg-white rounded-2xl shadow-xl p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center"><HeartHandshake className="h-8 w-8 mr-3 text-blue-600" />{t("notre_mission")}</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">{syndicat.description || "Aucune description disponible pour cette organisation."}</p>
                            {syndicat.keywords && syndicat.keywords.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><Tag className="h-5 w-5 mr-2 text-blue-600" />Mots-clés</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {syndicat.keywords.map((keyword: string, index: number) => (
                                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{keyword}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.section>
                        {/* Informations organisationnelles */}
                        <motion.section className="bg-white rounded-2xl shadow-xl p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center"><Building2 className="h-8 w-8 mr-3 text-blue-600" />Informations de l'organisation</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {syndicat.business_registration_number && (
                                    <div className="flex items-start"><HashIcon className="h-5 w-5 mr-3 text-blue-500 mt-1" /><div><h3 className="font-medium text-gray-900">Numéro d'immatriculation</h3><p className="text-gray-600">{syndicat.business_registration_number}</p></div></div>
                                )}
                                {syndicat.tax_number && (
                                    <div className="flex items-start"><FileText className="h-5 w-5 mr-3 text-blue-500 mt-1" /><div><h3 className="font-medium text-gray-900">Numéro fiscal</h3><p className="text-gray-600">{syndicat.tax_number}</p></div></div>
                                )}
                                {syndicat.capital_share !== null && syndicat.capital_share !== undefined && (
                                    <div className="flex items-start"><DollarSign className="h-5 w-5 mr-3 text-blue-500 mt-1" /><div><h3 className="font-medium text-gray-900">Capital social</h3><p className="text-gray-600">{syndicat.capital_share.toLocaleString()} €</p></div></div>
                                )}
                                {syndicat.ceo_name && (
                                    <div className="flex items-start"><Briefcase className="h-5 w-5 mr-3 text-blue-500 mt-1" /><div><h3 className="font-medium text-gray-900">Dirigeant</h3><p className="text-gray-600">{syndicat.ceo_name}</p></div></div>
                                )}
                                {syndicat.registration_date && (
                                    <div className="flex items-start"><Calendar className="h-5 w-5 mr-3 text-blue-500 mt-1" /><div><h3 className="font-medium text-gray-900">Date d'immatriculation</h3><p className="text-gray-600">{formatDate(syndicat.registration_date)}</p></div></div>
                                )}
                                {syndicat.year_founded && (
                                    <div className="flex items-start"><Clock className="h-5 w-5 mr-3 text-blue-500 mt-1" /><div><h3 className="font-medium text-gray-900">Année de fondation</h3><p className="text-gray-600">{getYearFromDate(syndicat.year_founded)}</p></div></div>
                                )}
                            </div>
                        </motion.section>
                        {/* Statistiques */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {stats.map((stat) => (
                                <motion.div key={stat.name} className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-600" whileHover={{ y: -5 }}>
                                    <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                                    <div className="text-sm font-medium text-gray-500">{stat.name}</div>
                                </motion.div>
                            ))}
                        </section>
                        {/* Timeline */}
                        <section className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-3xl font-bold text-blue-800 mb-8 flex items-center"><FileText className="h-8 w-8 mr-3 text-blue-600" />{t("notre_histoire")}</h2>
                            <div className="relative pl-8 border-l-2 border-blue-100 space-y-8">
                                {timeline.map((item, index) => (
                                    <div key={index} className="relative">
                                        <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-[25px] top-2 border-4 border-white shadow"></div>
                                        <div className="pl-6">
                                            <div className="text-xl font-semibold text-blue-900">{item.year}</div>
                                            <p className="mt-1 text-gray-600">{item.event}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        {/* Carte interactive */}
                        <section className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-8 pb-0">
                                <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center"><MapPin className="h-8 w-8 mr-3 text-blue-600" />{t("nos_implantations")}</h2>
                            </div>
                            <BranchOfficesMap setSelectedOffice={setSelectedOffice} />
                        </section>
                        {/* Agenda syndical */}
                        <section className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-3xl font-bold text-blue-800 mb-8 flex items-center"><Calendar className="h-8 w-8 mr-3 text-blue-600" />{t("agenda_syndical")}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {activities.map((activity) => (
                                    <motion.div key={activity.id} className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow" whileHover={{ scale: 1.02 }}>
                                        <Image src={activity.image || "/placeholder.svg"} alt={activity.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-6">
                                            <h3 className="text-lg font-semibold text-white">{activity.title}</h3>
                                            <div className="flex items-center mt-2 text-blue-100"><Calendar className="h-4 w-4 mr-2" />{activity.date}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                        {/* Services */}
                        <section className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-3xl font-bold text-blue-800 mb-8 flex items-center"><Package className="h-8 w-8 mr-3 text-blue-600" />{t("nos_services")}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {services.map((service) => (
                                    <motion.div key={service.id} className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow" whileHover={{ scale: 1.02 }}>
                                        <Image src={service.image || "/placeholder.svg"} alt={service.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-6">
                                            <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
                                            <p className="text-sm text-blue-100 line-clamp-2">{service.description}</p>
                                            <motion.button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Phone className="h-4 w-4 mr-2" />{t("contacter_un_conseiller")}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                        {/* Boutique */}
                        <section className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-3xl font-bold text-blue-800 mb-8 flex items-center"><ShoppingBag className="h-8 w-8 mr-3 text-blue-600" />{t("boutique_du_syndicat")}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <motion.div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden" whileHover={{ y: -5 }}>
                                        <Image src={product.image || "/placeholder.svg"} alt={product.name} className="rounded-lg w-full h-32 object-cover" width={400} height={128} />
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-blue-600">{product.price.toFixed(2)} €</span>
                                                <motion.button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    {t("commander")}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>
                    {/* Colonne latérale */}
                    <div className="space-y-12">
                        {/* Contact */}
                        <section className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center"><Mail className="h-8 w-8 mr-3 text-blue-600" />{t("nous_contacter")}</h2>
                            <div className="space-y-5">
                                {syndicat.email && (
                                    <motion.a href={`mailto:${syndicat.email}`} className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors" whileHover={{ x: 5 }}>
                                        <Mail className="h-6 w-6 text-blue-600 mr-4" />
                                        <span className="text-gray-700">{syndicat.email}</span>
                                    </motion.a>
                                )}
                                {syndicat.website_url && (
                                    <motion.a href={syndicat.website_url.startsWith('http') ? syndicat.website_url : `https://${syndicat.website_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors" whileHover={{ x: 5 }}>
                                        <ExternalLink className="h-6 w-6 text-blue-600 mr-4" />
                                        <span className="text-gray-700">{syndicat.website_url}</span>
                                    </motion.a>
                                )}
                                {syndicat.social_network && (
                                    <motion.div className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors" whileHover={{ x: 5 }}>
                                        <Users className="h-6 w-6 text-blue-600 mr-4" />
                                        <span className="text-gray-700">{syndicat.social_network}</span>
                                    </motion.div>
                                )}
                            </div>
                        </section>
                        {/* Membres clés */}
                        <section className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center"><Users className="h-8 w-8 mr-3 text-blue-600" />{t("equipe_directrice")}</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {paginatedMembers.map((member: Member) => (
                                    <motion.div key={member.id} className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors" whileHover={{ scale: 1.02 }}>
                                        <Image src={member.avatar || "/placeholder.svg"} alt={member.name} className="w-14 h-14 rounded-xl object-cover" width={56} height={56} />
                                        <div className="ml-4">
                                            <div className="font-semibold text-gray-900">{member.name}</div>
                                            <div className="text-sm text-blue-600">{member.role}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-6 flex justify-center items-center space-x-4">
                                    <motion.button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} whileTap={{ scale: 0.95 }}>
                                        <ChevronLeft className="h-6 w-6 text-gray-600" />
                                    </motion.button>
                                    <span className="text-sm font-medium text-gray-600">Page {currentPage} / {totalPages}</span>
                                    <motion.button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} whileTap={{ scale: 0.95 }}>
                                        <ChevronRight className="h-6 w-6 text-gray-600" />
                                    </motion.button>
                                </div>
                            )}
                        </section>
                        {/* Actualités */}
                        <section className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center"><Newspaper className="h-8 w-8 mr-3 text-blue-600" />{t("dernieres_actualites")}</h2>
                            <div className="space-y-6">
                                <article className="group relative overflow-hidden rounded-xl">
                                    <Image src="https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Nouvelle convention" className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" width={1350} height={160} />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2">Signature d&apos;une nouvelle convention collective</h3>
                                        <p className="text-sm text-gray-500 line-clamp-3">Une avancée historique pour les droits des travailleurs...</p>
                                    </div>
                                </article>
                            </div>
                        </section>
                        {/* Documents officiels */}
                        <section className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center"><FileText className="h-8 w-8 mr-3 text-blue-600" />{t("documents_officiels")}</h2>
                            <div className="space-y-4">
                                {["Statuts du syndicat", "Règlement intérieur", "Rapport annuel"].map((doc, index) => (
                                    <motion.a key={index} href="#" className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors" whileHover={{ x: 5 }}>
                                        <div className="flex items-center"><FileText className="h-5 w-5 text-blue-600 mr-3" /><span className="text-gray-700">{doc}</span></div>
                                        <Download className="h-5 w-5 text-gray-400" />
                                    </motion.a>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilPage;

