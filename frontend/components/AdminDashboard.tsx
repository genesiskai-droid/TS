
import React, { useState } from 'react';
import { 
  ClipboardCheck, Wrench, ShieldCheck, CheckCircle, Package, User, MapPin, Clock, 
  AlertTriangle, ChevronRight, FileText, Smartphone, Camera, FileSignature, Zap,
  CreditCard, Truck, Hammer
} from 'lucide-react';
import { Ticket, TicketStatus } from '../types';
import ReceptionForm from './ReceptionForm';
import TechnicalReportForm from './TechnicalReportForm';
import WorkflowStepper from './WorkflowStepper';
import QualityControlForm from './QualityControlForm';

interface AdminDashboardProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ tickets, setTickets }) => {
  const [activeTab, setActiveTab] = useState<'pendientes' | 'completados'>('pendientes');
  const [selectedTicketForReception, setSelectedTicketForReception] = useState<Ticket | null>(null);
  const [selectedTicketForReport, setSelectedTicketForReport] = useState<Ticket | null>(null);
  const [selectedTicketForQC, setSelectedTicketForQC] = useState<Ticket | null>(null);

  const updateStatus = (id: string, newStatus: TicketStatus, extraData?: any) => {
    setTickets(prev => prev.map(t => t.id === id ? { 
      ...t, 
      status: newStatus,
      technicalReport: extraData?.techNotes ? extraData : t.technicalReport,
      deviceDetails: extraData?.brand ? { ...t.deviceDetails, receptionData: extraData } : t.deviceDetails,
      history: [...t.history, { 
        status: newStatus, 
        timestamp: new Date().toLocaleString(), 
        note: extraData?.techNotes ? 'Informe técnico emitido. Esperando aprobación de presupuesto.' : 
              extraData?.brand ? 'Acta de recepción técnica completada.' : 
              extraData?.stressTest ? 'Control de calidad aprobado satisfactoriamente.' :
              `Fase actualizada a ${newStatus} por personal técnico.` 
      }]
    } : t));
    setSelectedTicketForReception(null);
    setSelectedTicketForReport(null);
    setSelectedTicketForQC(null);
  };

  const filteredTickets = tickets.filter(t => 
    activeTab === 'pendientes' ? t.status !== 'Entrega' && t.status !== 'Cancelado' : t.status === 'Entrega' || t.status === 'Cancelado'
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-orange-500"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NODO DE OPERACIONES JH&F</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Workflow <span className="text-orange-500">Especialista</span></h2>
        </div>
        <div className="flex bg-slate-200 p-1.5 rounded-[1.5rem] border border-slate-300 shadow-inner">
          <button 
            onClick={() => setActiveTab('pendientes')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'pendientes' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Ordenes de Trabajo
          </button>
          <button 
            onClick={() => setActiveTab('completados')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'completados' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Historial de Cierre
          </button>
        </div>
      </header>

      <div className="space-y-8">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-24 text-center">
            <Package size={64} className="mx-auto text-slate-200 mb-6" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Cola de trabajo vacía en este nodo.</p>
          </div>
        ) : (
          filteredTickets.map(t => (
            <div key={t.id} className={`bg-white rounded-[3rem] border-2 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group ${t.priority === 'Crítica' ? 'border-red-100 hover:border-red-500/20' : 'border-slate-100 hover:border-orange-500/20'}`}>
              <div className="p-10 flex flex-col lg:flex-row justify-between gap-10">
                <div className="flex-grow space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="bg-slate-900 text-white font-black px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest">#{t.id}</span>
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest ${t.priority === 'Crítica' ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-500 text-white'}`}>PRIORIDAD {t.priority.toUpperCase()}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.modality.toUpperCase()}</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{t.title}</h3>
                  
                  <div className="max-w-2xl">
                    <WorkflowStepper status={t.status} variant="tech" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-tight">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-orange-500"><User size={16} /></div> 
                      {t.client.toUpperCase()}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-tight">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-orange-500"><MapPin size={16} /></div> 
                      {t.location.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* PROTOCOLO REQUERIDO (Imagen de referencia implementada) */}
                <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center items-center text-center min-w-[340px] shadow-inner relative">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Protocolo Requerido</span>
                  <div className="flex flex-col gap-4 w-full">
                    {t.status === 'Registrado' || t.status === 'Asignado' || t.status === 'En Taller' || t.status === 'En Ruta' ? (
                      <button 
                        onClick={() => setSelectedTicketForReception(t)}
                        className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                      >
                        <FileSignature size={22} /> INICIAR RECEPCIÓN
                      </button>
                    ) : t.status === 'En Diagnóstico' ? (
                      <button 
                        onClick={() => setSelectedTicketForReport(t)}
                        className="w-full py-6 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-600/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                      >
                        <FileText size={22} /> EMITIR INFORME
                      </button>
                    ) : t.status === 'Esperando Aprobación' ? (
                      <div className="p-6 bg-white border border-orange-100 rounded-3xl text-[10px] font-black text-orange-500 uppercase tracking-widest italic animate-pulse">SLA PAUSADO - ESPERANDO V.B. CLIENTE</div>
                    ) : t.status === 'En Reparación' ? (
                      <button 
                        onClick={() => updateStatus(t.id, 'Control Calidad')}
                        className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                      >
                        <Hammer size={22} /> FINALIZAR REPARACIÓN
                      </button>
                    ) : t.status === 'Control Calidad' ? (
                      <button 
                        onClick={() => setSelectedTicketForQC(t)}
                        className="w-full py-6 bg-indigo-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
                      >
                        <ShieldCheck size={22} /> REALIZAR AUDITORÍA QC
                      </button>
                    ) : t.status === 'Reparado' ? (
                      <button 
                        onClick={() => updateStatus(t.id, 'Pago')}
                        className="w-full py-7 bg-[#0f172a] hover:bg-black text-white rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(15,23,42,0.4)] transition-all flex items-center justify-center gap-4 active:scale-95"
                      >
                        <CreditCard size={24} /> SOLICITAR PAGO
                      </button>
                    ) : t.status === 'Pago' ? (
                      <div className="flex flex-col gap-6 w-full animate-in zoom-in duration-300">
                        {/* Botón Cobro en Proceso (Resaltado si no hay pago) */}
                        <div className={`p-6 rounded-[1.8rem] border-2 transition-all flex items-center justify-center text-center shadow-sm ${!t.paymentMethod ? 'bg-white border-[#0BD99E]/30 ring-4 ring-[#0BD99E]/5' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                           <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${!t.paymentMethod ? 'text-[#0BD99E] animate-pulse' : 'text-slate-400'}`}>
                              {t.paymentMethod ? 'PAGO CONFIRMADO' : 'COBRO EN PROCESO'}
                           </span>
                        </div>
                        
                        {/* Botón Realizar Entrega (Resaltado solo si hay pago) */}
                        <button 
                          disabled={!t.paymentMethod}
                          onClick={() => updateStatus(t.id, 'Entrega')}
                          className={`w-full py-7 rounded-[1.8rem] font-black text-[13px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 ${t.paymentMethod ? 'bg-[#0BD99E] text-white hover:bg-emerald-600 shadow-emerald-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed grayscale'}`}
                        >
                          <Truck size={24} /> REALIZAR ENTREGA
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/5 p-6 border-t border-slate-100 flex justify-between items-center px-10">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Fase Actual: <span className="text-slate-900 font-black">{t.status.toUpperCase()}</span></span>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button className="p-3 text-slate-400 hover:bg-white hover:text-orange-500 rounded-xl transition-all shadow-sm"><Camera size={18} /></button>
                    <button className="p-3 text-slate-400 hover:bg-white hover:text-orange-500 rounded-xl transition-all shadow-sm"><Smartphone size={18} /></button>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedTicketForReception && (
        <ReceptionForm 
          ticket={selectedTicketForReception} 
          onClose={() => setSelectedTicketForReception(null)}
          onSave={(data) => updateStatus(selectedTicketForReception.id, 'En Diagnóstico', data)}
        />
      )}

      {selectedTicketForReport && (
        <TechnicalReportForm 
          ticket={selectedTicketForReport}
          onClose={() => setSelectedTicketForReport(null)}
          onSend={(report) => updateStatus(selectedTicketForReport.id, 'Esperando Aprobación', report)}
        />
      )}

      {selectedTicketForQC && (
        <QualityControlForm 
          ticket={selectedTicketForQC}
          onClose={() => setSelectedTicketForQC(null)}
          onApprove={(qcData) => updateStatus(selectedTicketForQC.id, 'Reparado', qcData)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
