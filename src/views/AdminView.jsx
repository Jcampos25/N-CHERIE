import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import AdminModal from '../components/AdminModal';
import { Plus, Settings, X } from 'lucide-react';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminView({ products, waNumber, setWaNumber }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem('ncherie_admin') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      sessionStorage.setItem('ncherie_admin', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await deleteDoc(doc(db, 'products', id.toString()));
      } catch (error) {
        alert("Error al eliminar: Verifica las reglas de Firestore.");
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleSave = async (savedProduct) => {
    try {
      const productId = editingProduct ? savedProduct.id.toString() : Date.now().toString();
      const productData = { ...savedProduct, id: productId };
      await setDoc(doc(db, 'products', productId), productData);
      setIsModalOpen(false);
    } catch (error) {
      alert("Error al guardar: Verifica las reglas de Firestore.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl border-2 border-pink-200 max-w-sm w-full">
          <h2 className="text-2xl font-bold text-[#5C1527] mb-6 text-center">Acceso Admin</h2>
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:border-pink-500"
          />
          <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition-colors">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-[#5C1527]">Panel de Administración</h1>
          <p className="text-pink-500">Modo de edición activado</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-full flex items-center gap-2 shadow-sm transition-colors"
          >
            <Settings size={20} />
            <span className="hidden sm:inline">Ajustes</span>
          </button>
          <button 
            onClick={handleAddNew}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 shadow-md transition-colors"
          >
            <Plus size={20} />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            isAdmin={true} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {isModalOpen && (
        <AdminModal 
          product={editingProduct} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#5C1527] text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">Configuración</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de WhatsApp (con código de área)</label>
              <input 
                type="text" 
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-pink-500 mb-6"
                placeholder="Ej: 50588889999"
              />
              <button 
                onClick={async () => {
                  try {
                    await setDoc(doc(db, 'settings', 'config'), { waNumber }, { merge: true });
                    setIsSettingsOpen(false);
                  } catch (error) {
                    alert("Error al guardar: Verifica las reglas de Firestore.");
                  }
                }}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded-lg transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
