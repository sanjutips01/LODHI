import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hide the pre-loader once the app is mounted
const loader = document.getElementById('loader');
if (loader) {
  // Give a little time for content to paint
  setTimeout(() => {
    loader.style.opacity = '0';
    // Remove from DOM after transition
    setTimeout(() => loader.remove(), 500);
  }, 200);
}