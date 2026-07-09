import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss';
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Site/Home.tsx'
import Dashboard from './Site/Dashboard.tsx'
import Profile from './Site/Profile.tsx'
import ProtectedRoutes from './ProtectedRoutes.tsx';
import { AuthProvider } from './AuthContext.tsx';
import GuestRoutes from './GuestRoutes.tsx';
import { ExpenseProvider } from './Site/hooks/useExpenses.tsx';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ExpenseProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<App />}>


              <Route element={<GuestRoutes />}>
                <Route path='/' element={<Home />} />

              </Route>


              {/* ------------------------------------------------------- Protected Routes Sectction ------------------------------------------------------- */}

              <Route element={<ProtectedRoutes />} >

                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/profile' element={<Profile />} />

              </Route>

              {/* ------------------------------------------------------- Protected Routes Sectction ------------------------------------------------------- */}

            </Route>

          </Routes>
        </BrowserRouter>
      </ExpenseProvider>
    </AuthProvider>
  </React.StrictMode>,
)
