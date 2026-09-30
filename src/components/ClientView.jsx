import React, { useState } from 'react';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';

const ClientView = ({ products }) => {
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        ...product,
        quantity: (prev[product.id]?.quantity || 0) + 1
      }
    }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[id];
      return newCart;
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const newQuantity = current.quantity + delta;
      if (newQuantity <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return {
        ...prev,
        [id]: { ...current, quantity: newQuantity }
      };
    });
  };

  const cartItems = Object.values(cart);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.precio * item.quantity), 0);

  const sendWhatsApp = () => {
    if (cartItems.length === 0) return;
    
    let message = `Hola, vengo de TikTok y me gustaría pedir los siguientes productos:%0A%0A`;
    cartItems.forEach(item => {
      message += `- ${item.quantity}x ${item.nombre} (C$ ${item.precio * item.quantity})%0A`;
    });
    message += `%0ATotal: C$ ${totalPrice}`;
    
    const url = `https://wa.me/50500000000?text=${message}`; // Replace with actual number
    window.open(url, '_blank');
  };

  return (
    <div className="relative min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-text-main">N-CHÉRIE</h1>
      </header>

      {/* Hero section */}
      <div className="px-6 py-8 text-center bg-accent/10">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Belleza a tu alcance</h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto">Descubre nuestra colección de cosméticos seleccionados especialmente para ti.</p>
      </div>

      {/* Catalog Grid */}
      <main className="px-4 py-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
              <div className="aspect-square w-full bg-gray-50 overflow-hidden relative">
                {product.imagen ? (
                  <img src={product.imagen} alt={product.nombre} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 p-4 text-center text-sm border-b border-gray-100">
                    Imagen no disponible
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-sm md:text-base leading-tight mb-1 line-clamp-2">{product.nombre}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-grow">{product.descripcion}</p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                  <span className="font-bold text-accent">C$ {product.precio}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-accent text-white p-2 rounded-full hover:bg-opacity-90 transition-colors active:scale-95"
                    aria-label="Agregar al carrito"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-text-main text-white p-4 rounded-full shadow-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all z-40 animate-bounce"
        >
          <ShoppingBag size={24} />
          <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        </button>
      )}

      {/* Cart Modal Slide-up */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-slide-in-right">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ShoppingBag className="text-accent" /> Mi Pedido
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-800 p-2 text-2xl leading-none">&times;</button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500 my-auto">Tu carrito está vacío.</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {item.imagen ? (
                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 text-center">Sin img</div>
                      )}
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold line-clamp-2 pr-2">{item.nombre}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-accent text-sm">C$ {item.precio * item.quantity}</span>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500 hover:text-text-main"><Minus size={14} /></button>
                          <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500 hover:text-text-main"><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-white">
                <div className="flex justify-between items-center mb-4 text-lg">
                  <span className="font-medium text-gray-600">Total</span>
                  <span className="font-bold text-xl">C$ {totalPrice}</span>
                </div>
                <button 
                  onClick={sendWhatsApp}
                  className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  Pedir por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientView;
