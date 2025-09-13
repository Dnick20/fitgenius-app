import React from 'react';

export const MobileOptimizedWrapper = ({ children, className = '' }) => {
  return (
    <div className={`container space-mobile ${className}`}>
      {children}
    </div>
  );
};

export const ResponsiveGrid = ({ children, cols = 'default', className = '' }) => {
  const colClass = {
    default: 'responsive-grid',
    three: 'responsive-grid three-col',
    four: 'responsive-grid four-col'
  };

  return (
    <div className={`${colClass[cols]} ${className}`}>
      {children}
    </div>
  );
};

export const MobileModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-mobile">
      <div className="modal-content-mobile">
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="touch-target text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export const TouchFriendlyButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = '' 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white',
    secondary: 'bg-white/10 text-white border border-white/20',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`button-mobile touch-target transition-all ${variants[variant]} ${className} disabled:opacity-50`}
    >
      {children}
    </button>
  );
};

export default {
  MobileOptimizedWrapper,
  ResponsiveGrid,
  MobileModal,
  TouchFriendlyButton
};