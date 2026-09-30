import React, { useState, useEffect } from 'react';
import { Edit, Upload, X, MoveHorizontal, Maximize2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const [logo, setLogo] = useState(localStorage.getItem('ncherie_logo') || '/logo.jpg');
  const [logoSize, setLogoSize] = useState(localStorage.getItem('ncherie_logosize') || '64');
  const [logoSpacing, setLogoSpacing] = useState(localStorage.getItem('ncherie_logospacing') || '16');
  const [imgError, setImgError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const location = useLocation();
  const isAdminView = location.pathname === '/admin' && sessionStorage.getItem('ncherie_admin') === 'true';

  useEffect(() => {
    localStorage.setItem('ncherie_logo', logo);
    localStorage.setItem('ncherie_logosize', logoSize);
    localStorage.setItem('ncherie_logospacing', logoSpacing);
    setImgError(false);
  }, [logo, logoSize, logoSpacing]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <header className="bg-[#5C1527] shadow-[0_8px_30px_rgb(0,0,0,0.12)] sticky top-0 z-40 group rounded-b-[2rem] md:rounded-b-[3rem] border-b-2 border-pink-900/30">
        <div className="container mx-auto px-4 h-20 md:h-24 flex items-center justify-center relative">
          
          {/* Botón de edición visible solo en modo Admin */}
          {isAdminView && (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-yellow-400 text-yellow-900 p-2 rounded-full shadow-md hover:bg-yellow-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-50"
              title="Editar Encabezado"
            >
              <Edit size={18} />
            </button>
          )}

          {/* Contenedor central con Logo y Texto */}
          <div className="flex items-center justify-center" style={{ gap: `${logoSpacing}px` }}>
            {/* Renderizado del logo si existe y no da error */}
            {!imgError && logo && (
              <img 
                src={logo} 
                alt="N-CHÉRIE Logo" 
                style={{ height: `${logoSize}px` }}
                className="object-contain drop-shadow-md transition-all" 
                onError={(e) => { 
                  e.target.style.display = 'none'; 
                  setImgError(true);
                }} 
              />
            )}
            
            {/* El texto dorado SIEMPRE visible como solicitaste */}
            <div className="text-white font-bold text-2xl md:text-3xl tracking-widest flex items-center drop-shadow-md">
              <span className="text-[#D4AF37]">N-CHÉRIE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Modal para editar Logo */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#5C1527] text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">Ajustes de Encabezado</h2>
              <button onClick={() => setIsEditing(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subir imagen de logo</label>
              
              <div className="flex items-center gap-4 mb-4">
                {!imgError && logo && (
                  <div className="w-16 h-16 bg-pink-50 rounded-lg overflow-hidden border flex-shrink-0 flex items-center justify-center">
                    <img src={logo} alt="Preview" className="max-w-full max-h-full object-contain" onError={() => setImgError(true)} />
                  </div>
                )}
                <label className="flex-1 cursor-pointer bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-600 rounded-lg p-3 flex items-center justify-center gap-2 transition-colors">
                  <Upload size={20} />
                  <span className="text-sm font-medium">Seleccionar</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden" 
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Maximize2 size={16} /> Tamaño del Logo: {logoSize}px
                </label>
                <input 
                  type="range" 
                  min="30" 
                  max="120" 
                  value={logoSize}
                  onChange={(e) => setLogoSize(e.target.value)}
                  className="w-full accent-pink-500"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MoveHorizontal size={16} /> Separación con el texto: {logoSpacing}px
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={logoSpacing}
                  onChange={(e) => setLogoSpacing(e.target.value)}
                  className="w-full accent-pink-500"
                />
              </div>
              
              <button 
                onClick={() => setIsEditing(false)}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded-lg transition-colors"
              >
                Cerrar y Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
