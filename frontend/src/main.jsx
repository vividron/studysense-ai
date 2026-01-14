import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/authContext'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Toaster position='top-right' toastOptions={{ duration: 3000, style: {backgroundColor: 'var(--bg-surface)', color: "white", border: "2px solid grey"} }} />
    <App />
  </AuthProvider>
)
