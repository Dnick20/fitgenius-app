import React from 'react';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  Calendar, 
  TrendingUp, 
  ShoppingCart 
} from 'lucide-react';

const GlassNavigation = ({ currentView, setCurrentView }) => {
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'workouts', label: 'Workouts', icon: Dumbbell },
    { key: 'meals', label: 'Meals', icon: Utensils },
    { key: 'weekly-plan', label: 'Weekly Plan', icon: Calendar },
    { key: 'progress', label: 'Progress', icon: TrendingUp },
    { key: 'grocery-list', label: 'Grocery List', icon: ShoppingCart }
  ];

  return (
    <div className="hidden md:flex items-center space-x-1">
      {navItems.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setCurrentView(key)}
          className={`
            px-3 py-2 rounded-xl font-medium transition-all duration-200
            flex items-center space-x-2 relative backdrop-blur-md
            ${currentView === key 
              ? 'bg-white text-gray-900 shadow-lg shadow-white/25 transform scale-105 border border-white/20' 
              : 'text-white bg-black/30 hover:text-white hover:bg-white/20 border border-white/20 shadow-lg'
            }
          `}
          style={{
            boxShadow: currentView === key ? '0 0 20px rgba(255,255,255,0.3)' : 'none'
          }}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden lg:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default GlassNavigation;