
import React, { useState, useRef } from 'react';
import { 
  X, Check, ShieldCheck, PenTool, Package, FileText, Trash2, Plus, 
  ChevronLeft, ChevronRight, List, Laptop, Network, Printer, Shield, 
  Zap, Code, Wind, Monitor, HardDrive, Smartphone, CheckCircle2, Info
} from 'lucide-react';
import { Ticket, ReceivedItem } from '../types';
import { DEVICE_TYPES, SERVICES_CATALOG } from '../constants';

interface ReceptionFormProps {
  ticket: Ticket;
  onClose: () => void;
  onSave: (receptionData: any) => void;
}

const ReceptionForm: React.FC<ReceptionFormProps> = ({ ticket, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [receivedItems, setReceivedItems] = useState<ReceivedItem[]>([]);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);

  // Estado para la categoría maestra que define el formulario
  const [masterCategory, setMasterCategory] = useState(ticket.type === 'S.O.S' ? 'computo' : 'computo');
  
  const [newItem, setNewItem] = useState({
    type: DEVICE_TYPES['computo'][0],
    brand: '',
    model: '',
    serial: '',
    quantity: 1,
    status: 'Operativo',
    notes: '' 
  });

  const addItem = () => {
    if (!newItem.brand || !newItem.model) return;
    setReceivedItems([...receivedItems, { ...newItem, id: Date.now().toString() }]);
    setNewItem({ ...newItem, brand: '', model: '', serial: '', quantity: 1, notes: '' });
  };

  const removeItem = (id: string) => {
    setReceivedItems(receivedItems.filter(i => i.id !== id));
  };

  const handleFinalize = () => {
    const canvas = sigCanvasRef.current;
    onSave({ 
      receptionItems: receivedItems, 
      signature: canvas ? canvas.toDataURL() : null,
      timestamp: new Date().toLocaleString(),
      masterCategory
    });
  };

  const startDrawing = (e: any) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    const rect = canvas.getBoundingClientRect();
    const getPos = (ev: any) => {
      const x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left;
      const y = (ev.touches ? ev.touches[0].clientY : ev.clientY) - rect.top;
      return { x, y };
    };
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    const draw = (moveEv: any) => {
      const { x: mx, y: my } = getPos(moveEv);
      ctx.lineTo(mx, my);
      ctx.stroke();
    };
    const stop = () => {
      window.removeEventListener('mousemove', draw);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchmove', draw);
      window.removeEventListener('touchend', stop);
    };
    window.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stop);
  };

  // Helper para renderizar campos específicos por categoría
  const renderCategorySpecificFields = () => {
    switch(masterCategory) {
      case 'computo':
        return (
          <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
            <input 
              type="checkbox" 
              id="cargador" 
              className="w-4 h-4 accent-[#3D8BF2]" 
              onChange={(e) => {
                const prefix = e.target.checked ? '[CON CARGADOR] ' : '';
                setNewItem({...newItem, notes: prefix + newItem.notes.replace('[CON CARGADOR] ', '')});
              }} 
            />
            <label htmlFor="cargador" className="text-[10px] font-bold text-slate-600 uppercase">¿Incluye Cargador/Maletín?</label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-3xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* ENCABEZADO JH&F */}
        <div className="bg-[#050811] p-8 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-[#3D8BF2]/10 rounded-2xl flex items-center justify-center text-[#3D8BF2] border border-[#3D8BF2]/20">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Acta de Recepción JH&F</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mt-0.5">
                SOLICITADO: <span className="text-white opacity-80">{ticket.title.toUpperCase()}</span> • TICKET #{ticket.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-10 bg-white custom-scroll">
          {step === 1 && (
            <div className="space-y-10">
              {/* REQUERIMIENTO DEL CLIENTE */}
              <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl flex items-center gap-5">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#3D8BF2] shadow-sm shrink-0">
                    <FileText size={20} />
                 </div>
                 <div className="space-y-0.5">
                    <h4 className="text-[10px] font-black text-[#3D8BF2] uppercase tracking-widest">Requerimiento del Cliente</h4>
                    <p className="text-[12px] font-bold text-slate-600 leading-tight italic">
                      "{ticket.observations || 'Diagnóstico y soporte técnico integral solicitado para este ticket.'}"
                    </p>
                 </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* 1. INGRESO DE EQUIPOS */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 mb-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-[#3D8BF2] flex items-center justify-center font-black text-[10px]">1</div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Ingreso de Equipos</h3>
                   </div>
                   
                   <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Línea de Activo (DESPLEGABLE POR TIPO)</label>
                        <select 
                          className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase outline-none focus:border-[#3D8BF2] transition-all"
                          value={masterCategory}
                          onChange={(e) => {
                            setMasterCategory(e.target.value);
                            setNewItem({...newItem, type: DEVICE_TYPES[e.target.value][0]});
                          }}
                        >
                          <option value="computo">💻 Centro de Cómputo / Laptops</option>
                          <option value="redes">🌐 Networking & WiFi</option>
                          <option value="impresion">🖨️ Sistemas de Impresión</option>
                          <option value="seguridad">🔒 Seguridad Electrónica</option>
                          <option value="clima_energia">⚡ Clima & Energía</option>
                          <option value="software">💿 Software & Licencias</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría Específica</label>
                        <select 
                          className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black outline-none"
                          value={newItem.type}
                          onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                        >
                          {DEVICE_TYPES[masterCategory]?.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Marca</label>
                          <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black outline-none focus:border-[#3D8BF2]" placeholder="Ej: HP" value={newItem.brand} onChange={(e) => setNewItem({...newItem, brand: e.target.value})} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Modelo</label>
                          <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black outline-none focus:border-[#3D8BF2]" placeholder="Ej: ProBook 450" value={newItem.model} onChange={(e) => setNewItem({...newItem, model: e.target.value})} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cantidad</label>
                          <input type="number" min="1" className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black outline-none" value={newItem.quantity} onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">S/N (Opcional)</label>
                          <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black outline-none" placeholder="X-XXXX" value={newItem.serial} onChange={(e) => setNewItem({...newItem, serial: e.target.value})} />
                        </div>
                      </div>

                      {/* NUEVO CAMPO: DETALLES U OBSERVACIONES DEL EQUIPO */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Observaciones / Detalles del Estado</label>
                        <textarea 
                          className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:border-slate-950 transition-all h-24 resize-none shadow-sm"
                          placeholder="Ej: Rayaduras en tapa, falta cargador, teclado desgastado, equipo no enciende..."
                          value={newItem.notes}
                          onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                        />
                      </div>

                      {renderCategorySpecificFields()}

                      <button 
                        onClick={addItem}
                        disabled={!newItem.brand || !newItem.model}
                        className="w-full py-5 bg-blue-50 text-[#3D8BF2] border border-blue-100 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#3D8BF2] hover:text-white transition-all disabled:opacity-20 active:scale-95 shadow-sm"
                      >
                        <Plus size={16} /> ADICIONAR AL ACTA
                      </button>
                   </div>
                </div>

                {/* 2. TABLA DE RESUMEN TÉCNICA */}
                <div className="flex flex-col h-full min-h-[500px]">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-[10px]">2</div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Tabla de Resumen Técnica</h3>
                   </div>
                   
                   <div className="bg-white border border-slate-100 rounded-[2.5rem] flex-grow overflow-hidden shadow-sm flex flex-col">
                      <div className="bg-slate-50/80 p-5 border-b border-slate-100 flex justify-between items-center">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unidades Registradas</span>
                         <div className="px-4 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                            <span className="text-[12px] font-black text-slate-950 leading-none">{receivedItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">TOTAL</span>
                         </div>
                      </div>
                      
                      <div className="flex-grow overflow-y-auto max-h-[420px] custom-scroll p-4">
                        {receivedItems.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-200 py-24">
                            <List size={40} className="mb-4 opacity-20" />
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">No hay equipos en el acta</p>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {receivedItems.map(item => (
                              <div key={item.id} className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 group hover:border-[#3D8BF2]/30 transition-all">
                                <div>
                                  <h5 className="text-[10px] font-black text-slate-950 uppercase tracking-tight mb-0.5">{item.brand} {item.model}</h5>
                                  <div className="flex items-center gap-2">
                                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.type}</span>
                                     {item.serial && <span className="text-[8px] font-bold text-[#3D8BF2] uppercase bg-blue-50 px-1.5 rounded">S/N: {item.serial}</span>}
                                  </div>
                                  {item.notes && <p className="text-[8px] font-bold text-emerald-500 uppercase mt-1 italic leading-tight max-w-[280px]">{item.notes}</p>}
                                </div>
                                <div className="flex items-center gap-5">
                                  <div className="text-right">
                                    <span className="text-[12px] font-black text-slate-900">x{item.quantity}</span>
                                  </div>
                                  <button onClick={() => removeItem(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in slide-in-from-right duration-500 flex flex-col items-center py-6">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-emerald-50 text-[#0BD99E] rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-100">
                  <PenTool size={36} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Visto Bueno de Recepción</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validación de ingreso de {receivedItems.reduce((acc, i) => acc + i.quantity, 0)} dispositivos en Nodo JH&F</p>
              </div>

              <div className="w-full max-w-xl bg-white border-2 border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative">
                <canvas 
                  ref={sigCanvasRef}
                  width={600}
                  height={300}
                  className="w-full h-[300px] cursor-crosshair"
                  onMouseDown={startDrawing}
                  onTouchStart={startDrawing}
                />
                <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">Firma Digital del Cliente / Responsable JH&F</span>
                </div>
              </div>

              <div className="flex items-center gap-5 p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem] max-w-lg">
                <Info size={24} className="text-[#3D8BF2] shrink-0" />
                <p className="text-[10px] text-slate-500 leading-tight font-bold italic">
                  Al completar este paso, se genera automáticamente el acta de ingreso en el historial operativo. Los equipos quedan bajo custodia y seguro de TechNova Solutions.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-10 border-t bg-slate-50 flex justify-between items-center shrink-0">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : onClose()} 
            className="px-10 py-5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all flex items-center gap-3 active:scale-95"
          >
            <ChevronLeft size={16} /> {step === 1 ? 'CANCELAR' : 'REGRESAR'}
          </button>
          
          <button 
            disabled={receivedItems.length === 0}
            onClick={() => step < 2 ? setStep(step + 1) : handleFinalize()} 
            className="px-14 py-5 bg-slate-950 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center gap-4 disabled:opacity-20 active:scale-95"
          >
            {step === 2 ? 'COMPLETAR ACTA' : 'GENERAR CONFORMIDAD'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceptionForm;
