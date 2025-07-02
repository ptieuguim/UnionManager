import React from "react";

export interface ServiceFormProps {
  onSubmit: (service: { name: string; description: string; image: string }) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ onSubmit }) => {
  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [image, setImage] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ name, description, image });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Ajouter un service</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nom du service
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          rows={3}
          required
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          URL de l'image
        </label>
        <input
          type="url"
          id="image"
          value={image}
          onChange={e => setImage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          required
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-md shadow-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition-colors duration-200"
      >
        Ajouter le service
      </motion.button>
    </form>
  );
};

export default ServiceForm;
