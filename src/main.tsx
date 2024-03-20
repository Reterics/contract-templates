import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AuthProvider from './store/AuthContext.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignInComponent from "./components/SignIn.tsx";
import Templates from "./Templates.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <BrowserRouter>
          <AuthProvider>
              <Routes>
                  <Route path="/" element={<App />}/>
                  <Route path="/signin" element={<SignInComponent />}/>
                  <Route path="/templates" element={<Templates />}/>
              </Routes>
          </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>,
)
