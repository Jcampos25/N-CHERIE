import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

export default function AdminModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    existencias: 0,
    imagen: ''
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Comprimir imagen usando Canvas
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Comprimir a JPEG con calidad 0.7
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setFormData(prev => ({ ...prev, imagen: compressedBase64 }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      precio: Number(formData.precio),
      existencias: Number(formData.existencias) || 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-[#5C1527] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button type="button" onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              type="text" 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleChange}
              required
              rows={2}
              className="w-full p-2 border rounded-lg focus:outline-none focus:border-pink-500 resize-none"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (C$)</label>
              <input 
                type="number" 
                name="precio" 
                value={formData.precio} 
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Existencias</label>
              <input 
                type="number" 
                name="existencias" 
                value={formData.existencias} 
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
            <div className="mt-1 flex items-center gap-4">
              {formData.imagen && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border">
                  <img src={formData.imagen} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex-1 cursor-pointer bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-600 rounded-lg p-2 flex items-center justify-center gap-2 transition-colors">
                <Upload size={20} />
                <span className="text-sm font-medium">Subir Imagen</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="hidden" 
                />
              </label>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">O ingresa URL directa:</div>
            <input 
              type="url" 
              name="imagen" 
              value={formData.imagen} 
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:border-pink-500 text-sm"
            />
          </div>
          
          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg transition-colors">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
