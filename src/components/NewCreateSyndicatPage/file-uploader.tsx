import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

interface FileUploaderProps {
  label: string;
  icon?: React.ReactNode;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  bgColor?: string;
  borderColor?: string;
}

const MAX_SIZE = 5 * 1024 * 1024;

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  icon,
  accept,
  onFileSelect,
  bgColor = "bg-white",
  borderColor = "border-gray-300",
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_SIZE) {
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

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (!accept || droppedFile.type.startsWith(accept.replace('.', '')))) {
      handleFileChange({ target: { files: e.dataTransfer.files } } as ChangeEvent<HTMLInputElement>);
    } else {
      setError("Veuillez déposer un fichier valide.");
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
              Glissez et déposez votre fichier ici ou cliquez pour sélectionner un fichier.
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

export default FileUploader;
