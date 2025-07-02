"use client";
import React, { useState, useEffect, useCallback, forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Building, Mail, Lock,  } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import { saveToken, saveUserData } from '../../../services/AccountService';

// Déclaration globale pour AppleID

declare global {
    interface Window {
    AppleID?: any;
    }
}

// Types pour le formulaire
interface LoginFormInputs {
  email: string;
  password: string;
}

const Input = forwardRef<HTMLInputElement, any>(({ icon: Icon, ...props }, ref) => (
  <div className="relative mb-4">
    <input
      {...props}
      ref={ref}
      className="w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 pl-12"
    />
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
  </div>
));
Input.displayName = 'Input';

// Typage correct pour Button avec framer-motion
type ButtonProps = HTMLMotionProps<"button"> & {
  children: React.ReactNode;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => (
  <motion.button
    ref={ref}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="w-full px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    {...props}
  >
    {children}
  </motion.button>
));
Button.displayName = "Button";

const AnimatedText = ({ texts }: { texts: string[] }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [texts]);
  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-light text-white text-center"
      >
        {texts[index]}
      </motion.p>
    </AnimatePresence>
  );
};

const CLIENT_ID = '137734019377-nnq12325retn9n23nfnis326j008u2pm.apps.googleusercontent.com';


const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormInputs>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Google login
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const tokens = await axios.post('https://oauth2.googleapis.com/token', {
          code: tokenResponse.code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: window.location.origin,
          grant_type: 'authorization_code',
        });
        const backendResponse = await axios.post('http://localhost:9005/api/google-login', {
          tokenId: tokens.data.id_token
        });
        if (backendResponse.data.token) {
          toast.success('Connexion réussie ! Redirection...');
          setTimeout(() => router.push('/dashboard'), 2000);
        }
      } catch (error) {
        toast.error('Erreur lors de la connexion Google. Veuillez réessayer.');
      }
    },
    flow: 'auth-code',
  });

  // Apple Sign In (optionnel, à adapter si utilisé)
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.onload = () => setIsSDKLoaded(true);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => { if (isSDKLoaded) initializeAppleSignIn(); }, [isSDKLoaded]);

  const initializeAppleSignIn = () => {
    if (window.AppleID && window.AppleID.auth) {
      try {
        window.AppleID.auth.init({
          clientId: 'com.bandesoft.dev-gloswitch',
          scope: 'name email',
          redirectURI: 'https://front-syndic-manager-2fmn.vercel.app/login',
          state: 'origin:web',
          usePopup: true
        });
        setIsInitialized(true);
      } catch (error) { /* ... */ }
    }
  };

  // Gestion des erreurs axios
  const handleAxiosError = useCallback((error: any) => {
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      Object.keys(errors).forEach(field => {
        setError(field as keyof LoginFormInputs, {
          type: 'backend',
          message: errors[field][0]
        });
      });
    }
    return Promise.reject(error);
  }, [setError]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      handleAxiosError
    );
    return () => { axios.interceptors.response.eject(interceptor); };
  }, [handleAxiosError]);

  // Soumission du formulaire
  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    try {
      const basicAuth = 'Basic ' + btoa('test-client:secret');
      const response = await axios.post(
        '/api/login',
        {
          username: data.email,
          password: data.password
        },
        {
          headers: {
            'Authorization': basicAuth,
            'Content-Type': 'application/json'
          }
        }
      );
      // Afficher la structure complète de la réponse pour débogage
      console.log("Réponse API complète:", JSON.stringify(response.data, null, 2));
      
      // Récupérer le token selon la structure décrite
      const apiToken = response.data.access_token?.token || response.data.token || response.data.access_token || response.data.jwt;
      
      if (apiToken && apiToken !== 'undefined') {
        // Utiliser saveToken d'AccountService au lieu de localStorage
        saveToken(apiToken);
        
        // Déterminer le rôle de l'utilisateur
        // Si roles est un tableau, prendre le premier rôle, sinon utiliser 'syndiqué' comme rôle par défaut
        const userRole = Array.isArray(response.data.roles) && response.data.roles.length > 0 
          ? response.data.roles[0] 
          : (response.data.user?.role || 'syndiqué');
        
        console.log("RÔLE DÉTERMINÉ:", userRole);
        
        // Préparer et sauvegarder les données utilisateur dans le format attendu
        const userData = {
          id: response.data.user?.id || response.data.id || '',
          firstName: response.data.user?.first_name || response.data.firstName || '',
          lastName: response.data.user?.last_name || response.data.lastName || '',
          email: response.data.user?.email || response.data.email || '',
          role: userRole
        };
        
        console.log("Données utilisateur à sauvegarder:", userData);
        saveUserData(userData);
      } else {
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Le serveur n\'a pas renvoyé de token valide.' });
        return;
      }
      const prenom = response.data.user.first_name || "";
      const nom = response.data.user.last_name || "";
      const displayName = (prenom + " " + nom).trim() || response.data.user.name || response.data.user.username || response.data.user.email || "Utilisateur";
      // NOUVELLE FAÇON (plus fiable)
    // On n'utilise pas await ici, mais on enchaîne avec .then()
    Swal.fire({
      icon: 'success',
      title: t("connexion_reussie"),
      text: `Bienvenue, ${displayName}!`,
      confirmButtonText: 'Ok',
      allowOutsideClick: false,
    }).then((result) => {
      // Cette vérification est une bonne pratique. Elle s'assure que l'utilisateur a bien cliqué sur "Ok".
      if (result.isConfirmed) {
        console.log('Alerte fermée, redirection vers /user/home...');
        
        // La redirection est maintenant déclenchée dans le callback de l'alerte.
        // Cela donne au navigateur le temps de traiter la mise à jour des cookies.
        router.push('/user/home');
      }
    });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue. Veuillez réessayer.';
      Swal.fire({
        icon: 'error',
        title: 'Erreur de connexion',
        text: errorMessage,
        confirmButtonText: 'Ok',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const animatedTexts = [
    t("bienvenue_sur_syndic_manager"),
    t("gerez_votre_syndicat_efficacement"),
    t("simplifiez_vos_processus_administratifs"),
    t("restez_connecte_avec_vos_membres"),
    t("prenez_des_decisions_eclairees")
  ];

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-4 right-4 z-50">
          <select
            className="px-2 py-1 rounded border border-gray-300"
            value={i18n.language}
            onChange={e => i18n.changeLanguage(e.target.value)}
            aria-label="Changer la langue"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        <div className="absolute inset-0 bg-blue-700 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="0.5"/>
            <path d="M0,50 Q50,0 100,50 Q50,100 0,50 Z" fill="none" stroke="white" strokeWidth="0.5"/>
          </svg>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-white text-center relative z-10"
        >
          <div className="flex justify-center mb-8">
            <Building size={80} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-8">SyndicManager</h1>
          <AnimatedText texts={animatedTexts} />
        </motion.div>
      </div>
      <div className="w-1/2 p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {t("connexion_a_syndic_manager")}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              icon={Mail}
              type="email"
              placeholder="Adresse e-mail"
              {...register("email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresse e-mail invalide"
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            <Input
              icon={Lock}
              type="password"
              placeholder="Mot de passe"
              {...register("password", {
                required: "Le mot de passe est requis"
              })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  {t("se_souvenir_de_moi")}
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  {t("mot_de_passe_oublie")} ?
                </a>
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Connexion en cours...' : t("se_connecter")}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">{t("ou_connectez_vous_avec")}</p>
            <Button
              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              onClick={() => login()}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2 inline-block" />
              {t("se_connecter_avec_google")}
            </Button>
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {t("pas_encore_de_compte")}?{' '}
              <Link href="/register" className="text-blue-500 hover:underline">
                {t("inscrivez_vous_ici")}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
