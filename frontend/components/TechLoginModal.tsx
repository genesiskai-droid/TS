
import React, { useState } from 'react';
import { Lock, X, ChevronRight, Shield, Info } from 'lucide-react';
import { TECH_STAFF } from '../constants';

interface TechLoginModalProps {
  onClose: () => void;
  onSuccess: (role: 'tech' | 'manager') => void;
}

const TechLoginModal: React.FC<TechLoginModalProps> = ({ onClose, onSuccess }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormFilled = user.length > 0 && pass.length > 0;

  const handleLogin = () => {
    if (!isFormFilled) return;
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      // 1. Verificación de Administrador Maestro
      if ((user === 'admin' || user === 'TEC-000') && pass === 'admin123') {
         onSuccess('manager');
         return;
      }

      // 2. Verificación contra Staff
      const technician = TECH_STAFF.find(t => 
        (t.email.toLowerCase() === user.toLowerCase() || t.id.toUpperCase() === user.toUpperCase()) && 
        t.password === pass
      );

      if (technician) {
        if (technician.level === 3) {
          onSuccess('manager');
        } else {
          onSuccess('tech');
        }
      } else {
        setError('Credenciales JH&F inválidas. Acceso denegado.');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-900 pointer-events-none">
           <Shield size={140} />
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} className="text-slate-400" />
        </button>

        <div className="text-center mb-10">
          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl transition-all duration-500 ${isFormFilled ? 'bg-[#3D8BF2] scale-110' : 'bg-slate-900'}`}>
            <Lock size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Acceso Staff</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-80">TechNova Solutions JH&F</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">ID Técnico o Email</label>
            <input 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#3D8BF2] transition-all text-slate-900"
              placeholder="admin / TEC-106"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Clave Maestra</label>
            <input 
              type="password"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#3D8BF2] transition-all text-slate-900"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="text-[10px] font-black text-red-600 text-center uppercase tracking-widest leading-tight p-3 bg-red-50 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <button 
            disabled={loading || !isFormFilled}
            onClick={handleLogin}
            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 disabled:opacity-50 ${isFormFilled ? 'bg-[#3D8BF2] text-white shadow-blue-500/20' : 'bg-slate-100 text-slate-400 shadow-none'}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
            ) : (
              <>ACCEDER AL NODO <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechLoginModal;
