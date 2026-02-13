import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            fontSize: '14px',
            padding: '12px 20px',
            borderRadius: '8px',
          },
          success: {
            style: {
              background: '#C41E3A',
            },
          },
          error: {
            style: {
              background: '#8B0000',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
