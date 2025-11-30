import React, { useState } from 'react';
import { Search, ShoppingBag, Filter, Check, Loader2, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { Button } from '../components/Button';

interface GalleryViewProps {
  products: Product[];
  isLoading: boolean;
  onViewImage: (imageUrl: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ products, isLoading, onViewImage }) => {
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.reference.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  };

  const openWhatsApp = (product: Product) => {
    const phoneNumber = "573001234567"; 
    const priceFormatted = formatPrice(product.price);

    let message = `Hola Accesorios El Duende, estoy interesado en este producto:\n\n`;
    message += `🏷️ *Producto:* ${product.name}\n`;
    message += `🔑 *Referencia:* ${product.reference}\n`;
    message += `💰 *Precio:* ${priceFormatted}\n`;

    if (product.imageUrl && product.imageUrl.startsWith('http')) {
       message += `\n🖼️ *Ver foto:* ${product.imageUrl}`;
    }

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-duende-dark leading-tight">
          Catálogo Exclusivo
        </h2>
        <div className="flex items-center justify-center gap-2 my-4">
           <div className="h-[1px] w-8 md:w-12 bg-duende-gold/50"></div>
           <div className="text-duende-gold text-sm md:text-base">✧</div>
           <div className="h-[1px] w-8 md:w-12 bg-duende-gold/50"></div>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto font-light text-base md:text-lg px-4">
          Tecnología y estilo fusionados en piezas únicas.
        </p>
      </div>

      {/* Centered Search & Filter Area */}
      <div className="max-w-4xl mx-auto w-full mb-12 space-y-6">
        
        {/* Search Bar */}
        <div className="relative group shadow-lg rounded-xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-duende-gold">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nombre, referencia o tecnología..." 
            className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl bg-white border border-duende-gold/30 focus:ring-2 focus:ring-duende-gold focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Centered Filter Tags/Pills */}
        {products.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 animate-slide-up">
            <button 
              onClick={() => setSearch('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-sm border ${
                search === '' 
                ? 'bg-duende-dark text-white border-duende-dark shadow-duende-dark/30 transform scale-105' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-duende-gold hover:text-duende-dark hover:shadow-md'
              }`}
            >
              {search === '' && <Filter size={14} />}
              Ver Todo
            </button>
            
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => setSearch(p.reference)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 border shadow-sm ${
                  search === p.reference
                  ? 'bg-duende-green text-white border-duende-green shadow-duende-green/30 transform scale-105'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-duende-gold hover:text-duende-dark hover:shadow-md'
                }`}
              >
                {search === p.reference && <Check size={14} />}
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-duende-gold animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
          <ShoppingBag size={64} className="mx-auto mb-6 text-gray-200" />
          <p className="text-xl font-serif">No se encontraron productos.</p>
          <p className="text-sm mt-2">Intenta limpiar los filtros de búsqueda.</p>
          <Button variant="ghost" onClick={() => setSearch('')} className="mt-4 text-duende-green">
            Ver todo el inventario
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-duende-gold flex flex-col h-full animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div 
                className="relative h-64 overflow-hidden bg-white p-4 cursor-zoom-in"
                onClick={() => onViewImage(product.imageUrl)}
              >
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                />
                <div className="absolute top-4 right-4 bg-duende-dark/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-duende-gold shadow-lg border border-duende-gold/30">
                  {product.reference}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow relative">
                <h3 className="text-lg font-serif font-bold text-duende-dark group-hover:text-duende-green transition-colors">{product.name}</h3>
                
                <div className="mt-3 mb-4 h-0.5 w-10 bg-duende-gold/30 group-hover:w-20 transition-all duration-500"></div>
                
                <p className="text-sm text-gray-500 mb-6 italic line-clamp-3 leading-relaxed flex-grow">
                  {product.features}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-4">
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-bold text-duende-dark tracking-tight">{formatPrice(product.price)}</span>
                  </div>
                  
                  <button 
                    onClick={() => openWhatsApp(product)}
                    className="w-full bg-duende-green hover:bg-green-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transform active:scale-95 group/btn"
                  >
                    <MessageCircle size={20} className="fill-current" />
                    Consultar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};