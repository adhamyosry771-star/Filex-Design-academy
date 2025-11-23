
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-indigo-600 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 border border-white/10",
    secondary: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white shadow-lg shadow-pink-500/20 border border-white/10",
    outline: "border border-slate-300 dark:border-white/20 hover:border-primary hover:text-primary text-slate-600 dark:text-slate-300 bg-transparent backdrop-blur-sm",
    ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
    glass: "bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 backdrop-blur-md text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 shadow-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 ml-2 animate-spin" />}
      {!isLoading && icon && <span className="ml-2">{icon}</span>}
      {children}
    </button>
  );
};
