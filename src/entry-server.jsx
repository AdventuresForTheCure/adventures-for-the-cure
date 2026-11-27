import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App.jsx';

export function render(url, initialData) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App initialData={initialData} />
      </StaticRouter>
    </React.StrictMode>
  );
}
