import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Sales from './pages/Sales'
import Exchanges from './pages/Exchanges'
import Returns from './pages/Returns'
import AdminPanel from './pages/admin/AdminPanel'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, loading } = useAuth()

  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      
      <Route element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/ventas" element={<Sales />} />
        <Route path="/cambios" element={<Exchanges />} />
        <Route path="/devoluciones" element={<Returns />} />
        <Route path="/admin/*" element={<AdminPanel />} />
      </Route>
    </Routes>
  )
}

export default App
