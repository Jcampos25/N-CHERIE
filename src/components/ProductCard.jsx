import React from 'react';
import { Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';

export default function ProductCard({ product, isAdmin, onEdit, onDelete, onAdd, countInCart = 0 }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border-2 border-pink-400 overflow-hidden relative group transition-transform hover:-translate-y-1 hover:shadow-xl">
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(product)}
            className="p-2 bg-yellow-400 text-yellow-900 rounded-full shadow-md hover:bg-yellow-500"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => onDelete(product.id)}
            className="p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
      
      <div className="relative h-32 md:h-48 bg-pink-50 overflow-hidden">
        {product.imagen ? (
          <img 
            src={product.imagen} 
            alt={product.nombre} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-pink-300">
            <ImageIcon size={32} className="mb-2 opacity-50 md:w-12 md:h-12" />
            <span className="text-[10px] md:text-sm font-medium">Sube foto</span>
          </div>
        )}
        
        {isAdmin && (
          <div className="absolute top-2 right-2 flex gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(product)} className="bg-white p-1.5 md:p-2 rounded-full text-blue-500 hover:bg-blue-50 shadow-md">
              <Edit size={14} className="md:w-4 md:h-4" />
            </button>
            <button onClick={() => onDelete(product.id)} className="bg-white p-1.5 md:p-2 rounded-full text-red-500 hover:bg-red-50 shadow-md">
              <Trash2 size={14} className="md:w-4 md:h-4" />
            </button>
          </div>
        )}
      </div>
      
      <div className="p-3 md:p-4 flex flex-col h-[160px] md:h-[210px]">
        <div className="flex justify-between items-start gap-1">
          <h3 className="font-bold text-sm md:text-lg text-gray-800 line-clamp-2 leading-tight">{product.nombre}</h3>
          {isAdmin && (
            <span className="bg-gray-100 text-gray-600 text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full shrink-0">
              {product.existencias || 0} u
            </span>
          )}
        </div>
        <p className="text-[11px] md:text-sm text-gray-500 mt-1 md:mt-2 flex-grow line-clamp-2 md:line-clamp-3 leading-snug">{product.descripcion}</p>
        
        <div className="flex items-center justify-between mt-2 md:mt-4">
          <div className="flex flex-col">
            <span className="font-extrabold text-base md:text-xl text-[#5C1527]">C${product.precio}</span>
            {!isAdmin && (product.existencias === 0 || product.existencias === '0') && (
              <span className="text-[10px] md:text-xs text-red-500 font-bold mt-0.5">Agotado</span>
            )}
            {!isAdmin && product.existencias > 0 && product.existencias <= 3 && (
              <span className="text-[10px] md:text-xs text-orange-500 font-bold mt-0.5">¡Quedan {product.existencias}!</span>
            )}
            {!isAdmin && countInCart >= product.existencias && product.existencias > 0 && (
              <span className="text-[10px] md:text-xs text-red-500 font-bold mt-0.5">Límite</span>
            )}
          </div>
          
          {!isAdmin && (
            <button 
              onClick={() => onAdd(product)}
              disabled={product.existencias === 0 || product.existencias === '0' || countInCart >= product.existencias}
              className={`${(product.existencias === 0 || product.existencias === '0' || countInCart >= product.existencias) ? 'bg-gray-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 shadow-md'} text-white p-1.5 md:p-2 rounded-full transition-transform active:scale-95 flex items-center justify-center`}
              title={(product.existencias === 0 || product.existencias === '0') ? "Agotado" : (countInCart >= product.existencias ? "Límite de stock" : "Agregar al pedido")}
            >
              <Plus size={18} className="md:w-6 md:h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
