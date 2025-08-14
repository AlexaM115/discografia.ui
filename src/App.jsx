import './App.css'

import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'


import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoutes'
import PublicRoute from './components/PublicRoute'

import Dashboard from './components/Dashboard'
import LoginScreen from './components/LoginScreen'
import SignupScreen from './components/SignupScreen'
import ArtistTypesList from './components/ArtistTypeList'
import ArtistsList from './components/ArtistList'



function App() {


  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta por defecto que redirige al login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route
              path='/login'
              element={
                <PublicRoute>
                  <LoginScreen />
                </PublicRoute>
              }
            />

            <Route
              path='/signup'
              element={
                <PublicRoute>
                  <SignupScreen />
                </PublicRoute>
              }
            />

            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path='/artist-types'
              element={
                <ProtectedRoute>
                  <ArtistTypesList />
                </ProtectedRoute>
              }
            />

            <Route
              path='/artists'
              element={
                <ProtectedRoute>
                  <ArtistsList />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App