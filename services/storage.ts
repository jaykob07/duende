import { Product } from '../types';

const STORAGE_KEY = 'duende_inventory';

// CAMBIAR AQUI: Pon la IP de tu VPS cuando tengas el backend corriendo
// Ejemplo: const API_URL = 'http://45.12.34.56:3001/api/products';
const API_URL = 'http://localhost:3001/api/products'; 

// VARIABLE PARA ACTIVAR MODO BASE DE DATOS
// false = Usa localStorage (Demo actual)
// true = Intenta conectar a la API (Cuando hayas hecho los pasos del Backend)
const USE_DATABASE = false; 

// Initial Mock Data
const INITIAL_DATA: Product[] = [
  {
    id: '1',
    name: 'Anillo Esmeralda Eterna',
    reference: 'RNG-001',
    price: 1250000,
    features: 'Oro de 18k, Esmeralda natural colombiana, corte cuadrado, acabado pulido.',
    imageUrl: 'https://placehold.co/500x500/0f392b/d4af37?text=Anillo',
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Collar Bosque Encantado',
    reference: 'NCK-042',
    price: 850000,
    features: 'Plata ley 925, incrustaciones de jade, diseño minimalista de hojas.',
    imageUrl: 'https://placehold.co/500x500/0f392b/d4af37?text=Collar',
    createdAt: Date.now() - 100000,
  }
];

// --- MÉTODOS LOCALES (Simulación) ---

const getProductsLocal = (): Product[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
      return INITIAL_DATA;
    }
    const parsed = JSON.parse(data);
    // Auto-repair IDs if missing (legacy data fix)
    let needsFix = false;
    const fixed = parsed.map((p: any) => {
        if (!p.id) {
            needsFix = true;
            return { ...p, id: Date.now().toString(36) + Math.random().toString(36).substr(2) };
        }
        return p;
    });
    if (needsFix) localStorage.setItem(STORAGE_KEY, JSON.stringify(fixed));
    return fixed;
  } catch (e) {
    console.error("Error reading local storage", e);
    return INITIAL_DATA;
  }
};

// --- MÉTODOS PÚBLICOS (Interfaz para Frontend) ---

export const getProducts = async (): Promise<Product[]> => {
  if (USE_DATABASE) {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Error del servidor: ${response.statusText}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error conectando a la BD:", error);
      // Fallback opcional o re-lanzar error para mostrar en UI
      return []; 
    }
  } else {
    // Simula retardo de red
    return new Promise((resolve) => {
      setTimeout(() => resolve(getProductsLocal()), 300);
    });
  }
};

export const saveProduct = async (product: Product): Promise<Product[]> => {
  if (USE_DATABASE) {
    try {
      // Enviamos el producto al backend (Node.js + Postgres)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        // Intentamos leer el mensaje de error del backend (ej: "Referencia duplicada")
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al guardar en el servidor');
      }

      // Después de guardar exitosamente, pedimos la lista actualizada
      return await getProducts();
    } catch (error) {
      console.error("Error guardando en BD:", error);
      throw error; // Lanzamos el error para que el Modal lo muestre en rojo
    }
  } else {
    // LÓGICA LOCAL (LocalStorage)
    return new Promise((resolve, reject) => {
      const current = getProductsLocal();
      
      // VALIDACIÓN DE DUPLICADOS
      const duplicate = current.find(p => 
        p.reference.toLowerCase().trim() === product.reference.toLowerCase().trim() && 
        String(p.id) !== String(product.id)
      );

      if (duplicate) {
        reject(new Error(`La referencia "${product.reference}" ya existe.`));
        return;
      }

      const index = current.findIndex(p => String(p.id) === String(product.id));
      
      let updated;
      if (index >= 0) {
        updated = [...current];
        updated[index] = product;
      } else {
        updated = [product, ...current];
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setTimeout(() => resolve(updated), 300);
    });
  }
};

export const deleteProduct = async (id: string): Promise<Product[]> => {
  if (USE_DATABASE) {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('No se pudo eliminar en el servidor');
      return await getProducts();
    } catch (error) {
      console.error("Error eliminando en BD:", error);
      throw error;
    }
  } else {
    // LÓGICA LOCAL
    return new Promise((resolve) => {
      const current = getProductsLocal();
      // String conversion safety
      const updated = current.filter(p => String(p.id) !== String(id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setTimeout(() => resolve(updated), 300);
    });
  }
};