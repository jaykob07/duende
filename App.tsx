import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { Product, ViewState } from './types';
import { getProducts, saveProduct, deleteProduct } from './services/storage';
import { ProductModal } from './components/ProductModal';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GalleryView } from './views/GalleryView';
import { LoginView } from './views/LoginView';
import { AdminView } from './views/AdminView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('gallery');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Auth State (Minimal state at App level)
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

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setView('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('gallery');
  };

  const handleSaveProduct = async (product: Product) => {
    try {
      const updatedList = await saveProduct(product);
      setProducts(updatedList);
      setEditingProduct(null);
    } catch (error) {
      throw error; 
    }
  };

  const handleDeleteProduct = async (id: string) => {
    // Safety check
    if (!id) {
        alert("Error: ID de producto no válido.");
        return;
    }

    if (window.confirm('¿Estás seguro de eliminar esta joya permanentemente?')) {
      setIsLoading(true);
      try {
        const updatedList = await deleteProduct(id);
        setProducts(updatedList);
      } catch (error) {
        console.error(error);
        alert("Error eliminando producto. Intenta recargar la página.");
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

  return (
    // CAMBIO: Estructura Grid en lugar de Flex
    <div className="min-h-screen bg-duende-cream font-sans selection:bg-duende-gold selection:text-white grid grid-rows-[auto_1fr_auto]">
      <Navbar view={view} setView={setView} handleLogout={handleLogout} />
      
      <main className="w-full relative">
        {view === 'gallery' && (
          <GalleryView 
            products={products} 
            isLoading={isLoading} 
            onViewImage={setViewingImage} 
          />
        )}
        
        {view === 'login' && (
          <LoginView 
            onLoginSuccess={handleLoginSuccess} 
            onBack={() => setView('gallery')} 
          />
        )}
        
        {view === 'admin' && (
          <AdminView 
            products={products} 
            isLoading={isLoading} 
            onCreate={openCreateModal}
            onEdit={openEditModal}
            onDelete={handleDeleteProduct}
          />
        )}
      </main>

      {view === 'gallery' && <Footer />}

      {/* Floating WhatsApp Button (Solo visible en Galería) */}
      {view === 'gallery' && (
        <a 
          href="https://wa.me/573001234567?text=Hola,%20quisiera%20más%20información%20sobre%20sus%20accesorios."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl hover:bg-green-700 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          title="Chat general"
        >
          <MessageCircle size={28} className="fill-current" />
          {/* Tooltip on hover */}
          <span className="absolute right-full mr-3 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            ¡Escríbenos!
          </span>
        </a>
      )}

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