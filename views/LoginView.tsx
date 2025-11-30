import React, { useState } from 'react';
import { Lock, Zap } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ViewState } from '../types';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLoginSuccess();
      setAuthError('');
    } else {
      setAuthError('Credenciales incorrectas.');
    }
  };

  return (
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
          <button onClick={onBack} className="text-sm text-duende-dark hover:text-duende-green font-medium transition-colors">
            ← Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};