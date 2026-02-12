import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'

// Remove max-width constraint from root for full-width modern layout
const rootStyle = document.createElement('style');
rootStyle.textContent = `
  #root {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  * {
    box-sizing: border-box;
  }
`;
document.head.appendChild(rootStyle);

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
