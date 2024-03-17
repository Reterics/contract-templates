import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AuthProvider from './store/AuthContext.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignInComponent from "./components/SignIn.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <BrowserRouter>
          <AuthProvider>
              <Routes>
                  <Route path="/" element={<App />}/>
                  <Route path="/signin" element={<SignInComponent />}/>
              </Routes>
          </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>,
)
