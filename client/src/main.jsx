import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Add loaded class to body when app is ready
document.body.classList.add('loaded');

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
