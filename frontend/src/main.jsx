import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './store/store.js'
import { GoogleOAuthProvider } from "@react-oauth/google";



ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}> 
    <React.StrictMode>   
      <GoogleOAuthProvider clientId='42993781130-vbhpj9he4ij3s2uf7lerk03o07uf7o9o.apps.googleusercontent.com'>   
        <BrowserRouter>
        <main className="dark text-foreground bg-[#080219]">
          <App />
          <ToastContainer position="top-center"/>
        </main>
        </BrowserRouter>
      </GoogleOAuthProvider> 
    </React.StrictMode>
  </Provider>
)
