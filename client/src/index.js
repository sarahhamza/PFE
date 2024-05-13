import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DarkModeContextProvider } from './context/darkModeContext';
import { PrimeReactProvider } from 'primereact/api';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </DarkModeContextProvider>
  </React.StrictMode>
);