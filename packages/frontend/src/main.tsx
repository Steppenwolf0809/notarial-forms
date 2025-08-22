import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ClientFormView from './components/client/ClientFormView.tsx'
import TramitesQueue from './components/TramitesQueue'

const params = new URLSearchParams(window.location.search)
const accessId = params.get('form')
const path = window.location.pathname

// Determine which component to render
const getComponent = () => {
  if (accessId) {
    return <ClientFormView accessId={accessId} />
  } else if (path === '/tramites') {
    return <TramitesQueue />
  } else {
    return <App />
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {getComponent()}
  </React.StrictMode>,
)