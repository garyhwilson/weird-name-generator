import React from 'react'
import { createRoot } from 'react-dom/client'
import '@radix-ui/themes/styles.css'
import { Theme } from '@radix-ui/themes'
import { App } from './App'
import './styles/select.css'
import './styles/controls.css'

const root = document.getElementById('root')

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <Theme>
        <App />
      </Theme>
    </React.StrictMode>
  )
}