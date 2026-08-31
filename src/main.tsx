import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[HouseVault ErrorBoundary caught error]:', error, errorInfo);
  }

  handleResetCache = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#1c1917',
          color: '#f5f5f4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: '#292524',
            border: '1px solid #44403c',
            borderRadius: '24px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#ffffff' }}>
              HouseVault Loading Recovery
            </h1>
            <p style={{ fontSize: '13px', color: '#a8a29e', marginBottom: '20px', lineHeight: '1.5' }}>
              The application encountered a startup sync issue. Click below to reload or reset cached local data.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#10b981',
                  color: '#0c0a09',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                🔄 Reload App
              </button>
              <button
                onClick={this.handleResetCache}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#44403c',
                  color: '#f5f5f4',
                  fontWeight: '600',
                  fontSize: '13px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                🧹 Reset Cache
              </button>
            </div>
            {this.state.error && (
              <pre style={{
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#1c1917',
                borderRadius: '12px',
                fontSize: '11px',
                color: '#f87171',
                textAlign: 'left',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
