#!/usr/bin/env node

// Responsive Design Bot - Phase 5
// Optimizes mobile responsiveness and UX

import fs from 'fs';

class ResponsiveDesignBot {
  constructor() {
    this.botName = 'Responsive Design Bot';
    this.startTime = Date.now();
  }

  async execute() {
    console.log(`🤖 ${this.botName} Starting...`);
    
    try {
      await this.createResponsiveStyles();
      await this.updateMobileComponents();
      
      const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
      console.log(`✅ ${this.botName} completed in ${duration}s`);
      return { success: true, duration };
    } catch (error) {
      console.error(`❌ ${this.botName} failed:`, error.message);
      throw error;
    }
  }

  async createResponsiveStyles() {
    console.log('  📱 Creating responsive design system...');
    
    const responsiveStyles = `/* Mobile-First Responsive Design */

/* Base Mobile Styles */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.responsive-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

/* Tablet Styles */
@media (min-width: 768px) {
  .container {
    padding: 1.5rem;
  }
  
  .responsive-grid {
    gap: 1.5rem;
    grid-template-columns: repeat(2, 1fr);
  }
  
  .responsive-grid.three-col {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop Styles */
@media (min-width: 1024px) {
  .container {
    padding: 2rem;
  }
  
  .responsive-grid {
    gap: 2rem;
    grid-template-columns: repeat(3, 1fr);
  }
  
  .responsive-grid.four-col {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .responsive-grid.three-col {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Mobile Navigation */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem;
  z-index: 50;
}

@media (min-width: 768px) {
  .mobile-nav {
    position: static;
    background: transparent;
    border: none;
    backdrop-filter: none;
  }
}

/* Touch-Friendly Components */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-mobile {
  padding: 1rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
}

/* Modal Responsive */
.modal-mobile {
  position: fixed;
  inset: 0;
  z-index: 50;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.8);
}

.modal-content-mobile {
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  max-height: 90vh;
  overflow-y: auto;
  width: 100%;
  max-width: none;
}

@media (min-width: 768px) {
  .modal-content-mobile {
    max-width: 600px;
    margin: 0 auto;
  }
}

/* Form Responsive */
.form-mobile input,
.form-mobile select,
.form-mobile textarea {
  padding: 1rem;
  font-size: 1rem;
  border-radius: 0.75rem;
  min-height: 44px;
}

/* Card Responsive */
.card-mobile {
  padding: 1rem;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .card-mobile {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

/* Timeline Mobile */
.timeline-mobile {
  padding-left: 1rem;
  border-left: 3px solid;
}

@media (min-width: 768px) {
  .timeline-mobile {
    padding-left: 2rem;
    border-left-width: 4px;
  }
}

/* Text Responsive */
.text-responsive-sm {
  font-size: 0.875rem;
}

.text-responsive-base {
  font-size: 1rem;
}

.text-responsive-lg {
  font-size: 1.125rem;
}

@media (min-width: 768px) {
  .text-responsive-sm {
    font-size: 1rem;
  }
  
  .text-responsive-base {
    font-size: 1.125rem;
  }
  
  .text-responsive-lg {
    font-size: 1.25rem;
  }
}

/* Spacing Mobile */
.space-mobile > * + * {
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .space-mobile > * + * {
    margin-top: 1.5rem;
  }
}

/* Hide/Show Responsive */
.hide-mobile {
  display: none;
}

@media (min-width: 768px) {
  .hide-mobile {
    display: block;
  }
}

.show-mobile {
  display: block;
}

@media (min-width: 768px) {
  .show-mobile {
    display: none;
  }
}`;

    fs.writeFileSync('./src/styles/responsive.css', responsiveStyles);
    console.log('  ✅ Responsive design system created');
  }

  async updateMobileComponents() {
    console.log('  🔧 Updating components for mobile optimization...');
    
    const mobileWrapper = `import React from 'react';

export const MobileOptimizedWrapper = ({ children, className = '' }) => {
  return (
    <div className={\`container space-mobile \${className}\`}>
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
    <div className={\`\${colClass[cols]} \${className}\`}>
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
      className={\`button-mobile touch-target transition-all \${variants[variant]} \${className} disabled:opacity-50\`}
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
};`;

    fs.writeFileSync('./src/components/MobileComponents.jsx', mobileWrapper);
    console.log('  ✅ Mobile-optimized components created');
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const bot = new ResponsiveDesignBot();
  bot.execute().then(() => process.exit(0)).catch(() => process.exit(1));
}

export default ResponsiveDesignBot;