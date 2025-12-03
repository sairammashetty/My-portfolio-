import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Note: React.StrictMode is great for development as it helps find potential problems.
// For this single-file build, we can wrap it directly.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
