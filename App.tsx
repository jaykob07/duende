import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Lock, 
  Plus, 
  LogOut, 
  Search, 
  Trash2, 
  Edit2, 
  X,
  MessageCircle,
  Zap,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Filter,
  Check,
  Loader2
} from 'lucide-react';
import { Product, ViewState } from './types';
import { getProducts, saveProduct, deleteProduct } from './services/storage';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { ProductModal } from './components/ProductModal';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('gallery');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Auth State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Lightbox State
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setView('admin');
      setAuthError('');
    } else {
      setAuthError('Credenciales incorrectas.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('gallery');
    setUsername('');
    setPassword('');
  };

  const handleSaveProduct = async (product: Product) => {
    // No activamos setIsLoading global aquí porque el Modal ya maneja su propio estado de "Guardando..."
    // Esto evita parpadeos innecesarios en el fondo.
    try {
      const updatedList = await saveProduct(product);
      setProducts(updatedList);
      setEditingProduct(null);
      // NO llamamos a setIsLoading(false) aquí porque el modal se encargará de cerrarse.
    } catch (error) {
      // IMPORTANTE: Re-lanzamos el error para que el ProductModal lo capture.
      // Si usamos alert() aquí, el error muere aquí y el modal piensa que todo salió bien y se cierra.
      throw error; 
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta joya?')) {
      setIsLoading(true);
      try {
        const updatedList = await deleteProduct(id);
        setProducts(updatedList);
      } catch (error) {
        alert("Error eliminando producto");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  };

  const openWhatsApp = (product: Product) => {
    // Replace this number with the owner's WhatsApp number
    const phoneNumber = "573001234567"; 
    
    const priceFormatted = formatPrice(product.price);

    // Construimos un mensaje detallado para que el vendedor sepa exactamente qué es
    let message = `Hola Accesorios El Duende, estoy interesado en este producto:\n\n`;
    message += `🏷️ *Producto:* ${product.name}\n`;
    message += `🔑 *Referencia:* ${product.reference}\n`;
    message += `💰 *Precio:* ${priceFormatted}\n`;

    // Si la imagen es una URL web (ej. cuando tengas el VPS), la adjuntamos al texto.
    // Si es Base64 (data:image...), es muy larga para enviarla por URL, así que la omitimos.
    if (product.imageUrl && product.imageUrl.startsWith('http')) {
       message += `\n🖼️ *Ver foto:* ${product.imageUrl}`;
    }

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.reference.toLowerCase().includes(search.toLowerCase())
  );

  // --- VIEWS ---

  const renderNavbar = () => (
    <nav className="sticky top-0 z-40 glass-nav text-white shadow-xl border-b border-duende-gold/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* LEFT: Spacer */}
          <div className="w-1/4 sm:w-1/3"></div>

          {/* CENTER: Logo */}
          <div 
            className="w-1/2 sm:w-1/3 flex flex-col items-center justify-center cursor-pointer group" 
            onClick={() => setView('gallery')}
          >
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-duende-gold bg-duende-dark p-0.5 overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.5)] group-hover:scale-110 transition-transform duration-500 ease-out mb-1">
              <img 
                src="https://placehold.co/100x100/0f392b/d4af37?text=AD" 
                alt="Logo" 
                className="w-full h-full object-cover rounded-full" 
              />
            </div>
            <h1 className="text-lg sm:text-xl font-serif font-bold text-duende-gold tracking-widest drop-shadow-md text-center leading-none whitespace-nowrap">
              EL DUENDE
            </h1>
          </div>
          
          {/* RIGHT: Actions */}
          <div className="w-1/4 sm:w-1/3 flex items-center justify-end gap-3">
            {view === 'admin' ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-xs text-duende-goldLight hidden md:block border border-duende-gold/30 px-3 py-1 rounded-full bg-black/20">
                  Modo Admin
                </span>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-duende-gold/20 hover:text-duende-gold px-2 sm:px-4" 
                  onClick={handleLogout} 
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline ml-2">Salir</span>
                </Button>
              </div>
            ) : (
              <Button 
                variant="primary" 
                className="bg-duende-gold text-duende-dark hover:bg-white hover:text-duende-dark font-bold text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2" 
                onClick={() => setView('login')} 
              >
                <Lock size={16} />
                <span className="hidden sm:inline ml-2">Dueños</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderFooter = () => (
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

  const renderLogin = () => (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-duende-cream relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
         <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-duende-green rounded-full blur-3xl"></div>
         <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-duende-gold rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-duende-gold/20 relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-duende-dark rounded-full flex items-center justify-center text-duende-gold mx-auto mb-6 shadow-lg border-2 border-duende-gold">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-duende-dark">Portal Dueños</h2>
          <p className="text-gray-500 text-sm mt-3">Ingresa tus credenciales para gestionar el catálogo</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <Input 
            label="Usuario" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white"
          />
          <Input 
            label="Contraseña" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white"
          />
          
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-xs text-blue-700 flex items-start gap-2">
            <Zap size={14} className="mt-0.5 flex-shrink-0" />
            <p><strong>Demo Login:</strong> Usuario: <code>admin</code> / Contraseña: <code>admin</code></p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2 animate-pulse">
              <span className="font-bold">Error:</span> {authError}
            </div>
          )}
          
          <Button type="submit" className="w-full text-lg py-3 shadow-duende-green/30">Entrar</Button>
        </form>
        
        <div className="mt-8 text-center border-t border-gray-100 pt-4">
          <button onClick={() => setView('gallery')} className="text-sm text-duende-dark hover:text-duende-green font-medium transition-colors">
            ← Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );

  const renderGallery = () => (
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
                className="relative h-64 overflow-hidden bg-gray-100 cursor-zoom-in"
                onClick={() => setViewingImage(product.imageUrl)}
              >
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
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
                    className="w-full bg-duende-green hover:bg-green-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transform active:scale-95"
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

  const renderAdmin = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-duende-dark">Panel de Control</h2>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Administra el inventario de la tienda.</p>
        </div>
        <Button onClick={openCreateModal} icon={<Plus size={20} />} className="shadow-lg shadow-duende-gold/20 bg-duende-dark text-white border-none hover:bg-black w-full sm:w-auto">
          Nuevo Producto
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-duende-dark text-white">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Producto</th>
                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Ref</th>
                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Precio</th>
                <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                   <td colSpan={4} className="px-6 py-20 text-center">
                     <Loader2 className="w-8 h-8 text-duende-gold animate-spin mx-auto" />
                   </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-duende-cream/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200 group-hover:border-duende-gold transition-colors">
                         <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm md:text-base font-bold text-gray-900 font-serif">{product.name}</div>
                        <div className="text-xs text-gray-500 max-w-[150px] md:max-w-[200px] truncate">{product.features}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-duende-dark font-mono font-medium">
                     <span className="bg-gray-50 px-2 py-1 rounded-md">{product.reference}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-duende-dark">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-2 text-duende-dark hover:bg-duende-gold/20 rounded-lg transition-colors border border-transparent hover:border-duende-gold/30"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <Search size={40} className="mb-2 opacity-20" />
                      <p>No hay productos. ¡Agrega el primero!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-duende-cream font-sans selection:bg-duende-gold selection:text-white flex flex-col">
      {renderNavbar()}
      
      <main className="flex-grow">
        {view === 'gallery' && renderGallery()}
        {view === 'login' && renderLogin()}
        {view === 'admin' && renderAdmin()}
      </main>

      {view === 'gallery' && renderFooter()}

      {/* Lightbox Modal */}
      {viewingImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in cursor-pointer"
          onClick={() => setViewingImage(null)}
        >
          <button 
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white transition-colors p-2"
            onClick={() => setViewingImage(null)}
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <img 
            src={viewingImage} 
            alt="Full view" 
            className="max-w-full max-h-[80vh] md:max-h-[90vh] rounded-lg shadow-2xl object-contain animate-slide-up"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={editingProduct}
      />
    </div>
  );
};

export default App;