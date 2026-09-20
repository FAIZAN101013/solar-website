import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import VersionSwitch from '../components/VersionSwitch.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <VersionSwitch current="v1" />
  </StrictMode>,
)
