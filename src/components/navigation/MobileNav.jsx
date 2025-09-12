import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, Dumbbell, Utensils, Calendar, TrendingUp, ShoppingCart } from 'lucide-react';

const MobileNav = ({ currentView, setCurrentView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'workouts', label: 'Workouts', icon: Dumbbell },
    { key: 'meals', label: 'Meals', icon: Utensils },
    { key: 'weekly-plan', label: 'Weekly Plan', icon: Calendar },
    { key: 'progress', label: 'Progress', icon: TrendingUp },
    { key: 'grocery-list', label: 'Grocery List', icon: ShoppingCart }
  ];

  return (
    <>
      {/* Hamburger button - only visible on mobile */}
      <button
        className="md:hidden p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="fixed top-0 left-0 h-full w-72 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-xl z-50 md:hidden transform transition-transform duration-300">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                    <span className="text-lg font-bold text-white">FG</span>
                  </div>
                  <span className="text-white font-semibold text-lg">FitGenius</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Navigation items */}
              <nav className="space-y-2">
                {navItems.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentView(key);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full px-4 py-3 rounded-xl font-medium transition-all duration-200
                      flex items-center space-x-3 text-left
                      ${currentView === key 
                        ? 'bg-white/20 text-white border border-white/40 shadow-lg' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileNav;