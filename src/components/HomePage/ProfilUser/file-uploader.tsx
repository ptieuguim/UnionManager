"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FileUploaderProps {
  label: string;
  icon?: React.ReactNode;
  accept: string;
  onFileSelect: (file: File | null) => void;
  bgColor?: string;
  borderColor?: string;
}

export const FileUploader = ({
  label,
  icon,
  accept,
  onFileSelect,
  bgColor = "",
  borderColor = "",
}: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Le fichier est trop volumineux. Taille maximale : 5 Mo.");
        setFile(null);
        onFileSelect(null);
      } else {
        setFile(selectedFile);
        setError(null);
        onFileSelect(selectedFile);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      handleFileChange({ target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
    } else {
      setError("Veuillez déposer une image valide.");
    }
  };

  return (
    <div>
      <label className="mb-2 block text-lg font-semibold text-gray-700">
        {icon}
        <span className="ml-2">{label}</span>
      </label>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${bgColor} ${borderColor} cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition duration-300 ease-in-out`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />
        {file ? (
          <div className="flex items-center justify-center">
            <CheckCircle className="mr-2 text-green-500" />
            <span className="font-semibold text-green-600">{file.name}</span>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">
              {t("glissez_et_deposez_votre_fichier_ici_ou_cliquer_pour_selectionner")}
            </p>
          </div>
        )}
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center text-red-500"
        >
          <AlertCircle className="mr-2" size={16} />
          {error}
        </motion.p>
      )}
    </div>
  );
};
