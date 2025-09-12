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
import { ThemeProvider, BaseStyles, Button, Box, Text, IconButton } from '@primer/react';
import { GearIcon, SignOutIcon } from '@primer/octicons-react';
import GlassNavigation from './components/navigation/GlassNavigation';
import MobileNav from './components/navigation/MobileNav';

const AppWithAuth = () => {
  const [authState, setAuthState] = useState('loading'); // loading, landing, signin, signup, authenticated
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      const user = getAuthUser();
      // Also check for updated profile in localStorage
      const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      if (Object.keys(savedProfile).length > 0 && user) {
        user.profile = { ...user.profile, ...savedProfile };
      }
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
    <ThemeProvider colorMode="dark">
      <BaseStyles>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Navigation Header */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <MobileNav currentView={currentView} setCurrentView={setCurrentView} />
              
              {/* Logo */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-lg font-bold text-white">FG</span>
                </div>
                <span className="text-white font-semibold text-lg">FitGenius</span>
              </div>
            </div>

            {/* New Glass Navigation */}
            <GlassNavigation currentView={currentView} setCurrentView={setCurrentView} />
            
            {/* Original Primer Navigation - Commented out but kept for rollback */}
            {/* <Box className="hidden md:flex" sx={{ gap: 2 }}>
              <Button
                variant={currentView === 'dashboard' ? 'primary' : 'invisible'}
                size="small"
                onClick={() => setCurrentView('dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant={currentView === 'workouts' ? 'primary' : 'invisible'}
                size="small"
                onClick={() => setCurrentView('workouts')}
              >
                Workouts
              </Button>
              <Button
                variant={currentView === 'meals' ? 'primary' : 'invisible'}
                size="small"
                onClick={() => setCurrentView('meals')}
              >
                Meals
              </Button>
              <Button
                variant={currentView === 'weekly-plan' ? 'primary' : 'invisible'}
                size="small"
                onClick={() => setCurrentView('weekly-plan')}
              >
                Weekly Plan
              </Button>
              <Button
                variant={currentView === 'progress' ? 'primary' : 'invisible'}
                size="small"
                onClick={() => setCurrentView('progress')}
              >
                Progress
              </Button>
              <Button
                variant={currentView === 'grocery-list' ? 'primary' : 'invisible'}
                size="small"
                onClick={() => setCurrentView('grocery-list')}
              >
                Grocery List
              </Button>
            </Box> */}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'fg.default' }}>
                <UserIcon className="w-5 h-5 mr-2" />
                <Text fontSize={1}>{currentUser?.profile?.name || 'User'}</Text>
              </Box>
              
              <IconButton
                aria-label="Settings"
                icon={GearIcon}
                variant="invisible"
                onClick={() => setCurrentView('settings')}
              />
              
              <IconButton
                aria-label="Sign Out"
                icon={SignOutIcon}
                variant="invisible"
                onClick={handleSignOut}
              />
            </Box>
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
      </BaseStyles>
    </ThemeProvider>
  );
};

export default AppWithAuth;