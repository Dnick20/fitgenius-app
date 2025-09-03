import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-lg w-full text-white">
            <div className="text-center">
              <svg
                className="mx-auto h-16 w-16 text-red-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              
              <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
              <p className="text-gray-300 mb-6">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mb-6 bg-black/20 rounded-lg p-4">
                  <summary className="cursor-pointer text-sm text-gray-400 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs text-red-400 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Reload App
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="bg-white/10 px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;