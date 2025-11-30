import React from 'react';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import { Product } from '../types';
import { Button } from '../components/Button';

interface AdminViewProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ products, isLoading, onEdit, onDelete, onCreate }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-duende-dark">Panel de Control</h2>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Administra el inventario de la tienda.</p>
        </div>
        <Button onClick={onCreate} icon={<Plus size={20} />} className="shadow-lg shadow-duende-gold/20 bg-duende-dark text-white border-none hover:bg-black w-full sm:w-auto">
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
                      <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200 group-hover:border-duende-gold transition-colors p-1">
                         <img src={product.imageUrl} alt="" className="h-full w-full object-contain" />
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
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(product);
                        }}
                        className="p-2 text-duende-dark hover:bg-duende-gold/20 rounded-lg transition-colors border border-transparent hover:border-duende-gold/30"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(product.id);
                        }}
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
};