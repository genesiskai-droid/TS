
import React, { useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, Package, PieChart, ArrowRight, Star, 
  AlertTriangle, CheckCircle, UserPlus, RefreshCcw, UserCheck, ShieldCheck, 
  Zap, Receipt, Banknote, Search, CheckCircle2 
} from 'lucide-react';
import { Ticket, TechnicalStaff, TicketStatus } from '../types';
import { TECH_STAFF } from '../constants';

interface ManagerDashboardProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const KPICard: React.FC<{ title: string; value: string; trend: string; icon: any; color: string }> = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
      <div className="text-3xl font-black text-slate-900">{value}</div>
      <div className="text-[10px] font-bold text-green-600 mt-2 flex items-center gap-1">
        <TrendingUp size={12} /> {trend} <span className="text-slate-400 opacity-60 ml-1">vs mes anterior</span>
      </div>
    </div>
  </div>
);

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ tickets, setTickets }) => {
  const [activeTab, setActiveTab] = useState<'control' | 'caja' | 'staff'>('control');
  const sosTickets = tickets.filter(t => t.isSOS && !t.sosApproved);
  const pendingPayments = tickets.filter(t => t.status === 'Pago' && !t.paymentMethod);
  const [overrideTech, setOverrideTech] = useState<Record<string, string>>({});

  const totalIncome = tickets.reduce((acc, t) => acc + (t.cost || t.estimatedCost), 0);

  const approveSOS = (id: string, techId: string) => {
    const finalTechId = overrideTech[id] || techId;
    const selectedTech = TECH_STAFF.find(t => t.id === finalTechId);
    
    setTickets(prev => prev.map(t => t.id === id ? { 
      ...t, 
      sosApproved: true, 
      status: 'En Ruta',
      assignedTeam: selectedTech ? [selectedTech] : t.assignedTeam,
      history: [...t.history, { 
        status: 'En Ruta', 
        timestamp: new Date().toLocaleTimeString(), 
        note: `Visto Bueno de Admin. Técnico ${selectedTech?.name} en camino.` 
      }]
    } : t));
  };

  const validateCajaPayment = (ticketId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? {
      ...t,
      paymentMethod: 'Efectivo en Caja',
      history: [...t.history, {
        status: 'Pago Validado',
        timestamp: new Date().toLocaleString(),
        note: 'Pago recibido físicamente en caja central por personal administrativo.'
      }]
    } : t));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Torre de Control</h2>
          <p className="text-slate-500 font-medium italic">Visión estratégica 360° sobre el Ecosistema TI JH&F.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200">
          <button onClick={() => setActiveTab('control')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'control' ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400'}`}>Despliegues</button>
          <button onClick={() => setActiveTab('caja')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'caja' ? 'bg-[#3D8BF2] text-white shadow-lg' : 'text-slate-400'}`}>Caja & Cobros</button>
          <button onClick={() => setActiveTab('staff')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'staff' ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400'}`}>Staff</button>
        </div>
      </header>

      {activeTab === 'control' && (
        <>
          {sosTickets.length > 0 && (
            <section className="mb-12 animate-in slide-in-from-top-6 duration-500">
              <div className="bg-red-50 border border-red-100 rounded-[3rem] p-10 shadow-2xl shadow-red-500/5">
                <div className="flex items-center gap-3 mb-8">
                   <AlertTriangle className="text-[#E11D48] animate-bounce" size={24} />
                   <h3 className="font-black text-[#E11D48] uppercase text-xs tracking-[0.2em]">Despliegues Críticos Pendientes</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {sosTickets.map(t => {
                    const suggestedTech = TECH_STAFF.filter(ts => ts.isVersatile && ts.currentWorkload < 80).sort((a,b) => a.currentWorkload - b.currentWorkload)[0];
                    return (
                      <div key={t.id} className="bg-white p-8 rounded-[2.5rem] border border-red-200 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-[#E11D48] transition-all">
                        <div className="flex-grow">
                          <h4 className="text-xl font-black text-slate-900 mb-2 uppercase">{t.title}</h4>
                          <p className="text-xs text-slate-500 italic border-l-4 border-red-500/20 pl-4">"{t.observations || 'Sin descripción'}"</p>
                        </div>
                        <button onClick={() => approveSOS(t.id, suggestedTech.id)} className="bg-[#E11D48] text-white px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 active:scale-95 shadow-xl shadow-red-500/20">
                          <UserCheck size={18} /> AUTORIZAR DESPLIEGUE
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <KPICard title="Facturación" value={`S/. ${totalIncome.toFixed(2)}`} trend="+12.5%" icon={DollarSign} color="bg-emerald-100 text-emerald-600" />
            <KPICard title="Tickets" value={tickets.filter(t => t.status !== 'Entrega').length.toString()} trend="-2.4%" icon={Package} color="bg-blue-100 text-blue-600" />
            <KPICard title="Retención" value="98%" trend="+5%" icon={Users} color="bg-purple-100 text-purple-600" />
            <KPICard title="Eficiencia" value="94%" trend="+0.2%" icon={ShieldCheck} color="bg-slate-900 text-white" />
          </div>
        </>
      )}

      {activeTab === 'caja' && (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-10"></div>
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Validación de Caja Central</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cajero: Admin Principal JH&F</p>
                 </div>
                 <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-xl">
                    <Banknote size={18} className="text-[#0BD99E]" /> S/. {totalIncome.toFixed(2)} en Nodo
                 </div>
              </div>

              <div className="space-y-4">
                 {pendingPayments.length === 0 ? (
                    <div className="py-20 text-center text-slate-300 font-black italic uppercase text-xs tracking-[0.3em]">No hay cobros físicos pendientes</div>
                 ) : (
                    pendingPayments.map(t => (
                       <div key={t.id} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-[#3D8BF2] transition-all shadow-sm">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#3D8BF2] shadow-sm border border-slate-100"><Receipt size={28}/></div>
                             <div>
                                <h5 className="font-black text-slate-900 text-lg tracking-tight uppercase">Ticket #{t.id}</h5>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.client}</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-10">
                             <div className="text-right">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total a Recibir</span>
                                <span className="text-2xl font-black text-slate-900">S/. {t.estimatedCost.toFixed(2)}</span>
                             </div>
                             <button 
                                onClick={() => validateCajaPayment(t.id)}
                                className="bg-[#0BD99E] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg active:scale-95 shadow-emerald-500/20"
                             >
                                <CheckCircle2 size={18} /> VALIDAR COBRO
                             </button>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'staff' && (
         <div className="bg-slate-900 rounded-[3rem] p-12 text-white animate-in slide-in-from-left duration-500">
            <h3 className="font-black uppercase text-xs tracking-widest mb-10 flex items-center gap-3"><Users size={18} className="text-[#3D8BF2]"/> Monitoreo de Especialistas</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {TECH_STAFF.map(tech => (
                  <div key={tech.id} className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-[#3D8BF2]/40 transition-all group">
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-[#3D8BF2]/20 rounded-2xl flex items-center justify-center text-[#3D8BF2] font-black">{tech.name.charAt(0)}</div>
                        <div className="text-right">
                           <span className="block text-[10px] font-black text-[#3D8BF2] uppercase tracking-widest">{tech.seniority}</span>
                           <span className="text-[8px] font-bold text-slate-500 uppercase">Lvl {tech.level}</span>
                        </div>
                     </div>
                     <h4 className="font-black text-white text-base mb-4 uppercase">{tech.name}</h4>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-[#3D8BF2]" style={{ width: `${tech.currentWorkload}%` }}></div>
                     </div>
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Carga: {tech.currentWorkload}%</span>
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
