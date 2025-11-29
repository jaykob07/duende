import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Upload, Image as ImageIcon, Trash2, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { Button } from './Button';
import { Input, TextArea } from './Input';
import { generateProductDescription } from '../services/geminiService';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => Promise<void> | void; // Allow async
  initialData?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    reference: '',
    price: 0,
    features: '',
    imageUrl: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSaveError(null); // Clear errors when opening/changing data
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        reference: '',
        price: 0,
        features: '',
        imageUrl: '',
      });
    }
  }, [initialData, isOpen]);

  // Clear error when user types
  const handleInputChange = (field: keyof Product, value: any) => {
    setSaveError(null);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) return;
    setIsGenerating(true);
    setSaveError(null);
    try {
      const description = await generateProductDescription(formData.name);
      setFormData(prev => ({ ...prev, features: description }));
    } catch (e) {
      alert("Error generating description. Check API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveError(null);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.reference || !formData.price) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
        const product: Product = {
        id: initialData?.id || crypto.randomUUID(),
        name: formData.name,
        reference: formData.reference,
        price: Number(formData.price),
        features: formData.features || '',
        imageUrl: formData.imageUrl || `https://placehold.co/500x500/0f392b/d4af37?text=Sin+Imagen`,
        createdAt: initialData?.createdAt || Date.now(),
        };
        await onSave(product);
        onClose();
    } catch (error: any) {
        console.error("Failed to save", error);
        // Show error message in the modal
        setSaveError(error.message || "Error al guardar el producto.");
    } finally {
        setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-duende-cream sticky top-0 z-10">
          <h2 className="text-2xl font-serif text-duende-dark font-bold">
            {initialData ? 'Editar Joya' : 'Nueva Joya'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-duende-dark transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input 
            label="Nombre del Producto" 
            placeholder="Ej. Anillo Solitario"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            required
            disabled={isSaving}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Referencia" 
              placeholder="REF-000"
              value={formData.reference}
              onChange={e => handleInputChange('reference', e.target.value)}
              required
              disabled={isSaving}
              error={saveError && saveError.includes('referencia') ? 'Referencia duplicada' : undefined}
            />
            <Input 
              label="Precio (COP)" 
              type="number"
              placeholder="0"
              value={formData.price === 0 ? '' : formData.price}
              onChange={e => handleInputChange('price', e.target.value === '' ? 0 : parseFloat(e.target.value))}
              required
              disabled={isSaving}
            />
          </div>

          <div className="relative">
             <TextArea 
              label="Características / Descripción" 
              rows={3}
              placeholder="Descripción del producto..."
              value={formData.features}
              onChange={e => handleInputChange('features', e.target.value)}
              disabled={isSaving}
            />
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGenerating || isSaving || !formData.name}
              className="absolute right-2 top-8 text-xs flex items-center gap-1 text-duende-gold hover:text-duende-dark transition-colors disabled:opacity-30"
              title="Generar con IA"
            >
              <Sparkles size={14} />
              {isGenerating ? 'Generando...' : 'Autocompletar con IA'}
            </button>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 font-sans">Imagen del Producto</label>
            
            {!formData.imageUrl ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-duende-gold hover:bg-duende-cream/50 transition-colors group"
                onClick={() => !isSaving && fileInputRef.current?.click()}
              >
                <div className="bg-gray-100 p-3 rounded-full group-hover:bg-white group-hover:shadow-md transition-all">
                  <Upload className="text-gray-400 group-hover:text-duende-gold" size={24} />
                </div>
                <p className="mt-2 text-sm text-gray-500 font-medium">Clic para subir imagen</p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP (Max 5MB)</p>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSaving}
                    className="p-2 bg-white rounded-full text-duende-dark hover:bg-duende-gold hover:text-white transition-colors"
                    title="Cambiar imagen"
                   >
                     <ImageIcon size={20} />
                   </button>
                   <button 
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isSaving}
                    className="p-2 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    title="Eliminar imagen"
                   >
                     <Trash2 size={20} />
                   </button>
                </div>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isSaving}
            />
          </div>

          {/* ERROR DISPLAY */}
          {saveError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-2 animate-pulse">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving} className="flex-1">Cancelar</Button>
            <Button type="submit" isLoading={isSaving} className="flex-1">Guardar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};