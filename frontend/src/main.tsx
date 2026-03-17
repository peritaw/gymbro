import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });
import './index.css'

window.addEventListener('error', (e) => {
  document.body.innerHTML += `<div style="background:red;color:white;padding:20px;z-index:9999;position:absolute;top:0;left:0;right:0;"><b>Runtime Error:</b> ${e.message}<br/>${e.filename}:${e.lineno}</div>`;
});

window.addEventListener('unhandledrejection', (e) => {
  document.body.innerHTML += `<div style="background:orange;color:white;padding:20px;z-index:9999;position:absolute;top:0;left:0;right:0;"><b>Promise Rejection:</b> ${e.reason}</div>`;
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
