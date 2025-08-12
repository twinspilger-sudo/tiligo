import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Subscribe } from './pages/Subscribe';
import { Dashboard } from './pages/Dashboard';
import { Success } from './pages/Success';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/success" 
            element={
              <ProtectedRoute>
                <Success />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/subscribe" 
            element={
              <ProtectedRoute>
                <Subscribe />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;