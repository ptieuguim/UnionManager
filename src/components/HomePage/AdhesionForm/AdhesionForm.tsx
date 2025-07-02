"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { AntenneSelection } from "./AntenneSelection";
import { UserTypeSelection } from "./UserTypeSelection";
import { IndividualForm } from "./IndividualMembershipForm";
import { Confirmation } from "./MembershipConfirmation";
import { antennesData } from "../../../fakeData/antenne";


interface AdhereSyndicatFormProps {
  syndicat: any; // TODO: typer précisément
  onClose?: () => void;
}

export const AdhereSyndicatForm = ({ syndicat, onClose }: AdhereSyndicatFormProps) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAntenne, setSelectedAntenne] = useState<any>(null);
  const [selectedUserType, setSelectedUserType] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [membershipId, setMembershipId] = useState<string | null>(null);

  const generateMembershipId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `SYN-${timestamp}-${random}`;
  };

  const handleAntenneSelect = (antenne: any) => {
    setSelectedAntenne(antenne);
  };

  const handleUserTypeSelect = (type: any) => {
    setSelectedUserType(type);
  };

  const handleFormSubmit = (data: any) => {
    console.log('Formulaire soumis:', data);
    const id = generateMembershipId();
    setMembershipId(id);
    setCurrentStep(4);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedAntenne !== null;
      case 2: return selectedUserType !== null;
      case 3: return true;
      default: return false;
    }
  };

  return (
    <>
      {onClose && (
        <button type="button" onClick={onClose} style={{position:'absolute',top:8,right:8,zIndex:10}}>
          Fermer
        </button>
      )}
      <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              {step < 4 && (
                <div className={`w-20 h-1 mx-2 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Étape {currentStep} sur 4
          </p>
        </div>
      </div>
      {/* Contenu des étapes */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div key="step1">
            <AntenneSelection
              antennes={antennesData}
              onSelect={handleAntenneSelect}
              selectedAntenne={selectedAntenne}
            />
          </motion.div>
        )}
        {currentStep === 2 && (
          <motion.div key="step2">
            <UserTypeSelection
              onSelect={handleUserTypeSelect}
              selectedType={selectedUserType}
            />
          </motion.div>
        )}
        {currentStep === 3 && (
          <motion.div key="step3">
            <IndividualForm
              onSubmit={handleFormSubmit}
              formData={formData}
              setFormData={setFormData}
            />
          </motion.div>
        )}
        {currentStep === 4 && (
          <motion.div key="step4">
            <Confirmation
              membershipId={membershipId || ''} 
              antenne={selectedAntenne}
              onComplete={() => {
                console.log('Processus terminé');
                // Rediriger vers la page d'accueil utilisateur
                router.push('/user/home');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navigation */}
      {currentStep < 4 && (
        <div className="flex justify-between mt-8">
          <motion.button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg flex items-center ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            whileHover={currentStep > 1 ? { scale: 1.05 } : {}}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Précédent
          </motion.button>
          {currentStep < 3 && (
            <motion.button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`px-6 py-2 rounded-lg flex items-center ${
                canProceed()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={canProceed() ? { scale: 1.05 } : {}}
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </motion.button>
          )}
        </div>
      )}
    </div>
    </>
  );
};