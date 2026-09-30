import React, { useState } from 'react';
import { LogOut, Plus, Image as ImageIcon, Trash2, Edit2, Save, X } from 'lucide-react';

const AdminView = ({ products, updateProducts }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple password as requested
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert image to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm(prev => ({ ...prev, imagen: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm(product);
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditForm({});
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm({
      id: Date.now(),
      nombre: '',
      descripcion: '',
      precio: 0,
      imagen: ''
    });
  };

  const saveProduct = () => {
    if (!editForm.nombre || editForm.precio <= 0) {
      alert('Nombre y precio válido son obligatorios.');
      return;
    }

    let newProducts;
    if (isAdding) {
      newProducts = [...products, editForm];
    } else {
      newProducts = products.map(p => p.id === editingId ? editForm : p);
    }
    
    updateProducts(newProducts);
    cancelEdit();
  };

  const deleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      updateProducts(products.filter(p => p.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-6 text-text-main">Acceso Admin</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit" className="bg-text-main text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors">
              Ingresar
            </button>
          </form>
          <p className="mt-4 text-xs text-gray-400">Pista: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-text-main flex items-center gap-2">
          Panel de Control
        </h1>
        <button onClick={() => setIsAuthenticated(false)} className="text-gray-500 hover:text-red-500 flex items-center gap-1 text-sm font-medium">
          <LogOut size={16} /> Salir
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Inventario</h2>
          <button 
            onClick={startAdd}
            className="bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Nuevo Producto
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                  <th className="p-4 font-medium">Imagen</th>
                  <th className="p-4 font-medium">Producto</th>
                  <th className="p-4 font-medium">Descripción</th>
                  <th className="p-4 font-medium">Precio (C$)</th>
                  <th className="p-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {products.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-400">No hay productos. Agrega uno nuevo.</td></tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                          {product.imagen ? (
                            <img src={product.imagen} alt="thumb" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={20} className="text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-800">{product.nombre}</td>
                      <td className="p-4 text-gray-500 max-w-xs truncate">{product.descripcion}</td>
                      <td className="p-4 font-semibold text-accent">C$ {product.precio}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => startEdit(product)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors bg-white rounded-md shadow-sm border border-gray-100"><Edit2 size={16} /></button>
                          <button onClick={() => deleteProduct(product.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-md shadow-sm border border-gray-100"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Editor Modal */}
      {(editingId !== null || isAdding) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-in-right">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">{isAdding ? 'Agregar Producto' : 'Editar Producto'}</h3>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-800"><X size={20} /></button>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input 
                  type="text" 
                  value={editForm.nombre} 
                  onChange={e => setEditForm({...editForm, nombre: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                  value={editForm.descripcion} 
                  onChange={e => setEditForm({...editForm, descripcion: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio (C$)</label>
                <input 
                  type="number" 
                  value={editForm.precio} 
                  onChange={e => setEditForm({...editForm, precio: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen (Archivo o URL)</label>
                <div className="flex gap-2 items-center mb-2">
                  <div className="w-16 h-16 rounded-md border border-gray-200 bg-gray-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {editForm.imagen ? <img src={editForm.imagen} alt="preview" className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-400" />}
                  </div>
                  <div className="flex-grow flex flex-col gap-2">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
                    />
                    <input 
                      type="text" 
                      placeholder="O pega una URL directa"
                      value={editForm.imagen && editForm.imagen.startsWith('data:image') ? '' : editForm.imagen}
                      onChange={e => setEditForm({...editForm, imagen: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={cancelEdit} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button onClick={saveProduct} className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-opacity-90 flex items-center gap-2"><Save size={16} /> Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
