import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CallContract from './CallContract';
import Contador from './Contador';
import ReactAxios from './ReactAxios'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Contador />
    <ReactAxios />
    <CallContract />
  </React.StrictMode>
);