import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWithAuth from './AppWithAuth.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'
import './styles/glass.css'

// Determine which app to use based on environment variable
const appMode = import.meta.env.VITE_APP_MODE || 'production';
const isDevelopment = appMode === 'development';

// Lazy load SimpleApp only in development for testing
const SimpleApp = isDevelopment 
  ? React.lazy(() => import('./SimpleApp.jsx'))
  : null;

// Use SimpleApp only if explicitly set in development
const useSimpleApp = isDevelopment && import.meta.env.VITE_USE_SIMPLE_APP === 'true';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      {useSimpleApp && SimpleApp ? (
        <React.Suspense fallback={<div>Loading...</div>}>
          <SimpleApp />
        </React.Suspense>
      ) : (
        <AppWithAuth />
      )}
    </ErrorBoundary>
  </React.StrictMode>,
)