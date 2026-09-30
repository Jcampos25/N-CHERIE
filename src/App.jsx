import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import ClientView from './views/ClientView';
import AdminView from './views/AdminView';

const initialProducts = [
  { "id": 1, "nombre": "Set 4 Sponges Blenders", "descripcion": "Esponjas de maquillaje para un acabado perfecto.", "precio": 60, "existencias": 10, "imagen": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80" },
  { "id": 2, "nombre": "Uñas Instant", "descripcion": "Set de uñas postizas de aplicación rápida.", "precio": 70, "existencias": 15, "imagen": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80" },
  { "id": 3, "nombre": "Removedor de Maquillaje", "descripcion": "Limpieza profunda y suave para el rostro.", "precio": 50, "existencias": 20, "imagen": "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500&q=80" },
  { "id": 4, "nombre": "Blush Contorno IC", "descripcion": "Ideal para definir y dar color al rostro.", "precio": 60, "existencias": 5, "imagen": "https://images.unsplash.com/photo-1617220828111-eb241aaaf2bf?w=500&q=80" },
  { "id": 5, "nombre": "Lipgloss Doble Ushas", "descripcion": "Brillo labial de larga duración y alta hidratación.", "precio": 50, "existencias": 12, "imagen": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80" },
  { "id": 6, "nombre": "Lipliner Pencil Saphila", "descripcion": "Lápiz delineador de labios preciso.", "precio": 20, "existencias": 30, "imagen": "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=500&q=80" },
  { "id": 7, "nombre": "Primer San", "descripcion": "Prepara e hidrata tu piel antes del maquillaje.", "precio": 65, "existencias": 8, "imagen": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80" },
  { "id": 8, "nombre": "Concealer en Forma de...", "descripcion": "Corrector de alta cobertura y acabado natural.", "precio": 20, "existencias": 18, "imagen": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80" },
  { "id": 9, "nombre": "Paleta 2 Blush Ushas", "descripcion": "Dos tonos de rubor altamente pigmentados.", "precio": 35, "existencias": 7, "imagen": "https://images.unsplash.com/photo-1512496015851-a1fb8fdd47a3?w=500&q=80" },
  { "id": 10, "nombre": "Crema Manos Fresa", "descripcion": "Hidratación profunda con aroma a fresa.", "precio": 50, "existencias": 25, "imagen": "https://images.unsplash.com/photo-1628215911520-25bc1ec752ba?w=500&q=80" },
  { "id": 11, "nombre": "Delineador Natural Ushas", "descripcion": "Delineado de ojos resistente y de alta precisión.", "precio": 25, "existencias": 14, "imagen": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80" },
  { "id": 12, "nombre": "Eyeliner Pencil Saphila", "descripcion": "Lápiz delineador de ojos negro intenso.", "precio": 20, "existencias": 22, "imagen": "https://images.unsplash.com/photo-1625086884043-44123dc10b9a?w=500&q=80" },
  { "id": 13, "nombre": "Sellador en Spray Fresh", "descripcion": "Fija tu maquillaje durante todo el día.", "precio": 110, "existencias": 4, "imagen": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80" },
  { "id": 14, "nombre": "Polvo para Cejas Perfect", "descripcion": "Define y rellena tus cejas de forma natural.", "precio": 55, "existencias": 9, "imagen": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80" },
  { "id": 15, "nombre": "Blush/Labial en 1 Ushas", "descripcion": "Producto dual multifuncional para mejillas y labios.", "precio": 45, "existencias": 11, "imagen": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80" }
];

function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ncherie_products_v4');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('ncherie_products_v4', JSON.stringify(initialProducts));
    return initialProducts;
  });

  const [cart, setCart] = useState([]);

  const [waNumber, setWaNumber] = useState(() => {
    return localStorage.getItem('ncherie_wanumber') || '50500000000';
  });

  useEffect(() => {
    localStorage.setItem('ncherie_products_v4', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ncherie_wanumber', waNumber);
  }, [waNumber]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeOneFromCart = (productId) => {
    const index = cart.findIndex(p => p.id === productId);
    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const removeAllFromCart = (productId) => {
    setCart(cart.filter(p => p.id !== productId));
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<ClientView products={products} cart={cart} addToCart={addToCart} removeOneFromCart={removeOneFromCart} removeAllFromCart={removeAllFromCart} waNumber={waNumber} />} />
          <Route path="/admin" element={<AdminView products={products} setProducts={setProducts} waNumber={waNumber} setWaNumber={setWaNumber} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
