import React, { useState } from 'react';
import { ShoppingCart, X, Trash2, MessageCircle, Plus, Minus } from 'lucide-react';

export default function CartButton({ cart, addToCart, removeOneFromCart, removeAllFromCart, waNumber }) {
  const [isOpen, setIsOpen] = useState(false);

  if (cart.length === 0) {
    if (isOpen) setIsOpen(false);
    return null;
  }

  // Agrupar productos por ID
  const groupedCart = cart.reduce((acc, item) => {
    const existing = acc.find(p => p.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  const total = cart.reduce((sum, item) => sum + Number(item.precio), 0);
  
  const handleCheckout = () => {
    let message = "Hola N-CHÉRIE! 💖 Me gustaría hacer este pedido:\n\n";
    groupedCart.forEach((item, index) => {
      message += `${index + 1}. ${item.quantity}x ${item.nombre} - C$${item.precio * item.quantity}\n`;
    });
    message += `\n*Total (sin envío): C$${total}*\n`;
    message += `_Nota: El costo de envío no está incluido y será coordinado._\n\n¡Gracias!`;
    
    const cleanNumber = waNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div className="relative">
            <ShoppingCart size={28} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          </div>
          <span className="font-bold text-lg pr-2">C$ {total}</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in duration-300">
            <div className="bg-green-500 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingCart size={24} />
                <h2 className="text-xl font-bold">Tu Pedido</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4 max-h-[50vh] overflow-y-auto">
              {groupedCart.map((item) => (
                <div key={item.id} className="flex flex-col py-3 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800 text-sm line-clamp-2 pr-2">{item.nombre}</h4>
                    <button 
                      onClick={() => removeAllFromCart(item.id)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors shrink-0"
                      title="Eliminar todo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center bg-gray-100 rounded-full">
                      <button onClick={() => removeOneFromCart(item.id)} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => addToCart(item)} 
                        disabled={item.quantity >= item.existencias}
                        className={`p-1.5 rounded-full transition-colors ${item.quantity >= item.existencias ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-pink-600 font-bold text-sm">C$ {item.precio * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center mb-1 text-lg">
                <span className="font-medium text-gray-600">Subtotal:</span>
                <span className="font-bold text-2xl text-[#5C1527]">C$ {total}</span>
              </div>
              <div className="text-xs text-gray-500 mb-4 text-right">
                * Costo de envío <span className="font-bold text-pink-600">NO incluido</span>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <MessageCircle size={24} />
                <span>Enviar por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
