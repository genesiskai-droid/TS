
import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, ShieldAlert, Phone, Clock, ArrowRight, MapPin, Cpu, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { SERVICES_CATALOG } from '../constants';
import { Ticket } from '../types';

interface SOSPanelProps {
  onClose: () => void;
  onTicketCreate: (ticket: Ticket) => void;
  hasWarranty?: boolean;
}

const SOSPanel: React.FC<SOSPanelProps> = ({ onClose, onTicketCreate, hasWarranty = false }) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(SERVICES_CATALOG[0].id);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const selectedService = SERVICES_CATALOG.find(s => s.id === category);
  const basePrice = selectedService?.basePrice || 0;
  const sosSurcharge = basePrice * 0.30;
  const totalWithSOS = basePrice + sosSurcharge;
  const warrantyDiscount = hasWarranty ? (totalWithSOS * 0.5) : 0;
  const finalPrice = totalWithSOS - warrantyDiscount;

  // Manejador del progreso visual
  useEffect(() => {
    let interval: any;
    if (loading && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [loading, progress]);

  const handleSubmitSOS = () => {
    setLoading(true);
    setProgress(0);
    
    // Simular validaciones y contacto con Torre de Control
    setTimeout(() => {
      const sosTicket: Ticket = {
        id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'S.O.S',
        title: `EMERGENCIA: ${selectedService?.title}`,
        status: 'Registrado',
        priority: 'Crítica',
        client: 'PROCESANDO...', 
        clientId: 'PROCESANDO',
        date: new Date().toLocaleDateString(),
        location: 'UBICACIÓN GPS DETECTADA',
        estimatedCost: finalPrice,
        modality: 'Domicilio',
        isSOS: true,
        sosApproved: false,
        history: [{ 
          status: 'Registrado', 
          timestamp: new Date().toLocaleString(), 
          note: 'Protocolo SOS activado. Recargo 30% aplicado.' 
        }],
        deviceDetails: { description }
      };
      
      onTicketCreate(sosTicket);
      setStep(3);
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
      <div className="max-w-2xl w-full bg-white rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(225,29,72,0.2)] overflow-hidden border border-red-100">
        <div className="bg-[#E11D48] p-10 text-white flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="bg-white/20 p-4 rounded-[1.5rem] backdrop-blur-md animate-pulse">
              <AlertTriangle size={36} />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">PROTOCOLO S.O.S</h2>
              <p className="text-[10px] font-black text-red-100 uppercase tracking-[0.2em] opacity-80">Asistencia Técnica Inmediata de Elite</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
        </div>

        <div className="p-10">
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
              <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100">
                <h3 className="text-[#E11D48] font-black mb-4 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                  <ShieldAlert size={16} /> Evaluación de Emergencia
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sistema Afectado</label>
                    <select 
                      className="w-full p-4 bg-white border border-red-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-red-100 outline-none transition-all"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {SERVICES_CATALOG.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción del Fallo Crítico</label>
                    <textarea 
                      className="w-full p-5 bg-white border border-red-200 rounded-3xl text-sm font-medium focus:ring-4 focus:ring-red-100 outline-none transition-all h-32 resize-none"
                      placeholder="Describa el problema aquí (ej: caída de red core)..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Inversión SOS Estimada</span>
                  <div className="text-3xl font-black flex items-baseline gap-2">
                    S/. {finalPrice.toFixed(2)}
                    {hasWarranty && <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black line-through opacity-50">S/. {totalWithSOS.toFixed(2)}</span>}
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase">Incluye 30% recargo urgencia {hasWarranty ? 'y 50% ahorro garantía' : ''}</p>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  disabled={!description.trim()}
                  className="bg-[#E11D48] p-6 rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-500/30 disabled:opacity-30"
                >
                  <ArrowRight size={28} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-10 space-y-10 animate-in slide-in-from-right-6 duration-500">
               <div className="relative inline-block">
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <MapPin size={48} className={`text-[#E11D48] ${loading ? 'animate-bounce' : ''}`} />
                  </div>
                  {loading && <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>}
               </div>
               
               <div className="space-y-2">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Validando Ubicación y Prioridad...</h3>
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Conexión establecida con Torre de Control JH&F</p>
               </div>

               {/* BARRA DE PROGRESO SOLICITADA */}
               <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden max-w-sm mx-auto">
                 <div 
                   className="h-full bg-[#E11D48] transition-all duration-300 ease-out"
                   style={{ width: `${progress}%` }}
                 ></div>
               </div>

               <p className="text-slate-500 text-xs font-medium max-w-sm mx-auto leading-relaxed">
                 Estamos notificando a nuestro equipo de respuesta rápida más cercano a su ubicación. Por favor, mantenga su línea telefónica activa.
               </p>

               <button 
                onClick={handleSubmitSOS}
                disabled={loading}
                className="w-full py-6 bg-[#E11D48] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-red-500/40 hover:bg-red-700 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
               >
                 {loading && <Loader2 size={18} className="animate-spin" />}
                 <span className="relative z-10">{loading ? 'SOLICITANDO AUTORIZACIÓN...' : 'CONFIRMAR DESPLIEGUE DE UNIDAD'}</span>
               </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 space-y-8 animate-in zoom-in duration-500">
               <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
                 <CheckCircle size={48} strokeWidth={3} />
               </div>
               <div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Protocolo Iniciado</h3>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">En espera del Visto Bueno del Administrador (Torre de Control)</p>
               </div>
               <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                    "Su solicitud ha sido registrada con prioridad CRÍTICA. El administrador está confirmando el técnico más versátil disponible para su zona."
                  </p>
               </div>
               <button 
                onClick={onClose}
                className="w-full py-4 border-2 border-slate-900 text-slate-900 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
               >
                 Ir a mi Panel de Cliente
               </button>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-center items-center gap-10">
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <Clock size={16} className="text-[#E11D48]" /> SLA: 2 Horas máx.
           </div>
           <div className="w-px h-4 bg-slate-200"></div>
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <ShieldCheck size={16} className="text-[#E11D48]" /> SOPORTE NIVEL 3
           </div>
        </div>
      </div>
    </div>
  );
};

export default SOSPanel;
