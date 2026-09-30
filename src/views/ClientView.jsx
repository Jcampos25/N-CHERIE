import React from 'react';
import ProductCard from '../components/ProductCard';
import CartButton from '../components/CartButton';

export default function ClientView({ products, cart, addToCart, removeOneFromCart, removeAllFromCart, waNumber }) {
  return (
    <div>
      {/* Hero Banner Section - Optimizado para móvil */}
      <div className="bg-gradient-to-r from-pink-200 via-pink-100 to-pink-50 rounded-2xl md:rounded-3xl p-5 md:p-8 mb-6 md:mb-12 shadow-inner border border-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-8 -left-8 w-48 md:w-72 h-48 md:h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <span className="inline-block py-0.5 md:py-1 px-2 md:px-3 rounded-full bg-pink-500 text-white text-[10px] md:text-xs font-bold tracking-wider mb-2 md:mb-4 shadow-sm">NUEVA COLECCIÓN</span>
          <h1 className="text-2xl md:text-5xl font-extrabold text-[#5C1527] mb-2 md:mb-4 drop-shadow-sm leading-tight">Tu Belleza, <br className="md:hidden" />Nuestra Pasión</h1>
          <p className="text-pink-600 text-xs md:text-xl font-medium mb-2 md:mb-6 leading-relaxed">Descubre los mejores cosméticos. <br className="hidden md:block"/> Calidad profesional al mejor precio.</p>
        </div>
      </div>

      {/* Título de la sección */}
      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
        <div className="h-px bg-pink-300 flex-1"></div>
        <h2 className="text-lg md:text-2xl font-bold text-[#5C1527] whitespace-nowrap">Catálogo</h2>
        <div className="h-px bg-pink-300 flex-1"></div>
      </div>

      {/* Grid: 2 columnas en móvil para estilo TikTok */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
        {products.map((product) => {
          const countInCart = cart.filter(item => item.id === product.id).length;
          return (
            <ProductCard 
              key={product.id} 
              product={product} 
              isAdmin={false} 
              onAdd={addToCart}
              countInCart={countInCart}
            />
          );
        })}
      </div>

      {/* Footer / Próximamente */}
      <div className="mt-20 mb-12 flex flex-col items-center justify-center text-center opacity-80">
        <div className="w-12 h-px bg-pink-300 mb-4"></div>
        <h3 className="text-[#5C1527] font-semibold tracking-[0.2em] text-xs md:text-sm uppercase mb-2">
          Próximamente
        </h3>
        <p className="text-pink-500 font-medium text-xs md:text-sm">
          Estamos preparando nuevas colecciones para ti... ✨
        </p>
        <div className="w-12 h-px bg-pink-300 mt-4"></div>
      </div>

      <CartButton cart={cart} addToCart={addToCart} removeOneFromCart={removeOneFromCart} removeAllFromCart={removeAllFromCart} waNumber={waNumber} />
    </div>
  );
}
