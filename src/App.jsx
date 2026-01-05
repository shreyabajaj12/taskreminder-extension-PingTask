import React, { useState, useEffect } from 'react'
import Home from './components/Home'
import Login from './components/Login'
import {  Route, Routes, Navigate } from 'react-router-dom'
import { supabase } from './supabase-client'
import './App.css'

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  if (loading) return null;
  return (
    <Routes>
      <Route path='/' element={session ? <Navigate to="/home" /> : <Login />} />
      <Route
        path="/home"
        element={session ? <Home /> : <Navigate to="/" replace />}
      />
      <Route
        path="*"
        element={<Navigate to={session ? "/home" : "/"} replace />}
      />
      </Routes>
  )
}

export default App
