import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '../css/app.css';

const appElement = document.getElementById('app');
const root = ReactDOM.createRoot(appElement);

root.render(React.createElement(React.StrictMode, null, React.createElement(App)));


