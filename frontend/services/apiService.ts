
import { Ticket, TicketStatus, UserRole, Client } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'; // Default to mock for demo

/**
 * API Service JH&F - Conexión con Backend NestJS
 * Usa fetch para comunicarse con el backend real
 * Si VITE_USE_MOCK=true, usa localStorage como fallback
 */

// Helper para obtener headers con JWT
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// === AUTH ===
export const authService = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },
};

// === BOOKINGS ===
export const bookingsApi = {
  getAll: async (): Promise<Ticket[]> => {
    const res = await fetch(`${API_URL}/bookings`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  getById: async (id: string): Promise<Ticket> => {
    const res = await fetch(`${API_URL}/bookings/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Booking not found');
    return res.json();
  },

  getByClient: async (clientId: string): Promise<Ticket[]> => {
    const res = await fetch(`${API_URL}/bookings/client/${clientId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch client bookings');
    return res.json();
  },

  create: async (data: Partial<Ticket>): Promise<Ticket> => {
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create booking');
    return res.json();
  },

  update: async (id: string, data: Partial<Ticket>): Promise<Ticket> => {
    const res = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update booking');
    return res.json();
  },
};

// === FALLBACK LOCALSTORAGE ===
export const ApiService = {
  // Obtener tickets (usa mock/localStorage)
  getTickets: async (): Promise<Ticket[]> => {
    if (USE_MOCK) {
      // Fallback a localStorage
      const data = localStorage.getItem('technova_tickets');
      return data ? JSON.parse(data) : [];
    }
    // Intentar API real
    try {
      return await bookingsApi.getAll();
    } catch {
      // Fallback a localStorage
      const data = localStorage.getItem('technova_tickets');
      return data ? JSON.parse(data) : [];
    }
  },

  // Guardar tickets (API + localStorage)
  saveTickets: async (tickets: Ticket[]): Promise<void> => {
    localStorage.setItem('technova_tickets', JSON.stringify(tickets));
  },

  // Lógica de transición de estados (igual que backend)
  canTransitionTo: (current: TicketStatus, next: TicketStatus): boolean => {
    const flow: Record<TicketStatus, TicketStatus[]> = {
      'Registrado': ['Asignado', 'Cancelado', 'En Taller', 'En Ruta'],
      'Asignado': ['En Taller', 'En Ruta', 'En Diagnóstico'],
      'En Taller': ['En Diagnóstico'],
      'En Ruta': ['En Diagnóstico'],
      'En Diagnóstico': ['Esperando Aprobación'],
      'Esperando Aprobación': ['En Reparación', 'Pago'],
      'En Reparación': ['Control Calidad'],
      'Control Calidad': ['Reparado'],
      'Reparado': ['Pago'],
      'Pago': ['Entrega'],
      'Entrega': [],
      'Cancelado': []
    };
    return flow[current]?.includes(next) || false;
  },

  // Auditoría de logs
  createHistoryEntry: (status: TicketStatus, note: string) => ({
    status,
    timestamp: new Date().toLocaleString(),
    note
  })
};
