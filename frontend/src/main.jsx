// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// MUI baseline styling
import '@fontsource/roboto/300.css'; // or whichever variant you prefer
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
);
