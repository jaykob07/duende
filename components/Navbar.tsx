import React from 'react';
import { LogOut, Lock } from 'lucide-react';
import { Button } from './Button';
import { ViewState } from '../types';

interface NavbarProps {
  view: ViewState;
  setView: (view: ViewState) => void;
  handleLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ view, setView, handleLogout }) => {
  return (
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
};