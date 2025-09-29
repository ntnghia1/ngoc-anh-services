import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import './index.css'
import './translator'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
    <Suspense fallback={<div style={{padding:16}}>Loading…</div>}>
      <App />
    </Suspense>
  </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
)
