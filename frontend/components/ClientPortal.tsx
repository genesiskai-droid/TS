
import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, X, MapPin, Calendar, 
  ShieldCheck, CheckCircle2, Banknote, CreditCard, Check, FileText, Download, Shield, Activity, Users, AlertCircle, Sparkles, User, Smartphone, Mail, Save, Edit3, Building2, CreditCard as IdIcon
} from 'lucide-react';
import { Ticket, TicketStatus, Client } from '../types';
import WorkflowStepper from './WorkflowStepper';
import PaymentCheckout from './PaymentCheckout';

interface ClientPortalProps {
  tickets: Ticket[];
  // Added React. prefix to SetStateAction
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  currentClient: Client | null;
  // Added React. prefix to SetStateAction
  setCurrentClient: React.Dispatch<React.SetStateAction<Client | null>>;
}

const WarrantyBadge: React.FC<{ expiryDate?: string }> = ({ expiryDate }) => {
  if (!expiryDate) return null;
  
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    const calculate = () => {
      const diff = new Date(expiryDate).getTime() - new Date().getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days < 0) setTimeLeft('EXPIRADO');
      else setTimeLeft(`${days} DÍAS RESTANTES`);
    };
    calculate();
    const timer = setInterval(calculate, 3600000);
    return () => clearInterval(timer);
  }, [expiryDate]);

  return (
    <div className="flex flex-col items-end gap-1">
      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${timeLeft === 'EXPIRADO' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
        <Shield size={12} /> {timeLeft === 'EXPIRADO' ? 'GARANTÍA EXPIRADA' : 'GARANTÍA VIGENTE'}
      </div>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{timeLeft}</span>
    </div>
  );
};

const ClientPortal: React.FC<ClientPortalProps> = ({ tickets, setTickets, currentClient, setCurrentClient }) => {
  const [selectedTicketForPayment, setSelectedTicketForPayment] = useState<Ticket | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [profileData, setProfileData] = useState({
    id: currentClient?.id || '',
    name: currentClient?.name || '',
    lastName: currentClient?.lastName || '',
    phone: currentClient?.phone || '',
    email: currentClient?.email || '',
    address: currentClient?.address || ''
  });

  const activeTickets = tickets.filter(t => t.status !== 'Entrega' && t.status !== 'Cancelado');
  const finishedTickets = tickets.filter(t => t.status === 'Entrega' || t.status === 'Cancelado');

  const handleResponse = (ticketId: string, response: 'approved' | 'rejected' | 'customer_parts') => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;

      let nextStatus: TicketStatus = 'En Reparación';
      let finalCost = t.estimatedCost;
      let note = '';

      if (response === 'approved') {
        nextStatus = 'En Reparación';
        note = 'Presupuesto aprobado por el cliente.';
      } else if (response === 'customer_parts') {
        nextStatus = 'En Reparación';
        // Ajustar costo: Restar repuestos, dejar solo mano de obra + tasas base
        finalCost = (t.technicalReport?.laborCost || 50) + (t.modality === 'Domicilio' ? 50 : 0);
        note = 'El cliente proveerá sus propios repuestos. Se cobrará únicamente mano de obra certificada.';
      } else if (response === 'rejected') {
        // Al rechazar, pasa a PAGO por el diagnóstico realizado
        nextStatus = 'Pago';
        finalCost = 50; // Tasa base de diagnóstico/revisión TechNova
        note = 'Presupuesto rechazado. Se procede a liquidación por gastos de diagnóstico y revisión técnica.';
      }

      return {
        ...t,
        status: nextStatus,
        estimatedCost: finalCost,
        technicalReport: { ...t.technicalReport!, clientResponse: response },
        history: [...t.history, { status: nextStatus, timestamp: new Date().toLocaleString(), note }]
      };
    }));
  };

  const finalizePayment = (updatedData: Partial<Ticket>) => {
    if (!selectedTicketForPayment) return;
    setTickets(prev => prev.map(t => t.id === selectedTicketForPayment.id ? { ...t, ...updatedData } : t));
    setSelectedTicketForPayment(null);
  };

  const handleUpdateProfile = () => {
    if (currentClient) {
      setCurrentClient({ ...currentClient, ...profileData });
      setIsEditingProfile(false);
      alert("Su perfil ha sido actualizado con éxito en el Nodo JH&F.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in slide-in-from-top duration-700">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-1 h-px bg-slate-900"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Gestión de Operaciones JH&F</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight uppercase">Portal <span className="text-[#3D8BF2]">Cliente Elite</span></h2>
          <p className="text-slate-500 font-medium italic">Visibilidad total sobre su infraestructura tecnológica.</p>
        </div>
        
        <div className={`bg-white p-6 rounded-[2.5rem] border transition-all duration-500 shadow-sm ${isEditingProfile ? 'border-[#3D8BF2] ring-8 ring-blue-50 w-full md:w-[480px]' : 'border-slate-100 w-auto'}`}>
          {!isEditingProfile ? (
            <div className="flex items-center justify-between gap-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#3D8BF2] border border-slate-100">
                  <User size={22} />
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">ID: {currentClient?.id}</span>
                  <h4 className="text-sm font-black text-slate-950 uppercase leading-none tracking-tight">
                    {currentClient?.name} {currentClient?.lastName}
                  </h4>
                  <button onClick={() => setIsEditingProfile(true)} className="text-[9px] font-black text-[#3D8BF2] uppercase hover:underline mt-1 flex items-center gap-1"><Edit3 size={10} /> Editar Perfil</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">ACTUALIZACIÓN DE IDENTIDAD JH&F</h4>
                <button onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={16} /></button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 ml-2">ID (DNI/RUC)</label>
                  <div className="relative">
                    <IdIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input className="w-full bg-slate-50 p-3.5 pl-10 rounded-xl text-[11px] font-black border border-slate-100 outline-none focus:border-[#3D8BF2]" value={profileData.id} onChange={e => setProfileData({...profileData, id: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 ml-2">CELULAR</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input className="w-full bg-slate-50 p-3.5 pl-10 rounded-xl text-[11px] font-black border border-slate-100 outline-none focus:border-[#3D8BF2]" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 ml-2">NOMBRES / RAZÓN SOCIAL</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input className="w-full bg-slate-50 p-3.5 pl-10 rounded-xl text-[11px] font-black border border-slate-100 outline-none focus:border-[#3D8BF2]" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 ml-2">DIRECCIÓN FISCAL</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input className="w-full bg-slate-50 p-3.5 pl-10 rounded-xl text-[11px] font-black border border-slate-100 outline-none focus:border-[#3D8BF2]" value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 ml-2">CORREO ELECTRÓNICO</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input className="w-full bg-slate-50 p-3.5 pl-10 rounded-xl text-[11px] font-black border border-slate-100 outline-none focus:border-[#3D8BF2]" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                </div>
              </div>

              <button 
                onClick={handleUpdateProfile} 
                className="w-full py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
              >
                <Save size={16} /> GUARDAR CAMBIOS CORPORATIVOS
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="mb-20">
        {activeTickets.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-24 text-center">
            <Activity size={64} className="mx-auto text-slate-200 mb-6" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sin operaciones activas en curso</p>
          </div>
        ) : (
          <div className="space-y-12">
            {activeTickets.map(t => (
              <div key={t.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-500 hover:shadow-2xl animate-in slide-in-from-top duration-1000">
                
                {t.paymentMethod && (
                  <div className="bg-emerald-50 border-b border-emerald-100 p-8 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-[#0BD99E] text-white rounded-2xl flex items-center justify-center shadow-lg border border-emerald-200"><Check size={28} /></div>
                      <div>
                        <h5 className="font-black text-emerald-900 uppercase text-lg tracking-tight leading-none mb-1">¡PAGO CONFIRMADO CON ÉXITO!</h5>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">GARANTÍA ACTIVADA Y EQUIPO LIBERADO PARA RECOJO/ENTREGA.</p>
                      </div>
                    </div>
                    <div className="mt-6 md:mt-0 px-8 py-4 bg-white border border-emerald-200 rounded-2xl text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] shadow-sm flex items-center gap-3">
                      <CheckCircle2 size={18} /> OPERACIÓN JH&F CONCLUIDA
                    </div>
                  </div>
                )}

                {(t.status === 'Pago' || t.status === 'Reparado') && !t.paymentMethod && (
                  <div className="bg-blue-50 border-b border-blue-100 p-8 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-[#3D8BF2] text-white rounded-2xl flex items-center justify-center shadow-lg border border-blue-200 animate-pulse"><CreditCard size={28} /></div>
                      <div>
                        <h5 className="font-black text-blue-900 uppercase text-lg tracking-tight leading-none mb-1">{t.technicalReport?.clientResponse === 'rejected' ? 'LIQUIDACIÓN POR REVISIÓN TÉCNICA' : 'REPARACIÓN COMPLETADA - PAGO REQUERIDO'}</h5>
                        <p className="text-[10px] font-black text-[#3D8BF2] uppercase tracking-widest">{t.technicalReport?.clientResponse === 'rejected' ? 'EL SERVICIO FUE CANCELADO. LIQUIDE LA TASA DE DIAGNÓSTICO PARA RETIRAR EL EQUIPO.' : 'SU EQUIPO ESTÁ LISTO. POR FAVOR, PROCEDA CON LA LIQUIDACIÓN PARA ACTIVAR LA GARANTÍA.'}</p>
                      </div>
                    </div>
                    <div className="mt-6 md:mt-0 px-8 py-4 bg-white border border-blue-200 rounded-2xl text-[10px] font-black text-[#3D8BF2] uppercase tracking-[0.2em] shadow-sm flex items-center gap-3">
                      <AlertCircle size={18} /> ACCIÓN REQUERIDA DEL CLIENTE
                    </div>
                  </div>
                )}

                <div className="p-10 flex flex-col gap-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest ${t.status === 'Esperando Aprobación' ? 'bg-[#F26D21] text-white animate-pulse' : (t.status === 'Pago' || t.status === 'Reparado') ? 'bg-[#0BD99E] text-white' : 'bg-slate-900 text-white'}`}>{t.status.toUpperCase()}</span>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">ID: #{t.id}</span>
                    <div className="flex-grow"></div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <MapPin size={14} className="text-[#3D8BF2]" /> {t.location.toUpperCase()}
                      <Calendar size={14} className="text-[#3D8BF2] ml-4" /> {t.date}
                    </div>
                  </div>
                  
                  <h4 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">{t.title}</h4>
                  
                  <WorkflowStepper status={t.status} />

                  {t.status === 'Esperando Aprobación' && t.technicalReport && (
                    <div className="bg-[#F26D21]/5 rounded-[2.5rem] border border-[#F26D21]/20 p-10 animate-in slide-in-from-top duration-500 border-2 border-dashed">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#F26D21] shadow-sm border border-[#F26D21]/10">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h5 className="font-black text-slate-900 uppercase tracking-tight">Presupuesto Especialista JH&F</h5>
                          <p className="text-[10px] font-black text-[#F26D21] uppercase tracking-widest">Fecha de emisión: {t.technicalReport.timestamp}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-8">
                        <p className="text-sm font-medium text-slate-700 italic border-l-4 border-[#F26D21]/30 pl-4">"{t.technicalReport.techNotes}"</p>
                        
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                          <table className="w-full text-[10px]">
                            <thead>
                              <tr className="text-slate-400 font-black uppercase tracking-widest border-b pb-4">
                                <th className="text-left pb-4">Detalle</th>
                                <th className="text-right pb-4">Inversión</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {t.technicalReport.items.map(item => (
                                <tr key={item.id}><td className="py-4 font-bold text-slate-800 uppercase">{item.description}</td><td className="py-4 text-right font-black">S/. {item.price.toFixed(2)}</td></tr>
                              ))}
                              <tr><td className="py-4 font-bold text-slate-500 uppercase">Mano de Obra Certificada</td><td className="py-4 text-right font-black">S/. {(t.technicalReport.laborCost || 0).toFixed(2)}</td></tr>
                            </tbody>
                          </table>
                          <div className="mt-6 pt-6 border-t-2 border-slate-100 flex justify-between items-center">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Presupuestado</span>
                            <span className="text-3xl font-black text-slate-900 tracking-tighter">S/. {t.estimatedCost.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* BLOQUE DE ACCIONES REFINADO (Basado en imagen de referencia) */}
                        <div className="space-y-4 pt-4">
                          <button 
                            onClick={() => handleResponse(t.id, 'approved')}
                            className="w-full bg-[#F26D21] text-white py-7 rounded-[1.8rem] font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-4 active:scale-95"
                          >
                            <Check size={22} strokeWidth={3} /> AUTORIZAR REPARACIÓN
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button 
                              onClick={() => handleResponse(t.id, 'customer_parts')}
                              className="py-5 bg-white text-red-500 border-2 border-red-500 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.1em] hover:bg-red-50 transition-all active:scale-95"
                            >
                              LLEVARE MI PROPIO REPUESTO
                            </button>
                            <button 
                              onClick={() => handleResponse(t.id, 'rejected')}
                              className="py-5 bg-white text-red-500 border-2 border-red-500 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.1em] hover:bg-red-50 transition-all active:scale-95"
                            >
                              RECHAZAR INFORME
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-12 mt-4 pt-10 border-t border-slate-50 items-center justify-between">
                    <div className="flex gap-12">
                      <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest"><Users size={20} className="text-[#3D8BF2]" /> ESPECIALISTA ASIGNADO</div>
                      <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <Banknote size={20} className="text-[#3D8BF2]" /> INVERSIÓN: S/. {t.estimatedCost.toFixed(2)}
                      </div>
                    </div>

                    {(t.status === 'Pago' || t.status === 'Reparado') && (
                      t.paymentMethod ? (
                        <div className="bg-emerald-50 text-emerald-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border border-emerald-100 shadow-sm animate-in zoom-in">
                          <CheckCircle2 size={18} /> PAGO REGISTRADO
                        </div>
                      ) : (
                        <button 
                          onClick={() => setSelectedTicketForPayment(t)}
                          className="bg-[#0f172a] text-white px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center gap-3 active:scale-95 shadow-xl shadow-slate-900/20"
                        >
                          <CreditCard size={18} /> LIQUIDAR PAGO SEGURO
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="historial">
        <div className="flex items-center gap-3 mb-8">
          <Clock size={18} className="text-slate-400" />
          <h3 className="font-black text-slate-500 uppercase text-xs tracking-[0.2em]">Historial Operativo de Infraestructura</h3>
        </div>
        <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
          {finishedTickets.length === 0 ? (
            <div className="p-24 text-center text-slate-300 font-black italic uppercase text-sm tracking-widest">No hay registros históricos recientes</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {finishedTickets.map(t => (
                <div key={t.id} className="p-10 flex flex-col lg:flex-row lg:items-center justify-between hover:bg-slate-50/50 transition-all gap-8">
                  <div className="flex items-center gap-8">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner ${t.status === 'Entrega' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                      {t.status === 'Entrega' ? <CheckCircle size={32} /> : <X size={32} />}
                    </div>
                    <div>
                      <h5 className="font-black text-slate-900 text-xl tracking-tight leading-none mb-2 uppercase">{t.title}</h5>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date} | ID #{t.id}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 pr-8 border-r border-slate-100">
                      <WarrantyBadge expiryDate={t.warrantyExpiry || '2026-12-31'} />
                      <div className="text-right">
                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-60">Inversión Final</span>
                        <div className="font-black text-slate-900 text-xl tracking-tighter">S/. {(t.cost || t.estimatedCost).toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                       <button title="Comprobante Digital" className="p-4 bg-slate-950 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex flex-col items-center">
                          <Download size={20} className="mb-1" />
                          <span className="text-[7px] font-black uppercase">COMPROBANTE</span>
                       </button>
                       <button title="Garantía" className="p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 flex flex-col items-center">
                          <Shield size={20} className="mb-1 text-emerald-500" />
                          <span className="text-[7px] font-black uppercase">GARANTÍA</span>
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedTicketForPayment && (
        <PaymentCheckout 
          ticket={selectedTicketForPayment} 
          onCancel={() => setSelectedTicketForPayment(null)}
          onSuccess={finalizePayment}
        />
      )}
    </div>
  );
};

export default ClientPortal;
