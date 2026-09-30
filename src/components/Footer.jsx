import React, { useState, useEffect } from 'react';
import { Phone, Instagram, Music2 } from 'lucide-react';

export default function Footer() {
  const [logo, setLogo] = useState(localStorage.getItem('ncherie_logo') || '/logo.png');
  const [socials, setSocials] = useState({
    whatsapp: localStorage.getItem('ncherie_whatsapp') || '',
    instagram: localStorage.getItem('ncherie_instagram') || '',
    tiktok: localStorage.getItem('ncherie_tiktok') || ''
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setSocials({
        whatsapp: localStorage.getItem('ncherie_whatsapp') || '',
        instagram: localStorage.getItem('ncherie_instagram') || '',
        tiktok: localStorage.getItem('ncherie_tiktok') || ''
      });
      setLogo(localStorage.getItem('ncherie_logo') || '/logo.png');
    };
    window.addEventListener('settingsUpdated', handleStorageChange);
    return () => window.removeEventListener('settingsUpdated', handleStorageChange);
  }, []);

  return (
    <footer className="mt-auto py-10 rounded-t-[2rem] md:rounded-t-[3rem] transition-all duration-300 shadow-[0_-8px_30px_rgb(0,0,0,0.05)] border-t-2 border-pink-900/20" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.2) 100%), var(--header-bg, #5C1527)' }}>
      <div className="container mx-auto px-4 flex flex-col items-center">
        
        {/* Logo and Name */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={logo} alt="N-CHÉRIE Logo" className="h-12 w-auto object-contain drop-shadow-md" onError={(e) => e.target.style.display = 'none'} />
          <div className="text-white font-bold text-xl tracking-widest flex items-center drop-shadow-md whitespace-nowrap">
            <span className="text-[#D4AF37]">N-CHÉRIE</span>
          </div>
        </div>

        {/* Social Links (Sólo móvil) */}
        <div className="flex md:hidden gap-4 mb-6">
          {socials.whatsapp && (
            <a href={`https://wa.me/${socials.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-full bg-white/5">
              <Phone size={24} />
            </a>
          )}
          {socials.instagram && (
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-full bg-white/5">
              <Instagram size={24} />
            </a>
          )}
          {socials.tiktok && (
            <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-full bg-white/5">
              <Music2 size={24} />
            </a>
          )}
        </div>

        {/* Copyright */}
        <div className="text-center text-white/60 text-xs md:text-sm border-t border-white/10 pt-6 w-full max-w-md">
          © 2026 N-CHÉRIE. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
