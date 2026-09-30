import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import Header from './components/Header';
import ClientView from './views/ClientView';
import AdminView from './views/AdminView';

const initialProducts = [
  { "id": "1", "nombre": "Set 4 Sponges Blenders", "descripcion": "Esponjas de maquillaje para un acabado perfecto.", "precio": 60, "existencias": 10, "imagen": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80" },
  { "id": "2", "nombre": "Uñas Instant", "descripcion": "Set de uñas postizas de aplicación rápida.", "precio": 70, "existencias": 15, "imagen": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80" },
  { "id": "3", "nombre": "Removedor de Maquillaje", "descripcion": "Limpieza profunda y suave para el rostro.", "precio": 50, "existencias": 20, "imagen": "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500&q=80" },
  { "id": "4", "nombre": "Blush Contorno IC", "descripcion": "Ideal para definir y dar color al rostro.", "precio": 60, "existencias": 5, "imagen": "https://images.unsplash.com/photo-1617220828111-eb241aaaf2bf?w=500&q=80" },
  { "id": "5", "nombre": "Lipgloss Doble Ushas", "descripcion": "Brillo labial de larga duración y alta hidratación.", "precio": 50, "existencias": 12, "imagen": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80" },
  { "id": "6", "nombre": "Lipliner Pencil Saphila", "descripcion": "Lápiz delineador de labios preciso.", "precio": 20, "existencias": 30, "imagen": "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=500&q=80" },
  { "id": "7", "nombre": "Primer San", "descripcion": "Prepara e hidrata tu piel antes del maquillaje.", "precio": 65, "existencias": 8, "imagen": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80" }
];

import Footer from './components/Footer';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [waNumber, setWaNumber] = useState('50500000000');

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (snapshot.empty) {
        // Seed initial data if DB is empty
        initialProducts.forEach(async (p) => {
          try {
            await setDoc(doc(db, 'products', p.id), p);
          } catch (error) {
            console.error("Error saving product:", error);
            alert("Error al acceder a la base de datos. Verifica las Reglas de Seguridad de Firestore.");
          }
        });
      } else {
        const prods = snapshot.docs.map(doc => doc.data());
        setProducts(prods);
      }
    }, (error) => {
      console.error("Firestore error:", error);
      alert("No se pudieron cargar los productos. Asegúrate de haber configurado Firestore en 'Modo de Prueba'.");
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'config'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().waNumber) {
        setWaNumber(docSnap.data().waNumber);
      } else {
        // Set default waNumber in DB
        setDoc(doc(db, 'settings', 'config'), { waNumber: '50500000000' }).catch(e => console.error(e));
      }
    }, (error) => {
      console.error("Firestore settings error:", error);
    });

    return () => {
      unsubProducts();
      unsubSettings();
    };
  }, []);

  useEffect(() => {
    const updateColors = () => {
      const pageBg = localStorage.getItem('ncherie_page_bg') || '#fdf2f8';
      const headerBg = localStorage.getItem('ncherie_header_bg') || '#5C1527';
      const cardAccent = localStorage.getItem('ncherie_card_accent') || '#ec4899';
      
      document.documentElement.style.setProperty('--page-bg', pageBg);
      document.documentElement.style.setProperty('--header-bg', headerBg);
      document.documentElement.style.setProperty('--card-accent', cardAccent);
    };

    updateColors();
    window.addEventListener('settingsUpdated', updateColors);
    return () => window.removeEventListener('settingsUpdated', updateColors);
  }, []);

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 pt-6 pb-0 flex-grow">
        <Routes>
          <Route path="/" element={<ClientView products={products} cart={cart} addToCart={addToCart} removeOneFromCart={removeOneFromCart} removeAllFromCart={removeAllFromCart} waNumber={waNumber} />} />
          <Route path="/admin" element={<AdminView products={products} waNumber={waNumber} setWaNumber={setWaNumber} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
