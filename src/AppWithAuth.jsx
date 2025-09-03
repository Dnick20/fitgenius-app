import React, { useState, useEffect } from 'react';
import { isAuthenticated, getAuthUser, signOut } from './services/auth';
import LandingPage from './components/LandingPage';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Meals from './pages/Meals';
import Progress from './pages/Progress';
import Settings from './components/Settings';
import WeeklyPlan from './components/WeeklyPlan';
import GroceryList from './pages/GroceryList';
import { LogOut, Settings as SettingsIcon, User as UserIcon } from 'lucide-react';

const AppWithAuth = () => {
  const [authState, setAuthState] = useState('loading'); // loading, landing, signin, signup, authenticated
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      const user = getAuthUser();
      setCurrentUser(user);
      setAuthState('authenticated');
    } else {
      setAuthState('landing');
    }
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setAuthState('authenticated');
    setCurrentView('dashboard');
  };

  const handleSignOut = () => {
    signOut();
    setCurrentUser(null);
    setAuthState('landing');
    setCurrentView('dashboard');
  };

  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const handleGetStarted = () => {
    setAuthState('signup');
  };

  const handleSignInClick = () => {
    setAuthState('signin');
  };

  const handleSignUpClick = () => {
    setAuthState('signup');
  };

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (authState === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (authState === 'signin') {
    return (
      <SignIn
        onSuccess={handleAuthSuccess}
        onSignUpClick={handleSignUpClick}
      />
    );
  }

  if (authState === 'signup') {
    return (
      <SignUp
        onSuccess={handleAuthSuccess}
        onSignInClick={handleSignInClick}
      />
    );
  }

  // Authenticated user interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Navigation Header */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                <span className="text-lg font-bold text-white">FG</span>
              </div>
              <span className="text-white font-semibold text-lg">FitGenius</span>
            </div>

            <div className="hidden md:flex space-x-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('weekly-plan')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'weekly-plan'
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Weekly Plan
              </button>
              <button
                onClick={() => setCurrentView('workouts')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'workouts'
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Workouts
              </button>
              <button
                onClick={() => setCurrentView('meals')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'meals'
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Meals
              </button>
              <button
                onClick={() => setCurrentView('progress')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'progress'
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Progress
              </button>
              <button
                onClick={() => setCurrentView('grocery-list')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'grocery-list'
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Grocery List
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-white">
                <UserIcon className="w-5 h-5 mr-2" />
                <span className="text-sm">{currentUser?.profile?.name || 'User'}</span>
              </div>
              
              <button
                onClick={() => setCurrentView('settings')}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <Dashboard 
            userProfile={currentUser?.profile} 
            onNavigate={setCurrentView}
          />
        )}
        
        {currentView === 'weekly-plan' && (
          <WeeklyPlan 
            userProfile={currentUser?.profile} 
            onClose={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'workouts' && (
          <Workouts userProfile={currentUser?.profile} />
        )}
        
        {currentView === 'meals' && (
          <Meals userProfile={currentUser?.profile} />
        )}
        
        {currentView === 'progress' && (
          <Progress userProfile={currentUser?.profile} />
        )}
        
        {currentView === 'settings' && (
          <Settings 
            currentUser={currentUser} 
            onProfileUpdate={handleProfileUpdate}
          />
        )}
        
        {currentView === 'grocery-list' && (
          <GroceryList userProfile={currentUser?.profile} />
        )}
      </main>
    </div>
  );
};

export default AppWithAuth;