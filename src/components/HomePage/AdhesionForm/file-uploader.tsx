"use client";

import React, { useState, useRef, ChangeEvent, FC, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, AlertCircle, X, FileImage, Eye } from "lucide-react";

interface FileUploaderProps {
  label: string;
  icon?: ReactNode;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  bgColor?: string;
  borderColor?: string;
  maxSize?: number;
  required?: boolean;
  preview?: boolean;
}

export const FileUploader: FC<FileUploaderProps> = ({
  label,
  icon,
  accept = "image/*",
  onFileSelect,
  bgColor = "bg-gray-50",
  borderColor = "border-gray-200",
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  required = false,
  preview = true,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Validation du fichier
  const validateFile = (selectedFile: File | null) => {
    if (!selectedFile) return { isValid: false, error: "Aucun fichier sélectionné" };
    if (selectedFile.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return { isValid: false, error: `Le fichier dépasse la taille maximale autorisée (${maxSizeMB} MB)` };
    }
    return { isValid: true, error: null };
  };

  // Gestion de la sélection du fichier
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    const { isValid, error } = validateFile(selectedFile);
    if (!isValid) {
      setError(error);
      setFile(null);
      setPreviewUrl(null);
      onFileSelect(null);
      return;
    }
    setError(null);
    setFile(selectedFile);
    setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : null);
    onFileSelect(selectedFile);
  };

  // Gestion du drag & drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files && e.dataTransfer.files[0] ? e.dataTransfer.files[0] : null;
    const { isValid, error } = validateFile(droppedFile);
    if (!isValid) {
      setError(error);
      setFile(null);
      setPreviewUrl(null);
      onFileSelect(null);
      return;
    }
    setError(null);
    setFile(droppedFile);
    setPreviewUrl(droppedFile ? URL.createObjectURL(droppedFile) : null);
    onFileSelect(droppedFile);
  };

  // Nettoyage de l'URL de preview pour éviter les fuites mémoire
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className={`w-full ${bgColor} p-4 rounded-lg border-2 ${borderColor} ${isDragging ? "border-blue-500" : ""} transition-all`}>
      <label className="block text-gray-700 font-medium mb-2">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <div
        className={`flex flex-col items-center justify-center py-8 cursor-pointer ${isDragging ? "bg-blue-50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {icon ? (
          <span className="mb-2">{icon}</span>
        ) : (
          <Upload className="w-8 h-8 text-blue-500 mb-2" />
        )}
        <p className="text-gray-500 text-sm mb-2">Glissez-déposez ou cliquez pour sélectionner un fichier</p>
        {preview && previewUrl && (
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              onClick={e => { e.stopPropagation(); setShowPreview(true); }}
            >
              <Eye className="w-5 h-5 text-blue-600" />
            </button>
            <img src={previewUrl} alt="Aperçu" className="w-12 h-12 object-cover rounded-lg border" />
          </div>
        )}
        <input
          type="file"
          accept={accept}
          required={required}
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 mt-2 text-red-600 text-sm"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto p-1"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showPreview && previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            onClick={() => setShowPreview(false)}
          >
            <div className="bg-white rounded-lg shadow-lg p-6 relative" onClick={e => e.stopPropagation()}>
              <button className="absolute top-2 right-2" onClick={() => setShowPreview(false)}><X className="w-6 h-6 text-gray-600" /></button>
              <img src={previewUrl} alt="Aperçu du fichier" className="max-w-xs max-h-[70vh] rounded-lg" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {file && !error && (
        <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
          <CheckCircle className="w-5 h-5" />
          Fichier prêt à être envoyé : {file.name}
        </div>
      )}
    </div>
  );
};
