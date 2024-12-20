import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

import '@radix-ui/themes/styles.css';
import './styles/select.css'
import './styles/controls.css'

const root = document.getElementById('root')

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}