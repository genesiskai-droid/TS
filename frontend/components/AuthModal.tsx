
import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin, Building, ChevronLeft, ChevronRight, Eye, EyeOff, Globe, Smartphone, ShieldCheck } from 'lucide-react';
import { Client, ClientType } from '../types';
import { INITIAL_CLIENTS } from '../constants';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (client: Client) => void;
  initialView?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, initialView = 'login' }) => {
  const [view, setView] = useState<'login' | 'register' | 'recovery' | 'quickAccess'>(initialView);
  const [clientType, setClientType] = useState<ClientType>('natural');
  const [showPass, setShowPass] = useState(false);
  const [authMethod, setAuthMethod] = useState<'id' | 'email'>('email');
  
  // Login State
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [quickAccessEmail, setQuickAccessEmail] = useState('');
  
  // Register State
  const [regData, setRegData] = useState({
    id: '', name: '', lastName: '', email: '', phone: '', address: '', password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLoginFilled = loginId.length > 0 && loginPass.length > 0;

  const handleLogin = () => {
    if (!isLoginFilled) return;
    setLoading(true);
    setError('');
    setTimeout(() => {
      const client = INITIAL_CLIENTS.find(c => (c.email === loginId || c.id === loginId) && c.password === loginPass);
      if (client) {
        onSuccess(client);
      } else {
        setError('Credenciales JH&F incorrectas.');
        setLoading(false);
      }
    }, 1000);
  };

  const handleQuickAccess = () => {
    setLoading(true);
    setTimeout(() => {
      alert(`Código enviado a ${quickAccessEmail}`);
      setLoading(false);
      onClose();
    }, 1200);
  };

  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      const newClient: Client = {
        id: regData.id,
        type: clientType,
        name: regData.name,
        lastName: clientType === 'natural' ? regData.lastName : undefined,
        email: regData.email,
        phone: regData.phone,
        address: regData.address,
        createdAt: new Date().toISOString()
      };
      onSuccess(newClient);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden relative flex flex-col">
        
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors z-10">
          <X className="text-slate-400" />
        </button>

        {view === 'quickAccess' ? (
          <div className="p-12 animate-in slide-in-from-right duration-300">
            <div className="w-16 h-16 bg-[#3D8BF2]/10 text-[#3D8BF2] rounded-3xl flex items-center justify-center mb-8"><Smartphone size={32} /></div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Acceso Rápido</h2>
            <p className="text-sm font-medium text-slate-500 mb-10">Reciba su clave de acceso rápido en su bandeja de entrada o vía SMS.</p>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo o Celular</label>
                <div className="relative border-b-2 border-slate-200 group focus-within:border-[#3D8BF2] transition-colors">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3D8BF2]" size={20} />
                  <input 
                    className="w-full bg-transparent p-5 pl-10 text-slate-800 font-bold outline-none" 
                    placeholder="Ej: jose@mail.com"
                    value={quickAccessEmail}
                    onChange={(e) => setQuickAccessEmail(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={handleQuickAccess}
                className="w-full bg-[#3D8BF2] text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl hover:bg-[#29A5F2] transition-all"
              >
                Confirmar envío
              </button>

              <button 
                onClick={() => setView('login')}
                className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-[#3D8BF2] uppercase tracking-widest hover:opacity-80 transition-all pt-4"
              >
                <ChevronLeft size={20} /> Regresar al login
              </button>
            </div>
          </div>
        ) : view === 'login' ? (
          <div className="p-12 animate-in fade-in duration-300">
            <div className="flex flex-col items-center mb-10">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm border transition-all duration-500 ${isLoginFilled ? 'bg-[#3D8BF2] text-white border-blue-100 scale-110 shadow-blue-500/20' : 'bg-slate-50 border-slate-100 text-[#3D8BF2]'}`}>
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Acceso JH&F</h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">PLATAFORMA TECHNOVA SOLUTIONS</span>
            </div>

            <div className="flex bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100 mb-10">
              <button onClick={() => setAuthMethod('email')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${authMethod === 'email' ? 'bg-[#3D8BF2] text-white shadow-lg' : 'text-slate-400'}`}>CORREO</button>
              <button onClick={() => setAuthMethod('id')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${authMethod === 'id' ? 'bg-[#3D8BF2] text-white shadow-lg' : 'text-slate-400'}`}>DOCUMENTO</button>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    className="w-full bg-white border border-slate-200 p-6 rounded-[2rem] text-sm font-bold focus:border-[#3D8BF2] outline-none transition-all shadow-sm focus:ring-4 focus:ring-[#3D8BF2]/5" 
                    placeholder={authMethod === 'email' ? "Correo Corporativo" : "DNI / RUC"}
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                  />
                  {authMethod === 'email' && (
                    <button className="absolute right-6 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity">
                      <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <input 
                      type={showPass ? "text" : "password"}
                      className="w-full bg-white border border-slate-200 p-6 rounded-[2rem] text-sm font-bold focus:border-[#3D8BF2] outline-none transition-all shadow-sm focus:ring-4 focus:ring-[#3D8BF2]/5" 
                      placeholder="Contraseña de acceso"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                    />
                    <button onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                      {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                  <div className="flex justify-end pr-2">
                    <button onClick={() => setView('recovery')} className="text-[9px] font-black text-[#3D8BF2] uppercase tracking-widest hover:underline">¿Olvidaste tu contraseña?</button>
                  </div>
                </div>
              </div>

              {error && <p className="text-[10px] font-black text-red-500 text-center uppercase bg-red-50 py-2 rounded-lg">{error}</p>}

              <div className="pt-4 space-y-4">
                <button 
                  disabled={loading || !isLoginFilled}
                  onClick={handleLogin}
                  className={`w-full py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${isLoginFilled ? 'bg-[#3D8BF2] text-white hover:bg-[#29A5F2]' : 'bg-slate-100 text-slate-400'}`}
                >
                  {loading ? 'PROCESANDO...' : 'INGRESAR AL PORTAL'}
                </button>

                <button 
                  onClick={() => setView('quickAccess')}
                  className="w-full py-4 border-2 border-slate-100 text-slate-400 rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest hover:border-[#3D8BF2] hover:text-[#3D8BF2] transition-all flex items-center justify-center gap-2"
                >
                  <Smartphone size={16} /> CLAVE DE ACCESO RÁPIDO
                </button>
              </div>

              <div className="text-center pt-8 border-t border-slate-50 mt-10">
                <p className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-tighter">¿No tienes una cuenta?</p>
                <button 
                  onClick={() => setView('register')}
                  className="text-[#3D8BF2] font-black text-[11px] uppercase tracking-[0.15em] hover:underline"
                >
                  REGISTRAME
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 animate-in fade-in duration-300">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-8">Nuevo Cliente</h2>
             <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 border border-slate-200 shadow-inner">
                <button onClick={() => setClientType('natural')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${clientType === 'natural' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}>Persona</button>
                <button onClick={() => setClientType('juridica')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${clientType === 'juridica' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}>Empresa</button>
              </div>
              <div className="space-y-4 mb-10">
                <input className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[2rem] text-sm font-bold focus:border-[#3D8BF2] outline-none transition-all shadow-sm" placeholder={clientType === 'natural' ? "DNI / Identidad" : "RUC / Registro Fiscal"} value={regData.id} onChange={(e) => setRegData({...regData, id: e.target.value})} />
                <input className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[2rem] text-sm font-bold focus:border-[#3D8BF2] outline-none transition-all shadow-sm" placeholder="Nombre Completo / Razón Social" value={regData.name} onChange={(e) => setRegData({...regData, name: e.target.value})} />
                <input className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[2rem] text-sm font-bold focus:border-[#3D8BF2] outline-none transition-all shadow-sm" placeholder="Correo corporativo" value={regData.email} onChange={(e) => setRegData({...regData, email: e.target.value})} />
              </div>
              <button onClick={handleRegister} className="w-full bg-[#3D8BF2] text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-xl mb-6 hover:bg-[#29A5F2] transition-all">Confirmar Registro JH&F</button>
              <button onClick={() => setView('login')} className="w-full text-center text-[10px] font-black text-slate-400 hover:text-slate-800 flex items-center justify-center gap-2 uppercase tracking-widest"><ChevronLeft size={16} /> Volver al Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
