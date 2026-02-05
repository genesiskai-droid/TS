
import React, { useState } from 'react';
import { 
  X, ShieldCheck, CreditCard, Landmark, CheckCircle2, 
  Receipt, Smartphone, Check, Sparkles, Wallet, Globe, Loader2
} from 'lucide-react';
import { Ticket, BillingDetails, WarrantySelection } from '../types';

interface PaymentCheckoutProps {
  ticket: Ticket;
  onCancel: () => void;
  onSuccess: (updatedData: Partial<Ticket>) => void;
}

const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({ ticket, onCancel, onSuccess }) => {
  const [step, setStep] = useState<'warranty' | 'payment' | 'billing' | 'finalizing'>('warranty');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'caja' | 'paypal'>('online');
  const [onlineSubMethod, setOnlineSubMethod] = useState<'card' | 'qr' | 'transfer'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Garantía State
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantySelection>({ months: 0, percentage: 0, cost: 0 });

  // Facturación State
  const initialBillingType = ticket.clientId.length === 11 ? 'factura' : 'boleta';
  const [billing, setBilling] = useState<BillingDetails>({
    type: initialBillingType,
    documentId: ticket.clientId,
    name: ticket.client,
    address: ticket.location || '',
    email: ''
  });

  const baseAmount = ticket.estimatedCost;
  const totalAmount = baseAmount + selectedWarranty.cost;

  const handleApplyWarranty = (months: 1 | 3 | 6, pct: number) => {
    const cost = baseAmount * (pct / 100);
    setSelectedWarranty({ months, percentage: pct, cost });
  };

  const handleFinalPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
    }, 2500);
  };

  const confirmFinalization = () => {
    onSuccess({
      status: 'Pago',
      cost: totalAmount,
      selectedWarranty,
      billing,
      paymentMethod: paymentMethod === 'caja' ? 'Efectivo en Caja' : (paymentMethod === 'online' ? `Online (${onlineSubMethod})` : 'PayPal'),
      history: [...ticket.history, { 
        status: 'Pago', 
        timestamp: new Date().toLocaleString(), 
        note: `Pago procesado exitosamente. Factura electrónica emitida.` 
      }]
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#050811]/95 backdrop-blur-xl animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-3xl overflow-hidden flex flex-col max-h-[95vh] border border-white/10">
        
        {/* Cabecera con cierre corregido */}
        <div className="bg-slate-950 p-8 text-white flex justify-between items-center relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3D8BF2] rounded-full blur-[100px] opacity-10"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#3D8BF2] border border-white/5">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Liquidación & Garantía Elite</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket #{ticket.id} • Transacción Protegida</p>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onCancel(); }} 
            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all active:scale-90 border border-white/10 group z-50"
          >
            <X size={24} className="text-slate-400 group-hover:text-white" />
          </button>
        </div>

        <div className="p-10 overflow-y-auto flex-grow bg-white custom-scroll">
          
          {step === 'warranty' && (
            <div className="animate-in slide-in-from-bottom-8 duration-500 space-y-10">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                  <Sparkles size={16} className="text-[#3D8BF2] animate-pulse" />
                  <span className="text-[10px] font-black text-[#3D8BF2] uppercase tracking-[0.2em]">Protección TechGuard Plus</span>
                </div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Asegure su Inversión</h3>
                <p className="text-slate-500 font-medium max-w-lg mx-auto italic text-sm">"Protección extendida para evitar paradas operativas inesperadas."</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { months: 1, pct: 10, label: 'Standard', color: 'border-slate-200 bg-slate-50' },
                  { months: 3, pct: 20, label: 'Professional', color: 'border-[#3D8BF2] bg-blue-50/30 ring-2 ring-[#3D8BF2]/10' },
                  { months: 6, pct: 30, label: 'Enterprise', color: 'border-slate-900 bg-slate-950 text-white' }
                ].map((plan) => (
                  <button 
                    key={plan.months}
                    onClick={() => handleApplyWarranty(plan.months as 1|3|6, plan.pct)}
                    className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-6 relative group active:scale-95 ${plan.color} ${selectedWarranty.months === plan.months ? 'scale-105 shadow-2xl' : 'opacity-60 hover:opacity-100'}`}
                  >
                    {selectedWarranty.months === plan.months && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0BD99E] text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg animate-bounce">Plan Seleccionado</div>}
                    <div className="text-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 block opacity-60">{plan.label}</span>
                      <h4 className="text-3xl font-black">{plan.months} {plan.months === 1 ? 'MES' : 'MESES'}</h4>
                    </div>
                    <div className="text-2xl font-black">S/. {(baseAmount * (plan.pct / 100)).toFixed(2)}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <button onClick={() => { setSelectedWarranty({months: 0, percentage: 0, cost: 0}); setStep('payment'); }} className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900">Omitir garantía</button>
                <button 
                  onClick={() => setStep('payment')}
                  className="bg-[#3D8BF2] text-white px-12 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all hover:bg-[#29A5F2] active:scale-95"
                >
                  Continuar al Pago
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="animate-in slide-in-from-right duration-500 space-y-10">
              <div className="flex bg-slate-100 p-1.5 rounded-[2rem] border border-slate-200">
                <button onClick={() => setPaymentMethod('online')} className={`flex-1 py-5 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all ${paymentMethod === 'online' ? 'bg-[#3D8BF2] text-white shadow-xl' : 'text-slate-400'}`}>PAGOS EN LÍNEA</button>
                <button onClick={() => setPaymentMethod('caja')} className={`flex-1 py-5 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all ${paymentMethod === 'caja' ? 'bg-[#3D8BF2] text-white shadow-xl' : 'text-slate-400'}`}>PAGO EN CAJA (EFECTIVO)</button>
                <button onClick={() => setPaymentMethod('paypal')} className={`flex-1 py-5 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all ${paymentMethod === 'paypal' ? 'bg-indigo-900 text-white shadow-xl' : 'text-slate-400'}`}>PAYPAL</button>
              </div>

              {paymentMethod === 'online' && (
                <div className="grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-4 space-y-4">
                    <button onClick={() => setOnlineSubMethod('card')} className={`w-full p-6 border-2 rounded-3xl flex items-center gap-4 transition-all ${onlineSubMethod === 'card' ? 'border-[#3D8BF2] bg-blue-50/50' : 'border-slate-100'}`}>
                      <CreditCard className={onlineSubMethod === 'card' ? 'text-[#3D8BF2]' : 'text-slate-300'} />
                      <span className="text-[10px] font-black uppercase">TARJETAS DÉBITO/CRÉDITO</span>
                    </button>
                    <button onClick={() => setOnlineSubMethod('qr')} className={`w-full p-6 border-2 rounded-3xl flex items-center gap-4 transition-all ${onlineSubMethod === 'qr' ? 'border-[#3D8BF2] bg-blue-50/50' : 'border-slate-100'}`}>
                      <Wallet className={onlineSubMethod === 'qr' ? 'text-[#3D8BF2]' : 'text-slate-300'} />
                      <span className="text-[10px] font-black uppercase">YAPE / PLIN (QR)</span>
                    </button>
                    <button onClick={() => setOnlineSubMethod('transfer')} className={`w-full p-6 border-2 rounded-3xl flex items-center gap-4 transition-all ${onlineSubMethod === 'transfer' ? 'border-[#3D8BF2] bg-blue-50/50' : 'border-slate-100'}`}>
                      <Landmark className={onlineSubMethod === 'transfer' ? 'text-[#3D8BF2]' : 'text-slate-300'} />
                      <span className="text-[10px] font-black uppercase">TRANSFERENCIA / CIP</span>
                    </button>
                  </div>

                  <div className="lg:col-span-8 bg-slate-50 p-8 rounded-[3rem] border border-slate-100 flex flex-col justify-center">
                    {onlineSubMethod === 'card' && (
                      <div className="space-y-6 animate-in fade-in">
                        <input className="w-full p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold" placeholder="Número de Tarjeta" />
                        <div className="grid grid-cols-2 gap-4">
                          <input className="p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold" placeholder="MM/AA" />
                          <input className="p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold" placeholder="CVV" />
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase text-center tracking-widest">PROTOCOLO DE SEGURIDAD CIFRADO AES-256</p>
                      </div>
                    )}
                    {onlineSubMethod === 'qr' && (
                      <div className="flex flex-col items-center gap-6 animate-in zoom-in">
                         <div className="w-48 h-48 bg-white p-4 rounded-3xl border border-slate-200 shadow-xl flex items-center justify-center">
                            <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center"><Smartphone className="text-white" size={40} /></div>
                         </div>
                         <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Escanee con Yape o Plin</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-10 border-t border-slate-100">
                <button onClick={() => setStep('warranty')} className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Atrás a Garantía</button>
                <button onClick={() => setStep('billing')} className="bg-slate-900 text-white px-12 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Continuar a Facturación</button>
              </div>
            </div>
          )}

          {step === 'billing' && (
            <div className="animate-in slide-in-from-right duration-500 space-y-10">
               <div className="text-center">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Facturación Electrónica</h3>
               </div>
               <div className="max-w-xl mx-auto space-y-6">
                  <input className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black" value={billing.documentId} readOnly />
                  <input className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black" value={billing.name} readOnly />
                  <button 
                    onClick={() => { setStep('finalizing'); handleFinalPayment(); }}
                    className="w-full py-6 bg-[#3D8BF2] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-[#29A5F2] active:scale-95 transition-all"
                  >
                    CONFIRMAR & PAGAR S/. {totalAmount.toFixed(2)}
                  </button>
               </div>
            </div>
          )}

          {step === 'finalizing' && (
            <div className="text-center py-20 space-y-10 animate-in zoom-in">
               {isProcessing ? (
                 <div className="space-y-8">
                    <div className="w-20 h-20 border-4 border-[#3D8BF2] border-t-transparent animate-spin rounded-full mx-auto"></div>
                    <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Procesando Transacción JH&F...</h4>
                 </div>
               ) : isDone ? (
                 <div className="space-y-10">
                   <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl"><Check size={48} strokeWidth={3} /></div>
                   <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">PAGO CONFIRMADO</h3>
                   <button onClick={confirmFinalization} className="bg-slate-900 text-white px-16 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all active:scale-95">
                     FINALIZAR OPERACIÓN
                   </button>
                 </div>
               ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
