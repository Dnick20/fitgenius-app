import React from 'react';

export const GlassCard = ({ 
  children, 
  className = '', 
  intensity = 'normal',
  hover = true,
  onClick = null,
  style = {}
}) => {
  const intensityClass = {
    subtle: 'glass-subtle',
    normal: 'glass',
    strong: 'glass-strong',
    dark: 'glass-dark'
  }[intensity] || 'glass';

  return (
    <div 
      className={`
        ${intensityClass} 
        rounded-2xl 
        p-6
        ${hover ? 'glass-hover glass-transition' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export const GlassButton = ({ 
  children, 
  onClick, 
  variant = 'default',
  size = 'medium',
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const variants = {
    default: 'glass-btn',
    primary: 'glass-btn-primary',
    secondary: 'glass-btn glass-subtle'
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} 
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const GlassInput = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  name,
  id,
  required = false,
  disabled = false
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      id={id}
      required={required}
      disabled={disabled}
      className={`glass-input ${className}`}
    />
  );
};

export const GlassModal = ({
  isOpen,
  onClose,
  children,
  title,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 glass-overlay z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className={`glass-modal max-w-lg w-full p-6 ${className}`}>
          {title && (
            <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
          )}
          {children}
        </div>
      </div>
    </>
  );
};

export default GlassCard;