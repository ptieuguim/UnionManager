"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit, Trash2, X, Check, Truck, Navigation, Wrench, Shield, BookOpen, Users
} from "lucide-react";

// --- Types TypeScript stricts ---
export interface ProductServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  icon: React.ReactNode;
  type: "products" | "services";
}

export interface NewProductServiceItem {
  name: string;
  description: string;
  price: number;
  image?: string;
  icon?: React.ReactNode;
}

// --- Données fictives typées ---
const fakeItems: ProductServiceItem[] = [
  {
    id: "1",
    name: "Kit de sécurité routière",
    description: "Ensemble complet pour la sécurité des chauffeurs",
    price: 25000,
    image: "https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    icon: <Shield className="w-6 h-6" />,
    type: "products",
  },
  {
    id: "2",
    name: "GPS Cameroun Routes",
    description: "Navigation précise pour les routes camerounaises",
    price: 75000,
    image: "https://images.unsplash.com/photo-1581360742512-021d5b2157d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    icon: <Navigation className="w-6 h-6" />,
    type: "products",
  },
  {
    id: "3",
    name: "Manuel du Code de la Route",
    description: "Édition mise à jour pour le Cameroun",
    price: 10000,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80",
    icon: <BookOpen className="w-6 h-6" />,
    type: "products",
  },
  {
    id: "4",
    name: "Formation Sécurité Routière",
    description: "Session de 2 jours pour les chauffeurs",
    price: 50000,
    image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    icon: <Users className="w-6 h-6" />,
    type: "services",
  },
  {
    id: "5",
    name: "Assistance Juridique",
    description: "Conseil juridique pour les membres du syndicat",
    price: 30000,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    icon: <Shield className="w-6 h-6" />,
    type: "services",
  },
  {
    id: "6",
    name: "Inspection Technique",
    description: "Vérification complète des véhicules",
    price: 20000,
    image: "https://images.unsplash.com/photo-1630468266477-73d8e11a2c75?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    icon: <Wrench className="w-6 h-6" />,
    type: "services",
  },
];

// --- Squelette du composant migré (étape 1) ---
const ProductServiceManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"products" | "services">("products");
  const [items, setItems] = useState<ProductServiceItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<Partial<NewProductServiceItem>>({});
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    setItems(fakeItems.filter((item) => item.type === activeTab));
  }, [activeTab]);

  // --- Logique métier, UI et handlers migrés et typés strictement ---

  // Gestion de l'ajout d'un produit/service
  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      const itemToAdd: ProductServiceItem = {
        id: Date.now().toString(),
        name: newItem.name,
        description: newItem.description || '',
        price: Number(newItem.price),
        image: newItem.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop',
        icon: activeTab === 'products' ? <Shield className="w-6 h-6" /> : <Wrench className="w-6 h-6" />, // Default icons
        type: activeTab
      };
      setItems([itemToAdd, ...items]);
      setIsAddingItem(false);
      setNewItem({});
    }
  };

  // Gestion de la sélection d'un onglet
  const handleTabChange = (tab: 'products' | 'services') => {
    setActiveTab(tab);
    setIsAddingItem(false);
    setEditingItemId(null);
    setNewItem({});
  };

  // Gestion de la modification d'un item
  const handleEditItem = (id: string) => {
    setEditingItemId(id);
    const item = items.find((item) => item.id === id);
    if (item) {
      setNewItem({
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        icon: item.icon
      });
    }
  };

  const handleSaveEdit = () => {
    if (!editingItemId || !newItem.name || !newItem.price) return;
    setItems(items.map((item) =>
      item.id === editingItemId
        ? { ...item, ...newItem, price: Number(newItem.price) }
        : item
    ));
    setEditingItemId(null);
    setNewItem({});
  };

  // Gestion de la suppression d'un item
  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Rendu UI principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t('products_services.title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('products_services.subtitle')}
          </p>
        </motion.div>

        {/* Onglets */}
        <div className="mb-8 flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTabChange('products')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${activeTab === 'products' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Shield className={`w-5 h-5 mr-2 ${activeTab === 'products' ? 'text-white' : 'text-blue-500'}`} />
            {t('products_services.tabs.products')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTabChange('services')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${activeTab === 'services' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Wrench className={`w-5 h-5 mr-2 ${activeTab === 'services' ? 'text-white' : 'text-blue-500'}`} />
            {t('products_services.tabs.services')}
          </motion.button>
        </div>

        {/* Bouton d'ajout */}
        <div className="mb-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsAddingItem(true);
              setEditingItemId(null);
              setNewItem({});
            }}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-md shadow hover:from-indigo-700 hover:to-blue-600 transition"
          >
            <Plus size={18} /> {t('products_services.actions.add', { context: activeTab })}
          </motion.button>
        </div>

        {/* Formulaire d'ajout/modification */}
        <AnimatePresence>
          {(isAddingItem || editingItemId) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <h2 className="text-xl font-semibold mb-4">
                {editingItemId ? t('products_services.form.edit') : t('products_services.form.add')} {activeTab === 'products' ? t('products_services.form.product') : t('products_services.form.service')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('products_services.form.name')}
                  </label>
                  <input
                    type="text"
                    value={newItem.name || ""}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    placeholder={t('products_services.form.name_placeholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('products_services.form.price')}
                  </label>
                  <input
                    type="number"
                    value={newItem.price || ""}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: Number(e.target.value) })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    placeholder={t('products_services.form.price_placeholder')}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('products_services.form.description')}
                  </label>
                  <textarea
                    value={newItem.description || ""}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    placeholder={t('products_services.form.description_placeholder')}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('products_services.form.image')}
                  </label>
                  <input
                    type="text"
                    value={newItem.image || ""}
                    onChange={(e) =>
                      setNewItem({ ...newItem, image: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    placeholder={t('products_services.form.image_placeholder')}
                  />
                </div>
              </div>
              <div className="mt-6 flex space-x-4 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAddingItem(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md transition"
                >
                  {t('products_services.form.cancel')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={editingItemId ? handleSaveEdit : handleAddItem}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  disabled={!newItem.name || !newItem.price}
                >
                  {editingItemId ? t('products_services.form.save') : t('products_services.form.add')}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste des items */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Nom</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Prix</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {items.length > 0 ? (
                    items.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 font-semibold flex items-center">
                          {item.icon}
                          <span className="ml-2">{item.name}</span>
                        </td>
                        <td className="px-6 py-4">{item.description}</td>
                        <td className="px-6 py-4">{item.price.toLocaleString()} FCFA</td>
                        <td className="px-6 py-4">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              className="p-2 rounded hover:bg-indigo-100 text-indigo-600"
                              onClick={() => handleEditItem(item.id)}
                            >
                              <Edit className="w-4 h-4 inline-block mr-1" />
                              {t('products_services.actions.edit')}
                            </button>
                            <button
                              className="p-2 rounded hover:bg-red-100 text-red-600"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4 inline-block mr-1" />
                              {t('products_services.actions.delete')}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun élément trouvé</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          Aucun produit ou service n'est disponible pour le moment. Ajoutez-en un nouveau !
                        </p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductServiceManagement;
