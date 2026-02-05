
import React, { useState } from 'react';
import { 
  X, Plus, Trash2, Scale, Zap, ShieldCheck 
} from 'lucide-react';
import { Ticket, QuoteItem } from '../types';

interface TechnicalReportFormProps {
  ticket: Ticket;
  onClose: () => void;
  onSend: (report: any) => void;
}

const TechnicalReportForm: React.FC<TechnicalReportFormProps> = ({ ticket, onClose, onSend }) => {
  const [techNotes, setTechNotes] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [laborCost, setLaborCost] = useState<number>(0);
  const [adjustment, setAdjustment] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState('AJUSTE POR PRECIO JUSTO TECHNOVA');
  const [newItem, setNewItem] = useState({ description: '', price: 0 });

  const addItem = () => {
    if (!newItem.description || newItem.price < 0) return;
    setItems([...items, { ...newItem, id: Date.now().toString() }]);
    setNewItem({ description: '', price: 0 });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const partsTotal = items.reduce((acc, i) => acc + i.price, 0);
  const finalTotal = ticket.estimatedCost + partsTotal + laborCost + adjustment;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050811]/95 backdrop-blur-xl animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-3xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Cabecera (Imagen 1) */}
        <div className="bg-[#050811] p-8 text-white flex justify-between items-center relative overflow-hidden shrink-0 border-b border-white/5">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px]"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-500/30">
              <Scale size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">Evaluación Realista & Precio Justo</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
                <Zap size={10} className="text-orange-500" /> TICKET #{ticket.id} • POLÍTICA DE TRANSPARENCIA JH&F
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all group active:scale-90">
            <X size={24} className="text-slate-500 group-hover:text-white" />
          </button>
        </div>

        <div className="p-8 md:p-12 overflow-y-auto flex-grow space-y-10 custom-scroll bg-white">
          
          {/* Diagnóstico */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xs">1</div>
               <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Observaciones Técnicas del Diagnóstico</label>
            </div>
            <textarea 
              className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-sm font-medium focus:ring-8 focus:ring-orange-500/5 focus:border-orange-500 outline-none h-32 resize-none transition-all shadow-inner text-slate-800"
              placeholder="Describa el estado real del equipo..."
              value={techNotes}
              onChange={(e) => setTechNotes(e.target.value)}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
             {/* Repuestos */}
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xs">2</div>
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Repuestos & Insumos</h3>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-5">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <input className="flex-[2] p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-orange-500 shadow-sm" placeholder="Descripción..." value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} />
                      <input type="number" className="flex-1 p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-orange-500 shadow-sm" placeholder="S/." value={newItem.price || ''} onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})} />
                    </div>
                    <button onClick={addItem} className="w-full bg-[#F26D21] text-white py-4 rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/20"><Plus size={18}/> ADICIONAR REPUESTO</button>
                  </div>

                  <div className="space-y-3 mt-4">
                    {items.length > 0 && items.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-[10px] font-black text-slate-700 uppercase">{item.description}</span>
                        <div className="flex items-center gap-4">
                          <span className="font-black text-slate-900 text-xs">S/. {item.price.toFixed(2)}</span>
                          <button onClick={() => removeItem(item.id)} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             </div>

             {/* Mano de Obra */}
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xs">3</div>
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Mano de Obra & Ajustes</h3>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Mano de Obra Adicional</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xs">S/.</span>
                        <input type="number" className="w-full p-4 pl-14 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-black focus:border-orange-500 outline-none transition-all shadow-sm" value={laborCost || ''} onChange={(e) => setLaborCost(Number(e.target.value))} />
                      </div>
                   </div>

                   <div className="bg-indigo-50 p-8 rounded-[3rem] border border-indigo-100 space-y-4 shadow-sm relative overflow-hidden">
                      <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Scale size={14} /> Ajuste Especialista (±)</label>
                      <div className="space-y-4">
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-indigo-400 text-xs">S/.</span>
                          <input type="number" className={`w-full p-4 pl-14 bg-white border-2 rounded-[1.5rem] text-sm font-black outline-none transition-all ${adjustment < 0 ? 'border-emerald-300 text-emerald-600' : 'border-indigo-100 text-indigo-900'}`} value={adjustment || ''} onChange={(e) => setAdjustment(Number(e.target.value))} />
                        </div>
                        <input className="w-full p-4 bg-white border border-indigo-100 rounded-2xl text-[9px] font-bold uppercase tracking-widest outline-none" placeholder="Razón del ajuste..." value={adjustmentReason} onChange={(e) => setAdjustmentReason(e.target.value)} />
                        <button onClick={() => setAdjustment(-20)} className="w-full py-3.5 bg-[#0BD99E] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10">- S/. 20.00 (PRECIO JUSTO)</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Resumen Final (Imagen 1) */}
          <div className="bg-[#050811] p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border-b border-white/10 pb-8">
               <div className="space-y-1">
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] block">Base Inicial</span>
                 <p className="text-base font-black">S/. {ticket.estimatedCost.toFixed(2)}</p>
               </div>
               <div className="space-y-1">
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] block">Repuestos</span>
                 <p className="text-base font-black text-orange-400">+ S/. {partsTotal.toFixed(2)}</p>
               </div>
               <div className="space-y-1">
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] block">Mano Obra</span>
                 <p className="text-base font-black text-orange-400">+ S/. {laborCost.toFixed(2)}</p>
               </div>
               <div className="space-y-1">
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] block">Ajuste</span>
                 <p className={`text-base font-black ${adjustment < 0 ? 'text-[#0BD99E]' : 'text-slate-500'}`}>S/. {adjustment.toFixed(2)}</p>
               </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <div className="flex items-center gap-3"><ShieldCheck size={24} className="text-orange-500" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Liquidación Final Propuesta</span></div>
              </div>
              <div className="text-right"><span className="text-5xl font-black tracking-tighter text-white uppercase leading-none">S/. {finalTotal.toFixed(2)}</span></div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 no-print shrink-0">
          <button onClick={onClose} className="px-8 py-4 text-slate-400 font-black text-xs uppercase tracking-[0.3em] hover:text-slate-900 transition-all">CANCELAR INFORME</button>
          <button 
            disabled={!techNotes || finalTotal < 0}
            onClick={() => onSend({ techNotes, items, laborCost, priceAdjustment: adjustment, adjustmentReason, timestamp: new Date().toLocaleString() })}
            className="px-16 py-6 bg-[#050811] text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-4 active:scale-95 disabled:opacity-20 w-full md:w-auto"
          >
            EMITIR Y NOTIFICAR AL CLIENTE <Zap size={20} className="text-orange-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalReportForm;
