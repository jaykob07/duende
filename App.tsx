import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
    <div className="min-h-screen bg-duende-cream font-sans selection:bg-duende-gold selection:text-white flex flex-col">
      <Navbar view={view} setView={setView} handleLogout={handleLogout} />
      
      <main className="flex-grow">
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