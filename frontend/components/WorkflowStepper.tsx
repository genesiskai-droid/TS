
import React from 'react';
import { TicketStatus } from '../types';

interface WorkflowStepperProps {
  status: TicketStatus;
  variant?: 'client' | 'tech';
}

const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ status, variant = 'client' }) => {
  const steps: { label: string; states: TicketStatus[] }[] = [
    { label: 'Ingreso', states: ['Registrado', 'Asignado'] },
    { label: 'Revisión', states: ['En Taller', 'En Ruta', 'En Diagnóstico'] },
    { label: 'Aprobación', states: ['Esperando Aprobación'] },
    { label: 'En Reparación', states: ['En Reparación'] },
    { label: 'Calidad', states: ['Control Calidad'] },
    { label: 'Reparado', states: ['Reparado'] },
    { label: 'Pago', states: ['Pago'] },
    { label: 'Entrega', states: ['Entrega'] }
  ];

  let currentIdx = steps.findIndex(s => s.states.includes(status));
  if (status === 'Cancelado') currentIdx = -1;

  const activeColor = variant === 'tech' ? 'bg-orange-500' : 'bg-[#3D8BF2]';
  const ringColor = variant === 'tech' ? 'ring-orange-500/20' : 'ring-[#3D8BF2]/20';

  return (
    <div className="flex justify-between items-center relative py-10 px-2 w-full">
      <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
        <div 
          className={`h-full ${activeColor} transition-all duration-1000 ease-out`} 
          style={{ width: `${(Math.max(0, currentIdx) / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
      {steps.map((step, i) => (
        <div key={i} className="relative z-10 flex flex-col items-center gap-3">
          <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-all duration-500 ${i < currentIdx ? activeColor : i === currentIdx ? `${activeColor} scale-125 ring-4 ${ringColor}` : 'bg-slate-200'}`}></div>
          <span className={`text-[7px] font-black uppercase tracking-[0.15em] whitespace-nowrap ${i === currentIdx ? 'text-slate-900 font-extrabold' : 'text-slate-400'}`}>{step.label}</span>
        </div>
      ))}
    </div>
  );
};

export default WorkflowStepper;
