import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CallContract from './pages/minter';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <CallContract />
  </React.StrictMode>
);