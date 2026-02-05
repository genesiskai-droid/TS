
import React, { useState, useEffect } from 'react';
import { 
  Cpu, User, Settings, AlertTriangle, Plus, ShieldCheck, 
  LogOut as LogoutIcon, Search
} from 'lucide-react';
import { Ticket, UserRole, ServiceItem, Client } from './types';
import { SERVICES_CATALOG, INITIAL_TICKETS } from './constants';
import { ApiService } from './services/apiService';
import LandingPage from './components/LandingPage';
import ClientPortal from './components/ClientPortal';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import BookingWizard from './components/BookingWizard';
import TechLoginModal from './components/TechLoginModal';
import AuthModal from './components/AuthModal';
import SOSPanel from './components/SOSPanel';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'client' | 'admin' | 'manager' | 'sos'>('landing');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  
  // Cargar tickets desde el "backend" (ApiService)
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = ApiService.getTickets();
    return saved.length > 0 ? saved : INITIAL_TICKETS;
  });

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceItem | null>(null);

  // Sincronizar con el "backend" cada vez que cambian los tickets
  useEffect(() => {
    ApiService.saveTickets(tickets);
  }, [tickets]);

  const handleBooking = (cat: ServiceItem) => {
    setSelectedCategory(cat);
    setIsBookingOpen(true);
  };

  const handleTechLogin = (role: 'tech' | 'manager') => {
    setUserRole(role);
    setView(role === 'manager' ? 'manager' : 'admin');
    setIsLoginOpen(false);
  };

  const handleClientLogin = (client: Client) => {
    setCurrentClient(client);
    setUserRole('client');
    setView('client');
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUserRole(null);
    setCurrentClient(null);
    setView('landing');
  };

  const hasActiveWarranty = tickets.some(t => 
    t.clientId === currentClient?.id && 
    t.warrantyExpiry && 
    new Date(t.warrantyExpiry) > new Date()
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#3D8BF2] selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 transition-all duration-500 h-20 flex items-center bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('landing')}>
            <div className="p-2.5 rounded-2xl bg-slate-900 shadow-lg group-hover:rotate-3 transition-all duration-300">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter leading-none text-slate-950">
                TechNova <span className="text-[#3D8BF2]">Solutions</span>
              </h1>
              <span className="text-[7px] font-black bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-500 uppercase tracking-[0.2em] mt-1 w-fit">JH&F</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {userRole === 'client' ? (
              <>
                <div className="hidden md:flex items-center gap-3 pr-6 border-r border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#3D8BF2] border border-blue-100">
                    <User size={16} />
                  </div>
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                    {currentClient?.name} {currentClient?.lastName}
                  </span>
                </div>
                <button onClick={() => setView('sos')} className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-100 bg-red-50 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm">
                  <AlertTriangle size={12} className="animate-pulse" /> S.O.S
                </button>
                <button onClick={() => setIsBookingOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#0BD99E] text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg transition-all active:scale-95">
                  <Plus size={12} /> AGREGAR SERVICIO
                </button>
                <button onClick={logout} className="p-2.5 text-slate-400 hover:text-red-500 transition-all"><LogoutIcon size={24} /></button>
              </>
            ) : userRole === 'tech' || userRole === 'manager' ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
                   <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white"><ShieldCheck size={16}/></div>
                   <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{userRole === 'manager' ? 'TORRE CONTROL' : 'STAFF TÉCNICO'}</span>
                </div>
                <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-all"><LogoutIcon size={22} /></button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button onClick={() => setView('sos')} className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-100 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                  <AlertTriangle size={12} /> S.O.S
                </button>
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                   <button onClick={() => setIsAuthModalOpen(true)} className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Portal Cliente</button>
                   <button onClick={() => setIsLoginOpen(true)} className="bg-[#3D8BF2] text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Staff</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {view === 'landing' && <LandingPage onBook={handleBooking} />}
        {view === 'client' && <div className="pt-24"><ClientPortal tickets={tickets} setTickets={setTickets} currentClient={currentClient} setCurrentClient={setCurrentClient} /></div>}
        {view === 'admin' && <div className="pt-24"><AdminDashboard tickets={tickets} setTickets={setTickets} /></div>}
        {view === 'manager' && <div className="pt-24"><ManagerDashboard tickets={tickets} setTickets={setTickets} /></div>}
        {view === 'sos' && (
          <div className="pt-24 min-h-screen">
            <SOSPanel 
              onClose={() => setView(userRole === 'client' ? 'client' : 'landing')} 
              onTicketCreate={(newTicket) => {
                const entry = ApiService.createHistoryEntry('Registrado', 'Protocolo SOS activado vía portal.');
                setTickets([{ ...newTicket, history: [entry] }, ...tickets]);
              }}
              hasWarranty={hasActiveWarranty}
            />
          </div>
        )}
      </main>

      {isBookingOpen && (
        <BookingWizard 
          initialCategory={selectedCategory} 
          currentClient={currentClient}
          onClose={() => setIsBookingOpen(false)} 
          onSuccess={(t) => {
            setTickets([t, ...tickets]);
            setIsBookingOpen(false);
            setView('client');
          }} 
        />
      )}
      {isLoginOpen && <TechLoginModal onClose={() => setIsLoginOpen(false)} onSuccess={handleTechLogin} />}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onSuccess={handleClientLogin} />}
    </div>
  );
};

export default App;
