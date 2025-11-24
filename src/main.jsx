import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Version info
const APP_VERSION = '2.2.0'
console.log(`%c🎨 Pro Thumbnail Editor v${APP_VERSION}`, 'color: #6366f1; font-size: 18px; font-weight: bold;')
console.log('%cMade with ❤️ by Reelscode', 'color: #999; font-size: 12px;')
console.log('%chttps://reelscode.com', 'color: #6366f1; font-size: 12px;')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
