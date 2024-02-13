import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a root for rendering React elements
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// Render the App component inside a StrictMode for additional checks and warnings
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Report web vitals for performance monitoring
reportWebVitals();
