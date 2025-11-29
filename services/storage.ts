import { Product } from '../types';

const STORAGE_KEY = 'duende_inventory';

// CAMBIAR AQUI: Pon la IP de tu VPS cuando tengas el backend corriendo
// Ejemplo: const API_URL = 'http://123.45.67.89:3001/api/products';
const API_URL = 'http://localhost:3001/api/products'; 

// VARIABLE PARA ACTIVAR MODO BASE DE DATOS
// false = Usa localStorage (Demo actual)
// true = Intenta conectar a la API (Cuando tengas el VPS listo)
const USE_DATABASE = false;

// Initial Mock Data
const INITIAL_DATA: Product[] = [
  {
    id: '1',
    name: 'Anillo Esmeralda Eterna',
    reference: 'RNG-001',
    price: 1250000,
    features: 'Oro de 18k, Esmeralda natural colombiana, corte cuadrado, acabado pulido.',
    imageUrl: 'https://picsum.photos/id/21/500/500',
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Collar Bosque Encantado',
    reference: 'NCK-042',
    price: 850000,
    features: 'Plata ley 925, incrustaciones de jade, diseño minimalista de hojas.',
    imageUrl: 'https://picsum.photos/id/106/500/500',
    createdAt: Date.now() - 100000,
  }
];

// --- MÉTODOS LOCALES (Simulación) ---

const getProductsLocal = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(data);
};

// --- MÉTODOS PÚBLICOS (Interfaz Async para preparar conexión a DB) ---

export const getProducts = async (): Promise<Product[]> => {
  if (USE_DATABASE) {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error fetching data');
      return await response.json();
    } catch (error) {
      console.error("Error conectando a la BD:", error);
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
      // Nota: Aquí deberías diferenciar entre POST (Crear) y PUT (Editar)
      // Para simplificar el ejemplo, asumimos que el backend maneja "upsert" o simplemente creamos
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      // Después de guardar, recargamos todos los productos
      return await getProducts();
    } catch (error) {
      console.error("Error guardando en BD:", error);
      throw error;
    }
  } else {
    return new Promise((resolve) => {
      const current = getProductsLocal();
      const index = current.findIndex(p => p.id === product.id);
      
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
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      return await getProducts();
    } catch (error) {
      console.error("Error eliminando en BD:", error);
      throw error;
    }
  } else {
    return new Promise((resolve) => {
      const current = getProductsLocal();
      const updated = current.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setTimeout(() => resolve(updated), 300);
    });
  }
};