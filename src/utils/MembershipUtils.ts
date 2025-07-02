// utils/MembershipUtils.ts - Utilitaires pour l'adhésion (Next.js/TypeScript)
export const generateMembershipId = (): string => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `SYN-${timestamp}-${random}`;
};

export interface MembershipFormData {
    nom: string;
    prenom: string;
    numeroCNI: string;
    dateNaissance: string;
    telephone: string;
    email: string;
    adresse: string;
    profession: string;
    motivation: string;
}
export interface MembershipDocuments {
    photoIdentite?: File | null;
    pieceIdentiteFace?: File | null;
    pieceIdentiteDos?: File | null;
}
export interface MembershipValidationResult {
    isValid: boolean;
    missingFields: string[];
    missingDocuments: string[];
}

export const validateMembershipForm = (
  formData: MembershipFormData,
  documents: MembershipDocuments
): MembershipValidationResult => {
    const requiredFields: (keyof MembershipFormData)[] = [
        'nom', 'prenom', 'numeroCNI', 'dateNaissance',
        'telephone', 'email', 'adresse', 'profession', 'motivation'
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);
    const missingDocuments: string[] = [];
    if (!documents.photoIdentite) missingDocuments.push("Photo d'identité");
    if (!documents.pieceIdentiteFace) missingDocuments.push("Pièce d'identité face");
    if (!documents.pieceIdentiteDos) missingDocuments.push("Pièce d'identité dos");
    return {
        isValid: missingFields.length === 0 && missingDocuments.length === 0,
        missingFields,
        missingDocuments
    };
};
