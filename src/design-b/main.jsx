import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DesignSwitch from '../components/DesignSwitch.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <DesignSwitch current="b" />
  </StrictMode>,
)
