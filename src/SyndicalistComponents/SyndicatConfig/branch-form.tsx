import React from "react";

export interface BranchFormProps {
  onSubmit: (branch: { name: string; coordinates: { lat: number; lng: number } }) => void;
}

const BranchForm: React.FC<BranchFormProps> = ({ onSubmit }) => {
  const [name, setName] = React.useState<string>("");
  const [lat, setLat] = React.useState<string>("");
  const [lng, setLng] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ name, coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Ajouter une antenne</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nom de l'antenne
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
        <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
          Latitude
        </label>
        <input
          type="number"
          id="lat"
          value={lat}
          onChange={e => setLat(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          required
          step="any"
        />
      </div>
      <div>
        <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
          Longitude
        </label>
        <input
          type="number"
          id="lng"
          value={lng}
          onChange={e => setLng(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          required
          step="any"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-md shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200"
      >
        Ajouter l'antenne
      </motion.button>
    </form>
  );
};

export default BranchForm;
