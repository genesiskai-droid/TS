
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, Check, ShoppingCart, MapPin, Printer, Download, CreditCard, ChevronRight, User, Mail, Phone, Smartphone, Package, ShieldCheck, Lock, Cpu, Network, Calendar, Clock, FileText, ChevronLeft, ArrowRight, Eye, EyeOff, Building, Map as MapIcon, Navigation, FileSearch, Edit2, ClipboardList, AlertCircle, AlertTriangle, CheckCircle, Pencil, CreditCard as IdIcon, LocateFixed, ShieldAlert, Zap, Wind, Code, Shield, CheckCircle2, FileSignature, Receipt, Hammer, FileCheck, Smartphone as PhoneIcon, ShieldQuestion, Loader2, Building2 } from 'lucide-react';
import { ServiceItem, CartItem, Ticket, Client } from '../types';
import { DEVICE_TYPES, SERVICES_CATALOG, INITIAL_CLIENTS } from '../constants';

interface BookingWizardProps {
  initialCategory: ServiceItem | null;
  currentClient: Client | null;
  onClose: () => void;
  onSuccess: (ticket: Ticket) => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ initialCategory, currentClient, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [step2Sub, setStep2Sub] = useState<'schedule' | 'applicant' | 'proforma'>('schedule');
  
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Estados Paso 3: Identidad
  const [identitySub, setIdentitySub] = useState<'login' | 'recovery' | 'quickAccess' | 'register' | 'verify' | 'reset' | 'summary'>('login');
  const [authTab, setAuthTab] = useState<'email' | 'id'>('email');
  const [recoveryTab, setRecoveryTab] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [verificationTarget, setVerificationTarget] = useState<'login' | 'register' | 'quick'>('login');

  // Credenciales de login reactivas
  const [loginInput, setLoginInput] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  
  const [selectedCatId, setSelectedCatId] = useState(initialCategory?.id || 'computo');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedSubService, setSelectedSubService] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [modality, setModality] = useState<'Taller' | 'Sede'>('Sede');
  const [address, setAddress] = useState('');
  const [gpsLocationText, setGpsLocationText] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  const today = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const [bookingDate, setBookingDate] = useState(today);
  const [bookingTime, setBookingTime] = useState('');
  const [techNotes, setTechNotes] = useState('');
  const [applicantData, setApplicantData] = useState({
    id: currentClient?.id || '',
    name: currentClient ? `${currentClient.name} ${currentClient.lastName || ''}`.trim() : '',
    email: currentClient?.email || '',
    phone: currentClient?.phone || '',
    fiscalAddress: currentClient?.address || ''
  });

  const isClientFormFilled = loginInput.length > 0 && loginPass.length > 0;

  const itemsSubtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);
  const isAddReady = useMemo(() => !!selectedDevice && !!selectedSubService, [selectedDevice, selectedSubService]);
  const visitFee = modality === 'Sede' ? 50 : 0;
  
  const baseImponible = itemsSubtotal + visitFee;
  const igv = baseImponible * 0.18;
  const totalInversion = baseImponible + igv;

  const timeSlots = [
    { label: '08:00 - 10:00', startHour: 8 },
    { label: '10:00 - 12:00', startHour: 10 },
    { label: '14:00 - 16:00', startHour: 14 },
    { label: '16:00 - 18:00', startHour: 16 },
    { label: '18:00 - 20:00', startHour: 18 }
  ];

  const isSlotAvailable = (slotHour: number) => {
    const now = new Date();
    const isToday = bookingDate === today;
    if (bookingDate < today) return false;
    if (!isToday) return true;
    return slotHour >= now.getHours() + 3;
  };

  const handleGpsRequest = () => {
    if (navigator.geolocation) {
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lon = pos.coords.longitude.toFixed(6);
          setGpsLocationText("GPS REGISTRADO OK");
          if (!address) setAddress(`Coord: ${lat}, ${lon}`);
          setGpsLoading(false);
        },
        () => { setGpsLoading(false); alert("GPS no disponible."); },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleAddToCart = () => {
    if (!selectedDevice || !selectedSubService) return;
    const cat = SERVICES_CATALOG.find(c => c.id === selectedCatId)!;
    const newItem: CartItem = {
      id: Date.now(),
      categoryName: cat.title,
      device: selectedDevice,
      serviceName: selectedSubService,
      quantity,
      price: cat.basePrice
    };
    setCart([...cart, newItem]);
    setSelectedDevice('');
    setSelectedSubService('');
    setQuantity(1);
  };

  const handleEditItem = (item: CartItem) => {
    const cat = SERVICES_CATALOG.find(c => c.title === item.categoryName);
    if (cat) setSelectedCatId(cat.id);
    setSelectedDevice(item.device);
    setSelectedSubService(item.serviceName);
    setQuantity(item.quantity);
    setCart(cart.filter(c => c.id !== item.id));
  };

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => {
      const newTicket: Ticket = {
        id: `P-${Math.floor(100000 + Math.random() * 900000)}`,
        type: 'Mantenimiento',
        title: cart.length > 1 ? `Pack de Soluciones (${cart.length} ítems)` : `${cart[0].serviceName} - ${cart[0].device}`,
        status: 'Registrado',
        priority: 'Normal',
        client: applicantData.name || 'Cliente Particular',
        clientId: applicantData.id || 'N/A',
        date: bookingDate,
        location: modality === 'Sede' ? (address || 'Ubicación Sede') : 'Sede Central TechNova',
        estimatedCost: totalInversion,
        modality: modality === 'Sede' ? 'Domicilio' : 'Taller',
        history: [{ status: 'Registrado', timestamp: new Date().toLocaleString(), note: 'Reserva confirmada vía portal.' }]
      };
      onSuccess(newTicket);
      setLoading(false);
    }, 1200);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...verificationCode];
    newCode[index] = value.substring(value.length - 1);
    setVerificationCode(newCode);
    if (value && index < 3) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const validateFinalCode = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsLogged(true);
      setIdentitySub('summary');
    }, 1200);
  };

  const openDatePicker = () => {
    if (dateInputRef.current) {
      try {
        (dateInputRef.current as any).showPicker();
      } catch (err) {
        dateInputRef.current.focus();
        dateInputRef.current.click();
      }
    }
  };

  const iconMap: Record<string, any> = { Cpu, Network, Shield, Zap, Printer, Wind, Code };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        <div className="px-10 py-8 border-b flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter">TechNova <span className="text-[#3D8BF2]">Solutions</span></h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 opacity-80">GESTIÓN DE RESERVA JH&F • PASO {step} DE 3</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-full transition-all"><X className="text-slate-400" /></button>
        </div>

        <div className="p-10 overflow-y-auto flex-grow bg-white custom-scroll">
          {step === 1 && (
            <div className="grid lg:grid-cols-5 gap-8 animate-in fade-in">
               <div className="lg:col-span-3 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">LÍNEA DE SERVICIO</label>
                    <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-bold outline-none" value={selectedCatId} onChange={(e) => { setSelectedCatId(e.target.value); setSelectedDevice(''); }}>
                      {SERVICES_CATALOG.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">TIPO DE EQUIPO</label>
                    <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-bold outline-none" value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)}>
                      <option value="">Seleccione equipo...</option>
                      {DEVICE_TYPES[selectedCatId]?.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">ACTIVIDAD ESPECÍFICA</label>
                    <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-bold outline-none" value={selectedSubService} onChange={(e) => setSelectedSubService(e.target.value)}>
                      <option value="">Seleccione actividad...</option>
                      {SERVICES_CATALOG.find(c => c.id === selectedCatId)?.subServices.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">CANTIDAD</label><input type="number" min="1" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-bold outline-none" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /></div>
                </div>
                <button onClick={handleAddToCart} disabled={!isAddReady} className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 ${!isAddReady ? 'bg-[#E5E7EB] text-slate-400' : 'bg-[#F26D21] text-white shadow-[#F26D21]/20'}`}>
                  <ShoppingCart size={18} /> AÑADIR AL CARRITO
                </button>
                <div className="space-y-6 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setModality('Taller')} className={`p-5 rounded-[1.8rem] border-2 flex items-center gap-4 transition-all ${modality === 'Taller' ? 'border-slate-900 bg-white' : 'border-slate-100 bg-slate-50 text-slate-400'}`}><div className="p-3 bg-slate-100 rounded-2xl"><Package size={24} /></div><div className="text-left leading-tight"><span className="block font-black text-xs uppercase">SEDE CENTRAL</span><span className="text-[8px] font-bold opacity-60 uppercase">ENTREGA EN TALLER</span></div></button>
                    <button onClick={() => setModality('Sede')} className={`p-5 rounded-[1.8rem] border-2 flex items-center gap-4 transition-all ${modality === 'Sede' ? 'border-slate-900 bg-white' : 'border-slate-100 bg-slate-50 text-slate-400'}`}><div className="p-3 bg-[#3D8BF2] text-white rounded-2xl"><MapPin size={24} /></div><div className="text-left leading-tight"><span className="block font-black text-xs uppercase tracking-tight">En sus instalaciones / Sede</span><span className="text-[8px] font-bold opacity-60 uppercase tracking-tight">+ S/. 50.00 MOVILIDAD</span></div></button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">DIRECCIÓN DE ATENCIÓN</label><input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" placeholder="Ej: Av. Industrial 500, Huancayo" value={address} onChange={(e) => setAddress(e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={handleGpsRequest} className={`py-5 border-2 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 ${gpsLocationText ? 'bg-[#0BD99E] border-[#0BD99E] text-white' : 'border-[#0BD99E] text-[#0BD99E]'}`}><LocateFixed size={20} /> {gpsLocationText || "GPS REGISTRADO"}</button>
                      <button onClick={() => setIsMapOpen(true)} className="py-5 border-2 border-slate-950 text-slate-950 bg-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"><MapIcon size={20} /> SELECCIONAR EN MAPA</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="bg-[#050811] rounded-[3.5rem] p-8 text-white h-full flex flex-col shadow-2xl min-h-[550px]">
                  <div className="flex items-center gap-3 mb-8"><div className="w-2 h-2 rounded-full bg-[#0BD99E] animate-pulse"></div><h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-400">PACK DE SOLUCIONES JH&F</h4></div>
                  <div className="flex-grow space-y-4 overflow-y-auto pr-2 custom-scroll max-h-[350px]">
                    {cart.map(item => (<div key={item.id} className="bg-white/5 p-5 rounded-3xl border border-white/5"><div className="flex justify-between items-start mb-4"><div><p className="text-[8px] font-black text-[#3D8BF2] uppercase tracking-[0.2em] mb-1">{item.categoryName}</p><h5 className="font-black text-[11px] text-white uppercase">{item.device}</h5><p className="text-[8px] text-slate-500 font-bold uppercase mt-1">x{item.quantity} · S/. {item.price.toFixed(2)}</p></div><button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="text-white/20 hover:text-red-500"><X size={14} /></button></div><div className="flex justify-between items-center pt-4 border-t border-white/10"><button onClick={() => handleEditItem(item)} className="text-[#F26D21] font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5"><Pencil size={12} /> EDITAR</button><span className="font-black text-base text-white">S/. {(item.price * item.quantity).toFixed(2)}</span></div></div>))}
                    {modality === 'Sede' && (<div className="bg-[#3D8BF2]/10 p-5 rounded-3xl border border-[#3D8BF2]/20 flex justify-between items-center"><div><p className="text-[9px] font-black text-[#3D8BF2] uppercase tracking-widest">SOPORTE MÓVIL JH&F</p><p className="text-[7px] font-bold text-slate-500 uppercase">Tasa Única Sede</p></div><span className="font-black text-base text-white">S/. 50.00</span></div>)}
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase"><span>SUBTOTAL</span><span>S/. {baseImponible.toFixed(2)}</span></div>
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase"><span>IGV (18%)</span><span>S/. {igv.toFixed(2)}</span></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center"><span className="text-[9px] font-black text-slate-500 uppercase">INVERSIÓN FINAL</span><span className="font-black text-white text-4xl">S/. {totalInversion.toFixed(2)}</span></div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right duration-500 h-full">
              {step2Sub === 'schedule' && (
                <div className="grid lg:grid-cols-2 gap-12 items-start h-full">
                  <div className="space-y-8">
                    <div><h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">2. AGENDAMIENTO</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">OPERATIVO JH&F</p></div>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">FECHA DE INTERVENCIÓN</label>
                        <div className="relative flex items-center">
                          <input 
                            ref={dateInputRef}
                            type="date" 
                            min={today} 
                            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-l-[2rem] text-sm font-black outline-none focus:border-[#3D8BF2] transition-all" 
                            value={bookingDate} 
                            onChange={(e) => { setBookingDate(e.target.value); setBookingTime(''); }} 
                          />
                          <button 
                            type="button"
                            onClick={openDatePicker}
                            className="p-5 bg-white border border-slate-200 border-l-0 rounded-r-[2rem] text-[#3D8BF2] hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                          >
                            <Calendar size={22} />
                          </button>
                        </div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Seleccione una fecha válida (desde hoy en adelante)</p>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">HORARIO DE SOPORTE JH&F</label>
                        <div className="grid gap-2">
                          {timeSlots.map(slot => (<button key={slot.label} disabled={!isSlotAvailable(slot.startHour)} onClick={() => setBookingTime(slot.label)} className={`w-full p-5 rounded-[1.8rem] border-2 flex items-center justify-between transition-all ${bookingTime === slot.label ? 'border-slate-900 bg-white shadow-md shadow-slate-200' : 'border-slate-100 bg-white/50 text-slate-500'}`}><span className="font-black text-xs uppercase">{slot.label}</span>{bookingTime === slot.label ? <CheckCircle2 size={18} className="text-[#0BD99E]" /> : <Clock size={16} className="opacity-20" />}</button>))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">OBSERVACIONES TÉCNICAS (OPCIONAL)</label><textarea className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] text-sm font-bold h-44 resize-none shadow-inner" placeholder="Especifique fallos..." value={techNotes} onChange={(e) => setTechNotes(e.target.value)} /></div>
                    <div className="bg-[#050811] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"><div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#3D8BF2] border border-white/5"><FileSearch size={24} /></div><div><h4 className="text-lg font-black uppercase tracking-tight">PROFORMA</h4><span className="text-[9px] font-black text-[#3D8BF2] uppercase tracking-widest">OPCIONAL JH&F</span></div></div><button onClick={() => setStep2Sub('applicant')} className="w-full py-5 bg-[#3D8BF2] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#29A5F2] active:scale-95 transition-all">GENERAR PROFORMA DIGITAL</button></div>
                  </div>
                </div>
              )}
              {step2Sub === 'applicant' && (
                <div className="max-w-2xl mx-auto py-4 space-y-10 animate-in zoom-in"><div className="text-center"><div className="w-20 h-20 bg-[#F26D21]/10 text-[#F26D21] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"><ClipboardList size={36} /></div><h3 className="text-3xl font-black text-slate-900 uppercase">Datos del Solicitante</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">REQUERIDO PARA EL ACTA DE CONFORMIDAD JH&F</p></div><div className="bg-white border border-slate-50 p-10 rounded-[4rem] shadow-2xl space-y-6"><div className="grid grid-cols-2 gap-6"><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 ml-4">ID (DNI/RUC)</label><input className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black outline-none focus:border-[#F26D21]" placeholder="DOC..." value={applicantData.id} onChange={(e) => setApplicantData({...applicantData, id: e.target.value})} /></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 ml-4">CORREO CORPORATIVO</label><input className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black outline-none focus:border-[#F26D21]" placeholder="jose@mail.com" value={applicantData.email} onChange={(e) => setApplicantData({...applicantData, email: e.target.value})} /></div></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 ml-4">NOMBRE O RAZÓN SOCIAL</label><input className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black outline-none focus:border-[#F26D21]" placeholder="Ej: TechNova Solutions SAC" value={applicantData.name} onChange={(e) => setApplicantData({...applicantData, name: e.target.value})} /></div><div className="grid grid-cols-2 gap-6"><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 ml-4">DIRECCIÓN FISCAL</label><input className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black outline-none focus:border-[#F26D21]" placeholder="Dirección..." value={applicantData.fiscalAddress} onChange={(e) => setApplicantData({...applicantData, fiscalAddress: e.target.value})} /></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 ml-4">TELÉFONO</label><input className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black outline-none focus:border-[#F26D21]" placeholder="+51 ..." value={applicantData.phone} onChange={(e) => setApplicantData({...applicantData, phone: e.target.value})} /></div></div><button onClick={() => setStep2Sub('proforma')} className="w-full py-6 bg-[#F26D21] text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 mt-4">VALIDAR Y GENERAR PROFORMA <ChevronRight size={18}/></button></div></div>
              )}
              {step2Sub === 'proforma' && (
                <div className="flex flex-col items-center py-4 space-y-8 animate-in zoom-in">
                  <div className="bg-white p-12 rounded-2xl shadow-3xl border border-slate-200 w-full max-w-2xl proforma-paper relative">
                    <button onClick={() => setStep2Sub('schedule')} className="absolute top-8 right-8 w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400"><X size={20} /></button>
                    <div className="flex justify-between items-start mb-12">
                      <div className="flex gap-4"><div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-[#3D8BF2]"><Cpu size={32} /></div><div><h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">TechNova Solutions JH&F</h4><p className="text-[9px] font-black text-slate-400">RUC: 10403179227</p></div></div>
                      <div className="text-right uppercase"><h4 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">PROFORMA</h4><p className="text-[10px] font-black text-slate-400">FECHA: {today}</p></div>
                    </div>
                    <table className="w-full text-left mb-12 text-[10px] border-t-2 border-slate-900 pt-8">
                      <thead><tr className="border-b-2 border-slate-900 font-black text-slate-400 uppercase tracking-widest"><th className="pb-3">DESCRIPCIÓN</th><th className="pb-3 text-center">CANT</th><th className="pb-3 text-right">TOTAL</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {cart.map(item => (<tr key={item.id} className="font-bold"><td className="py-5 uppercase">{item.serviceName} - {item.device}</td><td className="py-5 text-center">{item.quantity}</td><td className="py-5 text-right">S/. {(item.price * item.quantity).toFixed(2)}</td></tr>))}
                        {modality === 'Sede' && (<tr className="font-bold"><td className="py-5 uppercase">MOVILIDAD / SOPORTE SEDE</td><td className="py-5 text-center">1</td><td className="py-5 text-right">S/. 50.00</td></tr>)}
                      </tbody>
                    </table>
                    <div className="flex flex-col items-end pt-6 border-t border-slate-900 space-y-2">
                       <div className="flex justify-between w-64 text-[10px] font-black text-slate-400 uppercase tracking-widest"><span>SUBTOTAL</span><span className="text-slate-900 font-black">S/. {baseImponible.toFixed(2)}</span></div>
                       <div className="flex justify-between w-64 text-[10px] font-black text-slate-400 uppercase tracking-widest"><span>IGV (18.00%)</span><span className="text-slate-900 font-black">S/. {igv.toFixed(2)}</span></div>
                       <div className="flex justify-between w-full text-4xl font-black pt-5 border-t-2 border-slate-900 text-slate-900 uppercase"><span>TOTAL</span><span>S/. {totalInversion.toFixed(2)}</span></div>
                    </div>
                  </div>
                  <div className="w-full max-w-2xl space-y-4">
                    <div className="flex gap-4"><button onClick={() => setStep2Sub('applicant')} className="flex-1 py-5 bg-slate-800 text-white rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest">EDITAR DATOS</button><button onClick={() => setStep2Sub('schedule')} className="flex-1 py-5 border-2 border-slate-200 text-slate-600 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest">EDITAR AGENDAMIENTO</button></div>
                    <button className="w-full py-6 bg-[#050811] text-white rounded-[1.2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3"><Download size={20} /> DESCARGAR PDF</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right duration-500 h-full flex items-center justify-center">
              
              {identitySub === 'login' && (
                <div className="w-full max-w-xl mx-auto space-y-8 animate-in zoom-in">
                   <div className="text-center space-y-3"><div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-8 transition-all duration-500 ${isClientFormFilled ? 'bg-[#3D8BF2] text-white ring-blue-50' : 'bg-blue-50 text-[#3D8BF2] ring-blue-50/50'}`}><ShieldCheck size={40} /></div><h3 className="text-4xl font-black text-slate-900 uppercase leading-none tracking-tighter">IDENTIDAD JH&F</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">VERIFICACIÓN DE SEGURIDAD TECHNOVA</p></div>
                   <div className="bg-white border border-slate-50 p-10 rounded-[4rem] shadow-2xl space-y-8">
                      <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-100"><button onClick={() => setAuthTab('email')} className={`flex-1 py-5 text-[10px] font-black uppercase rounded-2xl transition-all ${authTab === 'email' ? 'bg-[#3D8BF2] text-white shadow-xl' : 'text-slate-400'}`}>CORREO</button><button onClick={() => setAuthTab('id')} className={`flex-1 py-5 text-[10px] font-black uppercase rounded-2xl transition-all ${authTab === 'id' ? 'bg-[#3D8BF2] text-white shadow-xl' : 'text-slate-400'}`}>DNI/RUC</button></div>
                      <div className="space-y-6">
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{authTab === 'email' ? 'CORREO CORPORATIVO' : 'ID (DNI/RUC)'}</label><input className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black outline-none focus:border-[#3D8BF2]" placeholder={authTab === 'email' ? "jose@mail.com" : "00000000"} value={loginInput} onChange={(e) => setLoginInput(e.target.value)} /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">CONTRASEÑA MAESTRA</label><div className="relative"><input type={showPassword ? "text" : "password"} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black outline-none pr-14" placeholder="••••••••" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} /><button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">{showPassword ? <EyeOff size={22} /> : <Eye size={22} />}</button></div><div className="flex justify-end pr-2"><button onClick={() => setIdentitySub('recovery')} className="text-[11px] font-black text-[#3D8BF2] uppercase hover:underline">RECUPERAR ACCESO</button></div></div>
                        <div className="space-y-4 pt-4"><button disabled={!isClientFormFilled} onClick={() => { setIsLogged(true); setIdentitySub('summary'); }} className={`w-full py-6 rounded-[2.5rem] font-black text-[11px] uppercase transition-all duration-300 active:scale-95 ${isClientFormFilled ? 'bg-[#3D8BF2] text-white shadow-xl shadow-blue-500/20' : 'bg-slate-100 text-slate-400 shadow-none'}`}>INGRESAR AL PORTAL</button><button onClick={() => setIdentitySub('quickAccess')} className="w-full py-6 border-2 border-slate-100 text-slate-900 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3"><PhoneIcon size={18} /> CLAVE DE ACCESO RÁPIDO</button></div>
                        <div className="pt-8 border-t border-slate-50 text-center"><p className="text-[10px] font-bold text-slate-400 uppercase mb-3">¿AÚN NO ES CLIENTE DE TECHNOVA?</p><button onClick={() => setIdentitySub('register')} className="text-[#3D8BF2] font-black text-[11px] uppercase hover:underline">SOLICITAR REGISTRO</button></div>
                      </div>
                   </div>
                </div>
              )}

              {identitySub === 'recovery' && (
                <div className="w-full max-w-xl mx-auto animate-in zoom-in">
                   <div className="bg-white border border-slate-50 p-12 rounded-[4rem] shadow-2xl space-y-10 relative overflow-hidden">
                      <button onClick={() => setIdentitySub('login')} className="absolute top-10 right-10 p-3 bg-slate-50 rounded-full text-slate-400"><X size={24}/></button>
                      <h3 className="text-5xl font-black text-slate-950 uppercase leading-none tracking-tighter">RECUPERAR</h3>
                      <div className="flex gap-8 border-b border-slate-100 pb-2"><button onClick={() => setRecoveryTab('email')} className={`text-[11px] font-black uppercase pb-3 relative ${recoveryTab === 'email' ? 'text-slate-950 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#3D8BF2]' : 'text-slate-400'}`}>CORREO</button><button onClick={() => setRecoveryTab('phone')} className={`text-[11px] font-black uppercase pb-3 relative ${recoveryTab === 'phone' ? 'text-slate-950 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#3D8BF2]' : 'text-slate-400'}`}>CELULAR</button></div>
                      <div className="space-y-8">
                        <div className="flex items-center gap-5 border-b-2 border-slate-100 pb-4"><Mail className="text-slate-400" size={24} /><input className="w-full bg-transparent text-xl font-black outline-none" placeholder={recoveryTab === 'email' ? "jose@mail.com" : "999 999 999"} /></div>
                        <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-200 flex items-start gap-5 transition-all shadow-sm">
                          <input type="checkbox" checked={policyAccepted} onChange={(e) => setPolicyAccepted(e.target.checked)} className="w-6 h-6 accent-[#F26D21] mt-0.5 cursor-pointer" />
                          <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">Acepto el procesamiento de mis datos bajo las <span className="text-[#3D8BF2] underline font-black uppercase">POLÍTICAS CORPORATIVAS DE TECHNOVA SOLUTIONS JH&F</span></p>
                        </div>
                        <button 
                          disabled={!policyAccepted} 
                          onClick={() => { setVerificationTarget('login'); setIdentitySub('verify'); }} 
                          className={`w-full py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${policyAccepted ? 'bg-[#F26D21] text-white shadow-orange-500/20' : 'bg-slate-100 text-slate-400'}`}
                        >
                          SOLICITAR CÓDIGO MAESTRO
                        </button>
                        <button onClick={() => setIdentitySub('login')} className="w-full flex items-center justify-center gap-3 text-[10px] font-black text-slate-400 uppercase"><ChevronLeft size={20} /> REGRESAR AL LOGIN</button>
                      </div>
                   </div>
                </div>
              )}

              {identitySub === 'quickAccess' && (
                <div className="w-full max-w-xl mx-auto animate-in zoom-in">
                   <div className="bg-white border border-slate-50 p-12 rounded-[4rem] shadow-2xl space-y-10 relative overflow-hidden">
                      <button onClick={() => setIdentitySub('login')} className="absolute top-10 right-10 p-3 bg-slate-50 rounded-full text-slate-400"><X size={24}/></button>
                      <h3 className="text-5xl font-black text-slate-950 uppercase leading-none tracking-tighter">ACCESO RÁPIDO</h3>
                      <div className="flex gap-8 border-b border-slate-100 pb-2"><button onClick={() => setRecoveryTab('email')} className={`text-[11px] font-black uppercase pb-3 relative ${recoveryTab === 'email' ? 'text-slate-950 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#3D8BF2]' : 'text-slate-400'}`}>CORREO</button><button onClick={() => setRecoveryTab('phone')} className={`text-[11px] font-black uppercase pb-3 relative ${recoveryTab === 'phone' ? 'text-slate-950 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#3D8BF2]' : 'text-slate-400'}`}>CELULAR</button></div>
                      <div className="space-y-8">
                        <div className="flex items-center gap-5 border-b-2 border-slate-100 pb-4"><Mail className="text-slate-400" size={24} /><input className="w-full bg-transparent text-xl font-black outline-none" placeholder={recoveryTab === 'email' ? "jose@mail.com" : "999 999 999"} /></div>
                        <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-200 flex items-start gap-5 transition-all shadow-sm">
                          <input type="checkbox" checked={policyAccepted} onChange={(e) => setPolicyAccepted(e.target.checked)} className="w-6 h-6 accent-[#F26D21] mt-0.5 cursor-pointer" />
                          <p className="text-[10px] font-bold text-slate-500 italic">Acepto las <span className="text-[#3D8BF2] underline font-black uppercase">POLÍTICAS DE SEGURIDAD JH&F</span></p>
                        </div>
                        <button 
                          disabled={!policyAccepted} 
                          onClick={() => { setVerificationTarget('quick'); setIdentitySub('verify'); }} 
                          className={`w-full py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${policyAccepted ? 'bg-[#F26D21] text-white shadow-orange-500/20' : 'bg-slate-100 text-slate-400'}`}
                        >
                          VALIDAR E INGRESAR
                        </button>
                      </div>
                   </div>
                </div>
              )}

              {identitySub === 'register' && (
                <div className="w-full max-w-xl mx-auto animate-in zoom-in">
                   <div className="bg-white border border-slate-50 p-12 rounded-[4rem] shadow-2xl space-y-10 relative overflow-hidden">
                      <button onClick={() => setIdentitySub('login')} className="absolute top-10 right-10 p-3 bg-slate-50 rounded-full text-slate-400"><X size={24}/></button>
                      <h3 className="text-5xl font-black text-slate-950 uppercase leading-none tracking-tighter text-center">REGISTRO</h3>
                      <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-4"><User className="text-slate-300" size={20} /><input className="w-full bg-transparent text-sm font-bold outline-none" placeholder="Nombre o Razón Social" /></div>
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-4"><IdIcon className="text-slate-300" size={20} /><input className="w-full bg-transparent text-sm font-bold outline-none" placeholder="Documento (DNI/RUC)" /></div>
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-4"><Smartphone className="text-slate-300" size={20} /><input className="w-full bg-transparent text-sm font-bold outline-none" placeholder="Celular" /></div>
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-4"><Mail className="text-slate-300" size={20} /><input className="w-full bg-transparent text-sm font-bold outline-none" placeholder="Correo Electrónico" /></div>
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-4"><MapPin className="text-slate-300" size={20} /><input className="w-full bg-transparent text-sm font-bold outline-none" placeholder="Dirección Fiscal" /></div>
                        <div className="bg-slate-50 p-6 rounded-[2rem] flex items-start gap-5"><input type="checkbox" onChange={(e) => setPolicyAccepted(e.target.checked)} className="w-6 h-6 accent-[#F26D21] mt-0.5" /><p className="text-[10px] font-bold text-slate-400 italic">Acepto los <span className="text-[#3D8BF2] underline font-black uppercase">TÉRMINOS DE SERVICIO JH&F</span></p></div>
                        <button 
                          disabled={!policyAccepted}
                          onClick={() => { setVerificationTarget('register'); setIdentitySub('verify'); }} 
                          className={`w-full py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 ${policyAccepted ? 'bg-[#F26D21] text-white shadow-orange-500/20' : 'bg-slate-100 text-slate-400'}`}
                        >
                          SOLICITAR REGISTRO
                        </button>
                      </div>
                   </div>
                </div>
              )}

              {identitySub === 'verify' && (
                <div className="w-full max-w-xl mx-auto animate-in zoom-in">
                   <div className="bg-white border border-slate-50 p-12 rounded-[4rem] shadow-2xl space-y-10 text-center relative overflow-hidden">
                      <div className="w-20 h-20 bg-emerald-50 text-[#0BD99E] rounded-full flex items-center justify-center mx-auto mb-6"><Smartphone size={40} /></div>
                      <h3 className="text-3xl font-black text-slate-950 uppercase leading-none tracking-tighter">VERIFICAR CÓDIGO</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ENVIAMOS UN CÓDIGO DE 4 DÍGITOS A TU DISPOSITIVO</p>
                      <div className="flex justify-center gap-4 py-4">{verificationCode.map((val, i) => (<input key={i} id={`code-${i}`} type="text" className="w-16 h-20 bg-slate-50 border-2 border-slate-100 rounded-2xl text-3xl font-black text-center outline-none focus:border-[#3D8BF2]" maxLength={1} value={val} onChange={(e) => handleCodeChange(i, e.target.value)} />))}</div>
                      <button onClick={validateFinalCode} className="w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl active:scale-95 flex items-center justify-center gap-3">{loading && <Loader2 size={18} className="animate-spin" />} VALIDAR CÓDIGO JH&F</button>
                   </div>
                </div>
              )}

              {identitySub === 'summary' && (
                <div className="w-full max-w-2xl mx-auto animate-in zoom-in duration-700 space-y-8">
                  <div className="bg-[#F0FDF4] p-10 rounded-[4rem] border border-emerald-100 flex flex-col items-center text-center space-y-6 shadow-sm">
                    <div className="w-24 h-24 bg-[#0BD99E] text-white rounded-full flex items-center justify-center shadow-xl animate-bounce">
                      <Check size={56} strokeWidth={3} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">HOLA, <span className="text-[#3D8BF2]">{applicantData.name.split(' ')[0].toUpperCase() || 'CLIENTE'}</span>.</h3>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">identidad validada con éxito.</p>
                    </div>
                    <div className="bg-white px-8 py-4 rounded-[2.5rem] shadow-sm border border-slate-50 flex items-center gap-3">
                       <Building2 className="text-[#0BD99E]" size={20} />
                       <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{address || 'Sede Central TechNova'}</span>
                    </div>
                  </div>

                  <div className="bg-[#050811] rounded-[4rem] p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8 opacity-40">
                       <div className="h-px w-8 bg-white"></div>
                       <span className="text-[9px] font-black uppercase tracking-[0.4em]">CONFIGURACIÓN DE SOLUCIÓN SELECCIONADA</span>
                    </div>

                    <div className="space-y-4 mb-10 max-h-[250px] overflow-y-auto pr-2 custom-scroll">
                      {cart.map(item => {
                        const cat = SERVICES_CATALOG.find(c => c.title === item.categoryName);
                        const Icon = iconMap[cat?.iconName || 'Cpu'];
                        return (
                          <div key={item.id} className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/10 transition-all">
                             <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#3D8BF2] border border-white/5">
                                  <Icon size={28} />
                                </div>
                                <div>
                                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.categoryName}</p>
                                   <h5 className="text-lg font-black uppercase tracking-tight leading-none mb-1">{item.device}</h5>
                                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.serviceName} x{item.quantity}</p>
                                </div>
                             </div>
                             <div className="text-right">
                               <span className="text-xl font-black text-white">S/. {(item.price * item.quantity).toFixed(2)}</span>
                             </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-end gap-10">
                       <div className="space-y-4 flex-grow w-full md:w-auto">
                          <div className="grid grid-cols-1 gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <div className="flex justify-between"><span>SUBTOTAL SERVICIOS</span><span className="text-white">S/. {itemsSubtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>TASA DOMICILIO</span><span className="text-white">S/. {visitFee.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>IGV (18.00%)</span><span className="text-white">S/. {igv.toFixed(2)}</span></div>
                          </div>
                          <div className="pt-4 border-t border-white/10">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">INVERSIÓN FINAL</span>
                            <div className="text-5xl font-black text-[#0BD99E] tracking-tighter leading-none">S/. {totalInversion.toFixed(2)}</div>
                          </div>
                       </div>
                       <div className="text-right space-y-1 shrink-0">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">CITA OPERATIVA</span>
                          <div className="text-xl font-black uppercase tracking-tight">{bookingDate}</div>
                          <div className="text-[10px] font-black text-[#3D8BF2] uppercase tracking-widest bg-[#3D8BF2]/10 px-4 py-1.5 rounded-xl inline-block mt-2">{bookingTime}</div>
                       </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleFinish}
                    className="w-full py-8 bg-[#F26D21] text-white rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all border border-white/5"
                  >
                    CONFIRMAR RESERVA <ArrowRight size={22} className="animate-pulse" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-10 border-t bg-white flex justify-between items-center shrink-0">
          <button onClick={() => { if (step === 3 && identitySub !== 'login') setIdentitySub('login'); else if (step > 1) setStep(step - 1); else onClose(); }} className="text-slate-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:text-slate-950 transition-colors"><ChevronLeft size={18} /> REGRESAR</button>
          <div className="flex items-center gap-2">{[1,2,3].map(i => (<div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-[#3D8BF2]' : 'bg-slate-200'}`}></div>))}</div>
          {step < 3 && (
            <button 
              disabled={loading || (step === 1 && cart.length === 0) || (step === 2 && !bookingTime)} 
              onClick={() => setStep(step + 1)} 
              className={`px-14 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center gap-3 bg-slate-950 text-white disabled:opacity-20`}
            >
              {loading ? 'PROCESANDO...' : 'SIGUIENTE PASO'}
            </button>
          )}
        </div>
      </div>

      {isMapOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in zoom-in"><div className="bg-white w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-2xl flex flex-col"><div className="p-10 border-b flex justify-between items-center bg-slate-50"><div className="flex items-center gap-4 text-slate-950"><Navigation className="text-[#3D8BF2]" /><h3 className="text-xl font-black uppercase tracking-tight">Geolocalización JH&F</h3></div><button onClick={() => setIsMapOpen(false)} className="p-4 hover:bg-slate-200 rounded-full transition-all"><X size={28} /></button></div><div className="p-6 h-[450px] bg-slate-100 flex items-center justify-center text-slate-300 font-black uppercase text-[10px] tracking-widest"><div className="flex flex-col items-center gap-4"><div className="w-16 h-16 border-4 border-slate-200 border-t-[#3D8BF2] rounded-full animate-spin"></div>[ NODO GEOGRÁFICO - SELECCIONE PUNTO ]</div></div><div className="p-10 bg-white"><button onClick={() => { setAddress("Punto Seleccionado en Mapa"); setIsMapOpen(false); setGpsLocationText("GPS MAPA OK"); }} className="w-full py-6 bg-slate-950 text-white rounded-[2.2rem] font-black text-[11px] uppercase tracking-widest active:scale-95">CONFIRMAR PUNTO DE INTERVENCIÓN</button></div></div></div>
      )}
    </div>
  );
};

export default BookingWizard;
