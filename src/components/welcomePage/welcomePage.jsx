import  {useState} from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
    Building, ArrowRight, Users, BarChart, MessageCircle, 
    Shield, ChevronRight, Star, Zap, Award, Heart, Calendar,
    CheckCircle, Clock, Gift, Sparkles, Globe, Bookmark,MapPin
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const Button = ({ children, primary = false, className = '', onClick }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
            primary
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl hover:from-blue-600 hover:to-indigo-700'
                : 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-xl'
        } ${className}`}
        onClick={onClick}
    >
        {children}
    </motion.button>
);

const Section = ({ children, className = '', gradient = false }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className={`py-24 ${gradient ? 'bg-gradient-to-br from-blue-50 via-white to-indigo-50' : ''} ${className}`}
        >
            {children}
        </motion.section>
    );
};

const Feature = ({ icon: Icon, title, description }) => (
    <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
    >
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-2xl mb-6">
            <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
);

const Testimonial = ({ quote, author, role, image }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
    >
        <div className="flex items-center mb-6">
            <img 
                src={image} 
                alt={author} 
                className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
            />
            <div className="ml-4">
                <div className="font-bold text-lg text-gray-800">{author}</div>
                <div className="text-blue-600">{role}</div>
            </div>
        </div>
        <p className="text-gray-600 leading-relaxed italic">"{quote}"</p>
        <div className="mt-6 flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
            ))}
        </div>
    </motion.div>
);

const StatCard = ({ icon: Icon, value, label }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white p-6 rounded-2xl shadow-lg text-center"
    >
        <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-blue-600" />
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-2">{value}</div>
        <div className="text-gray-600">{label}</div>
    </motion.div>
);

const FloatingElement = ({ children, delay = 0 }) => (
    <motion.div
        animate={{ 
            y: [0, -10, 0],
            rotate: [-1, 1, -1]
        }}
        transition={{ 
            duration: 4,
            repeat: Infinity,
            delay 
        }}
    >
        {children}
    </motion.div>
);

export const WelcomePage = () => {
    const router = useRouter();
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    // État pour les événements



    // Données fictives pour les événements
    const [events] = useState([
        {
            id: 1,
            title: "Assemblée Générale Annuelle",
            description: "Rejoignez-nous pour discuter des réalisations de l'année écoulée et planifier l'avenir.",
            location: "Salle de conférence principale, 123 Rue du Syndicat",
            startDate: new Date("2023-06-15T09:00:00"),
            author: {
                name: "Marie Dupont",
                profileImage: "https://i.pravatar.cc/150?img=1"
            }
        },
        {
            id: 2,
            title: "Formation sur les Droits du Travail",
            description: "Session de formation sur les dernières mises à jour des lois du travail.",
            location: "Salle de formation B, 45 Avenue des Travailleurs",
            startDate: new Date("2023-07-10T14:00:00"),
            author: {
                name: "Pierre Martin",
                profileImage: "https://i.pravatar.cc/150?img=2"
            }
        }
    ]);

    // Données fictives pour les publications
    const [posts] = useState([
        {
            id: 1,
            author: {
                name: "Jean Dupont",
                avatar: "https://i.pravatar.cc/150?img=4"
            },
            content: "Aujourd'hui, nous avons eu une réunion productive sur les nouvelles mesures de sécurité. Qu'en pensez-vous ?",
            image: "https://picsum.photos/800/400",
            timestamp: "Il y a 2 heures",
            likes: 15,
            comments: [
                {
                    author: {
                        name: "Marie Martin",
                        avatar: "https://i.pravatar.cc/150?img=5"
                    },
                    content: "Excellente initiative ! J'ai hâte de voir les résultats."
                }
            ]
        },
        {
            id: 2,
            author: {
                name: "Sophie Lefebvre",
                avatar: "https://i.pravatar.cc/150?img=6"
            },
            content: "Rappel : la formation sur les nouveaux outils de communication aura lieu demain à 14h.",
            image: "https://picsum.photos/800/401",
            timestamp: "Il y a 5 heures",
            likes: 8,
            comments: []
        }
    ]);

    return (
        <div className="bg-gray-50 overflow-hidden">
            {/* Hero Section */}
            <Section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white">
                <motion.div 
                    className="absolute inset-0 opacity-20"
                    animate={{ 
                        backgroundPosition: ['0% 0%', '100% 100%'],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                    }}
                />
                <div className="container mx-auto px-6 relative">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 text-center lg:text-left"
                        >
                            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                                Gérez votre syndicat avec
                                <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                    SyndicManager
                                </span>
                            </h1>
                            <p className="text-xl lg:text-2xl mb-8 text-blue-100">
                                La solution complète et gratuite pour la gestion moderne des syndicats
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Button 
                                    primary 
                                    className="text-lg px-8 py-4"
                                    onClick={() => router.push('/register')}
                                >
                                    Commencer gratuitement
                                    <ArrowRight className="inline-block ml-2" />
                                </Button>
                                <Button className="text-lg px-8 py-4">
                                    Découvrir
                                    <ChevronRight className="inline-block ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 relative"
                        >
                            <div className="relative">
                                <FloatingElement>
                                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                                        <Building className="w-full h-auto text-white" />
                                    </div>
                                </FloatingElement>
                                <FloatingElement delay={1}>
                                    <div className="absolute -top-10 -right-10 bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-lg">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                </FloatingElement>
                                <FloatingElement delay={2}>
                                    <div className="absolute -bottom-10 -left-10 bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-2xl shadow-lg">
                                        <CheckCircle className="w-8 h-8 text-white" />
                                    </div>
                                </FloatingElement>
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
                        <StatCard icon={Users} value="10,000+" label="Utilisateurs actifs" />
                        <StatCard icon={Globe} value="50+" label="Pays" />
                        <StatCard icon={Clock} value="24/7" label="Support client" />
                        <StatCard icon={Heart} value="98%" label="Satisfaction" />
                    </div>
                </div>
            </Section>

            {/* Features Section */}
            <Section gradient>
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Fonctionnalités principales
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Découvrez les outils puissants qui font de SyndicManager la solution idéale pour votre syndicat
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Feature
                            icon={Users}
                            title="Gestion des membres"
                            description="Gérez facilement les adhésions, les cotisations et les informations des membres avec des outils intuitifs."
                        />
                        <Feature
                            icon={BarChart}
                            title="Rapports et analyses"
                            description="Obtenez des insights précieux grâce à des tableaux de bord interactifs et des rapports détaillés."
                        />
                        <Feature
                            icon={MessageCircle}
                            title="Communication intégrée"
                            description="Facilitez les échanges entre membres avec des outils de messagerie et de forum modernes."
                        />
                        <Feature
                            icon={Shield}
                            title="Sécurité avancée"
                            description="Protégez vos données avec un cryptage de niveau bancaire et des sauvegardes automatiques."
                        />
                        <Feature
                            icon={Gift}
                            title="Ressources gratuites"
                            description="Accédez à une bibliothèque de ressources et de modèles pour optimiser votre gestion."
                        />
                        <Feature
                            icon={Zap}
                            title="Automatisation"
                            description="Simplifiez vos tâches quotidiennes grâce à des workflows automatisés intelligents."
                        />
                    </div>
                </div>
            </Section>

            {/* Testimonials Section */}
            <Section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">Ce que disent nos utilisateurs</h2>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Découvrez pourquoi des milliers de syndicats nous font confiance
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Testimonial
                            quote="SyndicManager a révolutionné notre façon de gérer le syndicat. L'interface est intuitive et les fonctionnalités sont exactement ce dont nous avions besoin."
                            author="Marie Dupont"
                            role="Présidente du Syndicat des Enseignants"
                            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                        />
                        <Testimonial
                            quote="La facilité d'utilisation et les fonctionnalités complètes ont grandement amélioré notre efficacité. Le support client est également exceptionnel."
                            author="Jean Martin"
                            role="Secrétaire Général"
                            image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
                        />
                        <Testimonial
                            quote="Grâce à SyndicManager, nous avons pu moderniser nos processus et mieux servir nos membres. Un outil indispensable !"
                            author="Sophie Lefebvre"
                            role="Trésorière"
                            image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
                        />
                    </div>
                </div>

                <Section className="bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Actualités syndicales
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Découvrez les dernières initiatives et débats des syndicats engagés
                        </p>
                    </motion.div>

                    {/* Section Événements */}
                    <div className="mb-24">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                                <Calendar className="w-6 h-6 mr-2 text-blue-500" />
                                Événements à venir
                            </h3>
                            <Button
                                onClick={() => router.push('/events')}
                                className="flex items-center"
                            >
                                Voir tout
                                <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>

                        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {events.slice(0, 2).map((event) => (
                                <motion.div
                                    key={event.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all"
                                >
                                    <div className="flex items-start mb-4">
                                        <img
                                            src={event.author.profileImage}
                                            alt={event.author.name}
                                            className="w-12 h-12 rounded-full object-cover mr-4"
                                        />
                                        <div>
                                            <h4 className="font-bold text-lg">{event.title}</h4>
                                            <p className="text-sm text-gray-500">
                                                {event.startDate.toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {event.description}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        <span>{event.location}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Section Publications */}
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                                <MessageCircle className="w-6 h-6 mr-2 text-blue-500" />
                                Dernières publications
                            </h3>
                            <Button
                                onClick={() => router.push('/publications')}
                                className="flex items-center"
                            >
                                Voir tout
                                <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>

                        <motion.div className="space-y-6">
                            {posts.slice(0, 2).map((post) => (
                                <motion.div
                                    key={post.id}
                                    whileHover={{ x: 5 }}
                                    className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all"
                                >
                                    <div className="flex items-start mb-4">
                                        <img
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                            className="w-12 h-12 rounded-full object-cover mr-4"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-lg">{post.author.name}</h4>
                                                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                                                </div>
                                                <Bookmark className="text-gray-400 hover:text-blue-500 cursor-pointer" />
                                            </div>
                                            <p className="text-gray-600 mt-2 line-clamp-3">
                                                {post.content}
                                            </p>
                                            {post.image && (
                                                <img
                                                    src={post.image}
                                                    alt={post.author.name}
                                                    className="mt-4 rounded-lg w-full h-48 object-cover"
                                                />
                                            )}
                                            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Heart className="w-4 h-4 mr-1" />
                                                    {post.likes} J'aime
                                                </div>
                                                <div className="flex items-center">
                                                    <MessageCircle className="w-4 h-4 mr-1" />
                                                    {post.comments.length} commentaires
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
                </Section>
            </Section>


            {/* CTA Section */}
            <Section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            Prêt à transformer la gestion de votre syndicat ?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Rejoignez des milliers de syndicats qui font confiance à SyndicManager
                        </p>
                        <Button 
                            primary 
                            className="text-xl px-12 py-6"
                            onClick={() => router.push('/register')}
                        >
                            Commencer gratuitement
                            <ArrowRight className="inline-block ml-2" />
                        </Button>
                    </motion.div>
                </div>
            </Section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div>
                            <div className="flex items-center mb-6">
                                <Building className="w-8 h-8 text-blue-400 mr-2" />
                                <span className="text-2xl font-bold">SyndicManager</span>
                            </div>
                            <p className="text-gray-400 mb-6">
                                La solution moderne pour la gestion des syndicats
                            </p>
                            <div className="flex space-x-4">
                                {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                                    <motion.a
                                        key={social}
                                        href={`#${social}`}
                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <img
                                            src={`https://simpleicons.org/${social}/ffffff`}
                                            alt={social}
                                            className="w-5 h-5"
                                        />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Produit</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Fonctionnalités</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Tarification</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">FAQ</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Sécurité</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Ressources</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Documentation</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Guides</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Nous contacter</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">{t("partenariats")}</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Carrières</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Presse</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                        <p className="text-gray-400">
                            &copy; 2024 SyndicManager. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};