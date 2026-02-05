
import React, { useState, useEffect } from 'react';
import { 
  Cpu, Network, Shield, Zap, ChevronRight, Sparkles, 
  ArrowUpRight, Activity, Printer, Wind, Code
} from 'lucide-react';
import { SERVICES_CATALOG } from '../constants';
import { ServiceItem } from '../types';
import { getSmartDiagnosis } from '../services/geminiService';

interface LandingPageProps {
  onBook: (cat: ServiceItem) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onBook }) => {
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const handleAiCheck = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    const result = await getSmartDiagnosis(aiInput);
    setAiResult(result);
    setAiLoading(false);
  };

  const iconMap: Record<string, any> = { 
    Cpu, Network, Shield, Zap, Printer, Wind, Code 
  };

  return (
    <div className="flex flex-col bg-[#050811] text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-[#3D8BF2]/10 rounded-full blur-[250px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-[#0BD99E]/10 rounded-full blur-[250px] translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#0BD99E] animate-pulse"></span>
                <span className="text-[#0BD99E] text-[10px] font-black uppercase tracking-[0.2em]">Managed IT Services JH&F</span>
              </div>
              
              <h1 className="text-7xl lg:text-[100px] font-black text-white leading-[0.85] tracking-tighter uppercase">
                SOPORTE TI <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3D8BF2] via-[#29A5F2] to-[#0BD99E]">
                  DE ELITE.
                </span>
              </h1>
              
              <p className="text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
                TechNova Solutions JH&F elimina la fricción tecnológica. Ofrecemos infraestructura inteligente, ciberseguridad avanzada y soporte técnico corporativo.
              </p>

              <div className="flex flex-wrap gap-6 pt-6">
                <button 
                  onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative px-10 py-6 bg-[#3D8BF2] text-white font-black rounded-[2rem] overflow-hidden transition-all hover:-translate-y-1 active:scale-95 shadow-[0_0_40px_rgba(61,139,242,0.2)] border border-white/10"
                >
                  <span className="relative z-10 flex items-center gap-3 uppercase text-xs tracking-widest font-black">
                    Explorar Servicios JH&F <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-10 shadow-3xl">
                <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#29A5F2]/20 rounded-2xl flex items-center justify-center text-[#29A5F2] border border-[#29A5F2]/30">
                      <Activity size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-lg">NOC Diagnostic AI</h3>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">TechNova Analysis Engine</span>
                    </div>
                  </div>
                  <Sparkles size={20} className="text-[#0BD99E] animate-bounce" />
                </div>

                <div className="space-y-6">
                  <div className="relative group">
                    <textarea 
                      className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-white text-sm font-medium focus:ring-2 focus:ring-[#3D8BF2] focus:border-transparent transition-all h-40 resize-none outline-none shadow-inner group-hover:bg-black/60"
                      placeholder="Describa el requerimiento técnico o fallo..."
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                    />
                    <button 
                      onClick={handleAiCheck}
                      disabled={aiLoading}
                      className="absolute bottom-6 right-6 bg-[#3D8BF2] p-4 rounded-[1.5rem] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {aiLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : <ArrowUpRight size={22} />}
                    </button>
                  </div>

                  {aiResult && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                         <div className="flex justify-between items-center mb-6">
                           <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-[#0BD99E] animate-ping"></div>
                             <span className="text-[#0BD99E] font-black text-[10px] uppercase tracking-[0.2em]">Diagnóstico IA</span>
                           </div>
                         </div>
                         <p className="text-slate-200 text-sm font-bold leading-relaxed mb-8 italic">"{aiResult.diagnosis}"</p>
                         <button 
                          onClick={() => {
                            const cat = SERVICES_CATALOG.find(c => c.id === aiResult.category) || SERVICES_CATALOG[0];
                            onBook(cat);
                          }}
                          className="w-full py-5 bg-[#3D8BF2] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-[#29A5F2] transition-all shadow-xl"
                         >
                           Desplegar Orden de Trabajo
                         </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-32 bg-[#F2F2F2] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-[#3D8BF2]"></div>
                <span className="text-[#3D8BF2] font-black tracking-[0.3em] text-[10px] uppercase">Ecosistema JH&F</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-none uppercase">
                SOLUCIONES <br/> <span className="text-slate-400">CORPORATIVAS.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {SERVICES_CATALOG.map((service) => {
              const Icon = iconMap[service.iconName] || Cpu;
              return (
                <div 
                  key={service.id}
                  className="group bg-white p-10 rounded-[3.5rem] border border-slate-100 hover:border-[#3D8BF2]/20 hover:shadow-4xl transition-all duration-700 cursor-pointer flex flex-col h-full"
                  onClick={() => onBook(service)}
                >
                  <div className="flex justify-between items-start mb-12">
                    <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center bg-[#F2F2F2] text-[#3D8BF2] group-hover:bg-[#3D8BF2] group-hover:text-white transition-all duration-700">
                      <Icon size={36} />
                    </div>
                    <ArrowUpRight size={24} className="text-slate-200 group-hover:text-[#0BD99E] transition-all group-hover:rotate-12" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{service.title}</h3>
                  <p className="text-sm text-slate-500 font-medium mb-12 flex-grow leading-relaxed">{service.desc}</p>
                  
                  <div className="space-y-4 mb-12 border-t border-slate-100 pt-8">
                    {service.subServices.slice(0, 4).map((sub, i) => (
                      <div key={i} className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3D8BF2]"></div>
                        {sub}
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-6 bg-slate-950 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 group-hover:bg-[#3D8BF2] transition-all">
                    Solicitar Soporte JH&F
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
