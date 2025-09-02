import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Library from './pages/Library'
import Player from './pages/Player'
import Register from './pages/Register'
import Forgot from './pages/Forgot'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/forgot' element={<Forgot/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/library' element={<Library/>} />
        <Route path='/player/:id' element={<Player/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
