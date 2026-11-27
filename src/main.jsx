import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';
import App from './App.jsx';

const root = document.getElementById('root');
const initialDataElement = document.getElementById('__AFC_INITIAL_DATA__');
let initialData;
try {
  initialData = initialDataElement ? JSON.parse(initialDataElement.textContent) : undefined;
} catch {
  initialData = undefined;
}

const application = (
  <React.StrictMode>
    <BrowserRouter>
      <App initialData={initialData} />
    </BrowserRouter>
  </React.StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, application);
} else {
  createRoot(root).render(application);
}
