import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCog, KeyRound, Save } from 'lucide-react';

const ChangeAdminPassword: React.FC = () => {
  const { user } = useAuth();
  const [adminForm, setAdminForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [userForm, setUserForm] = useState({
    username: user?.username || '',
    password: '',
    confirmPassword: ''
  });

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminForm.newPassword !== adminForm.confirmNewPassword) {
      return toast.error('Las nuevas contraseñas no coinciden');
    }
    try {
      await api.post('/auth/change-admin-password', adminForm);
      toast.success('Contraseña administrativa cambiada');
      setAdminForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cambiar contraseña');
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userForm.password && userForm.password !== userForm.confirmPassword) {
      return toast.error('Las contraseñas de usuario no coinciden');
    }
    try {
      const { data } = await api.put('/auth/update-profile', {
        username: userForm.username,
        password: userForm.password || undefined
      });
      toast.success('Perfil de usuario actualizado con éxito');
      // Actualizar localStorage para que persista el nuevo username
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...currentUser, username: data.username }));
      setUserForm({ ...userForm, password: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar perfil');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <KeyRound className="text-red-500" size={28} />
        <h1 className="text-2xl font-bold text-white">Seguridad y Acceso</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Panel Acceso App (Login) */}
        <div className="glass rounded-2xl overflow-hidden border-white/5 flex flex-col">
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-3">
            <UserCog className="text-blue-400" size={20} />
            <div>
              <h2 className="text-lg font-bold text-white">Acceso General</h2>
              <p className="text-white/40 text-xs text-balance">Usuario y contraseña para ingresar a la App</p>
            </div>
          </div>
          
          <form onSubmit={handleUserSubmit} className="p-6 space-y-4 flex-1">
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Nombre de Usuario</label>
              <input 
                type="text" 
                className="input-dark"
                placeholder="Ej: zapateria_central"
                required
                value={userForm.username}
                onChange={e => setUserForm({...userForm, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Nueva Contraseña (Opcional)</label>
              <input 
                type="password" 
                className="input-dark"
                placeholder="Dejar en blanco para no cambiar"
                value={userForm.password}
                onChange={e => setUserForm({...userForm, password: e.target.value})}
              />
            </div>
            {userForm.password && (
              <div>
                <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Confirmar Contraseña</label>
                <input 
                  type="password" 
                  className="input-dark border-blue-500/30"
                  placeholder="Re-ingresá la contraseña"
                  required
                  value={userForm.confirmPassword}
                  onChange={e => setUserForm({...userForm, confirmPassword: e.target.value})}
                />
              </div>
            )}
            <div className="pt-4 mt-auto">
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/20">
                <Save size={18} />
                Guardar Cambios de Usuario
              </button>
            </div>
          </form>
        </div>

        {/* Panel Clave Admin */}
        <div className="glass rounded-2xl overflow-hidden border-white/5 flex flex-col">
          <div className="p-6 border-b border-white/5 bg-red-500/5 flex items-center gap-3">
            <ShieldCheck className="text-red-400" size={20} />
            <div>
              <h2 className="text-lg font-bold text-white">Clave Administrativa</h2>
              <p className="text-white/40 text-xs">Clave de seguridad para Reportes y Auditoría</p>
            </div>
          </div>

          <form onSubmit={handleAdminSubmit} className="p-6 space-y-4 flex-1">
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Contraseña Admin Actual</label>
              <input 
                type="password" 
                className="input-dark"
                placeholder="••••••••"
                required
                value={adminForm.currentPassword}
                onChange={e => setAdminForm({...adminForm, currentPassword: e.target.value})}
              />
            </div>
            <hr className="border-white/5 my-4" />
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Nueva Clave Admin</label>
              <input 
                type="password" 
                className="input-dark"
                placeholder="••••••••"
                required
                value={adminForm.newPassword}
                onChange={e => setAdminForm({...adminForm, newPassword: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Confirmar Nueva Clave</label>
              <input 
                type="password" 
                className="input-dark border-red-500/30"
                placeholder="••••••••"
                required
                value={adminForm.confirmNewPassword}
                onChange={e => setAdminForm({...adminForm, confirmNewPassword: e.target.value})}
              />
            </div>
            <div className="pt-4 mt-auto">
              <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-900/20">
                <Save size={18} />
                Actualizar Clave Admin
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <p className="text-amber-200/80 text-xs text-center">
          <strong>Aviso:</strong> Si cambias el acceso general, deberás iniciar sesión nuevamente con las nuevas credenciales en todos tus dispositivos.
        </p>
      </div>
    </div>
  );
};

export default ChangeAdminPassword;
