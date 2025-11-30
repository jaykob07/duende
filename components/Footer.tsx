import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-duende-dark text-white border-t-4 border-duende-gold mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* QUIENES SOMOS */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-duende-gold text-center md:text-left">Quiénes Somos</h3>
            <p className="text-gray-300 leading-relaxed font-light text-sm text-justify">
              En Accesorios El Duende, fusionamos la magia de la tradición con la elegancia moderna. 
              Somos una empresa dedicada a curar y crear joyería y accesorios tecnológicos exclusivos, 
              diseñados para aquellos que buscan destacar con piezas únicas y llenas de personalidad.
            </p>
          </div>

          {/* CONTACTANOS */}
          <div className="space-y-4 text-center">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-duende-gold">Contáctanos</h3>
            <ul className="space-y-3 text-gray-300 text-sm inline-block text-left">
              <li className="flex items-center gap-3">
                <MapPin className="text-duende-green min-w-[18px]" size={18} />
                <span>Calle Mágica 123, Ciudad Esmeralda</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-duende-green min-w-[18px]" size={18} />
                <span>+57 300 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-duende-green min-w-[18px]" size={18} />
                <span>contacto@elduende.com</span>
              </li>
            </ul>
          </div>

          {/* REDES SOCIALES */}
          <div className="space-y-4 text-center md:text-right">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-duende-gold">Síguenos</h3>
            <p className="text-gray-400 text-sm mb-4">Descubre nuestras novedades diarias.</p>
            <div className="flex justify-center md:justify-end gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-duende-gold hover:text-duende-dark transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-duende-gold hover:text-duende-dark transition-all duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-duende-gold hover:text-duende-dark transition-all duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Accesorios El Duende. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};