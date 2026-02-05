
export type UserRole = 'client' | 'tech' | 'manager' | 'caja' | null;

export type ClientType = 'natural' | 'juridica';

export interface Client {
  id: string; // DNI o RUC
  type: ClientType;
  name: string; // Nombres o Razón Social
  lastName?: string; // Solo para naturales
  email: string;
  phone: string;
  address: string;
  password?: string;
  createdAt: string;
}

export interface TechnicalStaff {
  id: string;
  dni: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  level: number;
  seniority: 'Senior' | 'Semi Senior' | 'Novato';
  specialty: string;
  secondarySkills?: string[];
  address: string;
  currentWorkload: number;
  isVersatile?: boolean;
}

export interface CartItem {
  id: number;
  categoryName: string;
  device: string;
  serviceName: string;
  quantity: number;
  price: number;
}

export type TicketStatus = 
  | 'Registrado' 
  | 'Asignado' 
  | 'En Taller' 
  | 'En Ruta' 
  | 'En Diagnóstico' 
  | 'Esperando Aprobación' 
  | 'En Reparación' 
  | 'Control Calidad' 
  | 'Reparado'
  | 'Pago'
  | 'Entrega' 
  | 'Cancelado';

export interface HistoryEntry {
  status: string;
  timestamp: string;
  note: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  price: number;
}

export interface TechnicalReport {
  techNotes: string;
  items: QuoteItem[];
  laborCost?: number;
  priceAdjustment?: number;
  adjustmentReason?: string;
  timestamp: string;
  clientResponse?: 'approved' | 'rejected' | 'customer_parts';
  clientNote?: string;
}

export interface BillingDetails {
  type: 'boleta' | 'factura';
  documentId: string;
  name: string;
  address: string;
  email: string;
}

export interface WarrantySelection {
  months: 0 | 1 | 3 | 6;
  percentage: number;
  cost: number;
}

export interface ReceivedItem {
  id: string;
  type: string;
  brand: string;
  model: string;
  serial: string;
  quantity: number;
  status: string;
  // Fix: Added optional notes property to match usage in ReceptionForm.tsx
  notes?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  iconName: string;
  color: string;
  subServices: string[];
  basePrice: number;
}

export interface Ticket {
  id: string;
  type: 'Mantenimiento' | 'Incidente' | 'Instalación' | 'S.O.S';
  title: string;
  status: TicketStatus;
  priority: 'Baja' | 'Normal' | 'Alta' | 'Crítica';
  client: string;
  clientId: string;
  date: string;
  location: string;
  observations?: string;
  cost?: number;
  estimatedCost: number;
  modality: 'Taller' | 'Domicilio';
  history: HistoryEntry[];
  assignedTeam?: any[];
  warrantyExpiry?: string;
  reportUrl?: string;
  receptionItems?: ReceivedItem[];
  deviceDetails?: any;
  isSOS?: boolean;
  sosApproved?: boolean;
  technicalReport?: TechnicalReport;
  billing?: BillingDetails;
  selectedWarranty?: WarrantySelection;
  paymentMethod?: string;
}
