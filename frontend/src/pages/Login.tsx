import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Zap, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ username, password });
      toast.success('Bienvenido');
    } catch (error) {
      toast.error('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1117] to-[#0a0e27] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-600/30 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-tl from-blue-600/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(124,58,237,.05) 25%, rgba(124,58,237,.05) 26%, transparent 27%, transparent 74%, rgba(124,58,237,.05) 75%, rgba(124,58,237,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(124,58,237,.05) 25%, rgba(124,58,237,.05) 26%, transparent 27%, transparent 74%, rgba(124,58,237,.05) 75%, rgba(124,58,237,.05) 76%, transparent 77%, transparent)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Main content - Centered */}
      <div className="relative w-full max-w-md z-10 animate-slide-up">
        {/* Logo with branding */}
        <div className="flex flex-col items-center mb-12">
          {/* Large logo */}
          <div className="relative mb-8">
            <div className="absolute -inset-6 bg-gradient-to-r from-violet-600/60 via-blue-600/50 to-purple-600/60 rounded-3xl blur-2xl opacity-70 animate-pulse"></div>
            <div className="relative w-28 h-28 bg-gradient-to-br from-violet-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-900/80">
              <Zap size={56} className="text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Brand name */}
          <h1 className="text-5xl font-black text-white tracking-tighter text-center mb-2">
            Stock<span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Zap</span>
          </h1>
          
          {/* Tagline */}
          <p className="text-sm text-white/50 font-medium tracking-widest text-center uppercase">Sistema de Gestión de Zapatería</p>
          
          {/* Divider line */}
          <div className="mt-6 flex items-center gap-2">
            <div className="w-6 h-px bg-gradient-to-r from-transparent to-violet-500/50"></div>
            <Sparkles size={14} className="text-violet-400/60" />
            <div className="w-6 h-px bg-gradient-to-l from-transparent to-violet-500/50"></div>
          </div>
        </div>

        {/* Login card */}
        <div className="relative group mb-8">
          {/* Glow border effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/60 via-blue-600/40 to-violet-600/60 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500"></div>
          
          {/* Main card */}
          <div className="relative bg-black/50 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <span className="text-violet-400 text-xs font-bold uppercase tracking-widest">Acceso Seguro</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-1">Inicia Sesión</h2>
              <p className="text-white/50 text-sm font-medium">Accedé al sistema de gestión</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username field */}
              <div className="group/field">
                <label className="block text-white/70 text-xs font-bold mb-3 uppercase tracking-widest">Usuario</label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-2xl blur opacity-0 group-focus-within/field:opacity-100 transition duration-300"></div>
                  <input 
                    type="text"
                    className="relative w-full bg-white/15 border-2 border-white/15 text-white font-bold rounded-2xl px-5 py-4 text-base placeholder-white/50
                      focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 focus:bg-white/20
                      transition-all duration-300 backdrop-blur-sm"
                    placeholder="usuario1"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="group/field">
                <label className="block text-white/70 text-xs font-bold mb-3 uppercase tracking-widest">Contraseña</label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-2xl blur opacity-0 group-focus-within/field:opacity-100 transition duration-300"></div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="relative w-full bg-white/15 border-2 border-white/15 text-white font-bold rounded-2xl px-5 py-4 pr-14 text-base placeholder-white/50
                      focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 focus:bg-white/20
                      transition-all duration-300 backdrop-blur-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors p-2 hover:bg-white/5 rounded-lg"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full relative group/btn mt-10"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl blur-lg opacity-75 group-hover/btn:opacity-100 transition duration-300 group-disabled/btn:opacity-50"></div>
                <div className="relative bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:from-violet-600/50 disabled:to-blue-600/50
                  text-white font-black py-4 rounded-2xl transition-all duration-200 active:scale-95 disabled:cursor-not-allowed
                  flex items-center justify-center gap-3 text-lg shadow-2xl shadow-violet-900/80 uppercase tracking-wider"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Cargando...</span>
                    </>
                  ) : (
                    <>
                      <span>Acceder</span>
                      <ArrowRight size={22} className="group-hover/btn:translate-x-2 transition duration-200" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white/30 text-xs font-medium tracking-widest uppercase">
            StockZap v1.0 • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
