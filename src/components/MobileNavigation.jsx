import React, { useState } from 'react';
import { Menu, X, Home, Activity, Utensils, TrendingUp, User, ShoppingCart } from 'lucide-react';

const MobileNavigation = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'workouts', label: 'Workouts', icon: Activity },
    { id: 'meals', label: 'Meals', icon: Utensils },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'grocery', label: 'Grocery', icon: ShoppingCart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigation = (pageId) => {
    onNavigate(pageId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/20">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
            FitGenius
          </h1>
          <button
            onClick={toggleMenu}
            className="p-2 text-white hover:text-orange-400 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm">
          <div className="fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/20">
            <nav className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 min-h-[44px] ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-black/95 backdrop-blur-xl border-t border-white/20" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <nav className="flex justify-around py-2">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 min-h-[44px] justify-center ${
                  isActive ? 'text-orange-400' : 'text-gray-400 hover:text-gray-200'
                }`}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5 mb-1 flex-shrink-0" />
                <span className="text-xs font-medium truncate leading-none">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Spacer for fixed bottom navigation */}
      <div className="lg:hidden h-20" />
    </>
  );
};

export default MobileNavigation;