// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "boxicons/css/boxicons.min.css";
import Footer from './components/footer.tsx';
;

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <>
   
    <BrowserRouter>
      <App />
    </BrowserRouter>

    </>
  // </StrictMode>
)
