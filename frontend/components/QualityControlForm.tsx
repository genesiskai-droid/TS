
import React, { useState, useMemo } from 'react';
import { 
  X, ShieldCheck, Check, ClipboardCheck, Zap, Laptop, Eraser, Search, 
  CheckCircle2, Network, Printer, Camera, Code, Wind, Battery, 
  Gauge, HardDrive, Shield, Activity, RefreshCw
} from 'lucide-react';
import { Ticket } from '../types';

interface QualityControlFormProps {
  ticket: Ticket;
  onClose: () => void;
  onApprove: (qcData: any) => void;
}

// Definición de protocolos por tipo de servicio
const QC_PROTOCOLS: Record<string, any[]> = {
  computo: [
    { id: 'hardware', label: 'Verificación de Hardware', icon: Laptop, desc: 'Componentes internos y ensamblaje' },
    { id: 'software', label: 'Sistemas & Drivers', icon: Zap, desc: 'Arranque limpio y controladores' },
    { id: 'cleaning', label: 'Limpieza Integral', icon: Eraser, desc: 'Interna/Externa y pasta térmica' },
    { id: 'ports', label: 'Puertos & Conectividad', icon: Search, desc: 'USB, HDMI, Wifi y Bluetooth' },
    { id: 'stressTest', label: 'Pruebas de Esfuerzo', icon: ClipboardCheck, desc: 'Temperaturas y rendimiento 30min' },
    { id: 'aesthetic', label: 'Acabado Estético', icon: ShieldCheck, desc: 'Sin huellas ni residuos de obra' },
  ],
  redes: [
    { id: 'mapping', label: 'Topología & Mapeo', icon: Network, desc: 'Identificación de nodos y puntos' },
    { id: 'throughput', label: 'Test de Velocidad', icon: Activity, desc: 'Validación de ancho de banda contratado' },
    { id: 'cabling', label: 'Certificación de Puntos', icon: HardDrive, desc: 'Ponchado y orden en rack' },
    { id: 'security', label: 'Firewall & VPN', icon: Shield, desc: 'Reglas de acceso y encriptación' },
    { id: 'stability', label: 'Prueba de Latencia', icon: Gauge, desc: 'Ping test y estabilidad de señal' },
    { id: 'labeling', label: 'Etiquetado Técnico', icon: ClipboardCheck, desc: 'Identificación de tomas y cables' },
  ],
  impresion: [
    { id: 'mechanism', label: 'Mecánica de Arrastre', icon: RefreshCw, desc: 'Rodillos y sensores de papel' },
    { id: 'quality', label: 'Calidad de Impresión', icon: Printer, desc: 'Test de colores y alineación' },
    { id: 'cleaning', label: 'Limpieza de Cabezal', icon: Eraser, desc: 'Eliminación de residuos de tinta/toner' },
    { id: 'connection', label: 'Gestión de Cola', icon: Network, desc: 'Pruebas de impresión vía red/USB' },
    { id: 'counter', label: 'Reset de Contadores', icon: ClipboardCheck, desc: 'Actualización de log de mantenimiento' },
    { id: 'aesthetic', label: 'Acabado Externo', icon: ShieldCheck, desc: 'Pulido y limpieza de bandejas' },
  ],
  seguridad: [
    { id: 'lens', label: 'Ajuste de Lentes', icon: Camera, desc: 'Enfoque y ángulo de visión óptimo' },
    { id: 'storage', label: 'Grabación en NVR', icon: HardDrive, desc: 'Validación de escritura en disco' },
    { id: 'alerts', label: 'Detección de Movimiento', icon: Zap, desc: 'Pruebas de alertas y notificaciones' },
    { id: 'night', label: 'Visión Nocturna', icon: Shield, desc: 'Activación de infrarrojos y LED' },
    { id: 'backup', label: 'Respaldo de Energía', icon: Battery, desc: 'Prueba de autonomía con UPS/Batería' },
    { id: 'aesthetic', label: 'Sellado de Cajas', icon: ShieldCheck, desc: 'Protección IP66 contra humedad' },
  ],
  clima_energia: [
    { id: 'voltage', label: 'Medición de Voltaje', icon: Zap, desc: 'Entrada/Salida dentro de rango nominal' },
    { id: 'batteries', label: 'Estado de Baterías', icon: Battery, desc: 'Validación de carga y ciclos' },
    { id: 'temp', label: 'Control Térmico', icon: Wind, desc: 'Regulación de temperatura y flujo' },
    { id: 'grounds', label: 'Pozo a Tierra', icon: Shield, desc: 'Medición de resistencia (Ohmios)' },
    { id: 'load', label: 'Prueba de Carga', icon: Gauge, desc: 'Rendimiento bajo consumo máximo' },
    { id: 'labels', label: 'Cuadro de Cargas', icon: ClipboardCheck, desc: 'Identificación de llaves y tableros' },
  ],
  software: [
    { id: 'registry', label: 'Limpieza de Registro', icon: Eraser, desc: 'Eliminación de logs y archivos temporales' },
    { id: 'updates', label: 'Parches Críticos', icon: RefreshCw, desc: 'S.O. y aplicaciones actualizadas' },
    { id: 'antivirus', label: 'Escaneo de Amenazas', icon: Shield, desc: 'Validación de seguridad activa' },
    { id: 'backup', label: 'Prueba de Respaldo', icon: HardDrive, desc: 'Integridad de base de datos y archivos' },
    { id: 'license', label: 'Validación de Licencia', icon: Code, desc: 'Legalidad y activación de software' },
    { id: 'performance', label: 'Optimización de Inicio', icon: Zap, desc: 'Tiempos de carga y servicios activos' },
  ]
};

const QualityControlForm: React.FC<QualityControlFormProps> = ({ ticket, onClose, onApprove }) => {
  // Inferir categoría basada en el título o ticket.category si existiera
  const category = useMemo(() => {
    const titleLower = ticket.title.toLowerCase();
    if (titleLower.includes('red') || titleLower.includes('switch') || titleLower.includes('wifi')) return 'redes';
    if (titleLower.includes('impresora') || titleLower.includes('plotter') || titleLower.includes('toner')) return 'impresion';
    if (titleLower.includes('cámara') || titleLower.includes('seguridad') || titleLower.includes('nvr')) return 'seguridad';
    if (titleLower.includes('software') || titleLower.includes('formateo') || titleLower.includes('licencia')) return 'software';
    if (titleLower.includes('ups') || titleLower.includes('clima') || titleLower.includes('energía') || titleLower.includes('aire')) return 'clima_energia';
    return 'computo'; // Default
  }, [ticket.title]);

  const activeProtocol = QC_PROTOCOLS[category] || QC_PROTOCOLS.computo;

  const [checks, setChecks] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    activeProtocol.forEach(p => { initial[p.id] = false; });
    return initial;
  });

  const allPassed = Object.values(checks).every(v => v);

  const toggleCheck = (id: string) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-3xl overflow-hidden flex flex-col">
        {/* ENCABEZADO JH&F */}
        <div className="bg-[#1e1b4b] p-8 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-300 border border-white/10">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter leading-none mb-1">Certificación de Calidad</h2>
              <p className="text-[10px] font-black text-indigo-300/60 uppercase tracking-widest">Protocolo Final • Ticket #{ticket.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all group active:scale-90">
            <X size={24} className="text-slate-400 group-hover:text-white" />
          </button>
        </div>

        <div className="p-10 space-y-8 bg-slate-50 overflow-y-auto max-h-[60vh] custom-scroll">
          {/* Badge del tipo de auditoría */}
          <div className="flex items-center gap-3">
             <div className="h-px w-6 bg-indigo-200"></div>
             <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Protocolo Especializado: {category.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProtocol.map((item) => {
              const Icon = item.icon;
              const isChecked = checks[item.id];
              return (
                <button 
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`flex items-start gap-4 p-5 rounded-3xl border-2 transition-all text-left group ${isChecked ? 'bg-white border-indigo-600 shadow-xl ring-8 ring-indigo-50' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                >
                  <div className={`p-3.5 rounded-2xl transition-all ${isChecked ? 'bg-indigo-600 text-white rotate-6' : 'bg-slate-50 text-slate-300'}`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className={`block text-[11px] font-black uppercase tracking-tight ${isChecked ? 'text-indigo-950' : 'text-slate-600'}`}>{item.label}</span>
                      {isChecked && <Check size={14} className="text-[#0BD99E] stroke-[4]" />}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* BARRA DE ESTADO DE AUDITORÍA */}
          <div className={`rounded-[2.5rem] p-8 text-white flex justify-between items-center shadow-xl transition-all duration-700 ${allPassed ? 'bg-[#1e1b4b] scale-[1.02]' : 'bg-slate-900 opacity-90'}`}>
            <div className="flex items-center gap-5">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${allPassed ? 'bg-[#0BD99E] border-[#0BD99E] rotate-12' : 'bg-white/5 border-white/20'}`}>
                 {allPassed ? <Check size={28} strokeWidth={3} /> : <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
               </div>
               <div>
                 <span className="text-[10px] font-black text-indigo-300/80 uppercase tracking-[0.3em] block mb-1">Estado de Auditoría Técnica</span>
                 <p className="text-sm font-black uppercase tracking-tighter">
                   {allPassed ? 'EQUIPO CERTIFICADO PARA ENTREGA' : 'AUDITORÍA EN PROCESO'}
                 </p>
               </div>
            </div>
          </div>
        </div>

        <div className="p-10 border-t flex justify-between items-center bg-white shrink-0">
          <button onClick={onClose} className="px-8 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors">Cancelar</button>
          <button 
            disabled={!allPassed}
            onClick={() => onApprove(checks)}
            className={`px-14 py-6 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center gap-4 ${allPassed ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'}`}
          >
            <CheckCircle2 size={20} /> EMITIR CERTIFICADO JH&F
          </button>
        </div>
      </div>
    </div>
  );
};

export default QualityControlForm;
