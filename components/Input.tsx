import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">{label}</label>
      <input
        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-duende-gold focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 font-sans ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">{label}</label>
      <textarea
        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-duende-gold focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 font-sans ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};