import { Role } from './roles.enum';
import { TicketStatus } from './booking-status.enum';
import { PaymentStatus } from './payment-status.enum';
import { SOSStatus } from './sos-status.enum';
import { WorkflowState } from './workflow-state.enum';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client extends User {
  phone?: string;
  company?: string;
  address?: string;
}

export interface Technician extends User {
  specialty?: string;
  currentWorkload: number;
  available: boolean;
}

export interface Ticket {
  id: string;
  type: string;
  title: string;
  status: TicketStatus;
  priority: string;
  clientId: string;
  location?: string;
  observations?: string;
  estimatedCost?: number;
  actualCost?: number;
  modality: string;
  isSOS: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  ticketId: string;
  userId: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SOSRequest {
  id: string;
  clientId: string;
  location: string;
  description: string;
  status: SOSStatus;
  priority: string;
  assignedTechnicianId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workflow {
  id: string;
  name: string;
  state: WorkflowState;
  context: Record<string, unknown>;
  currentStep: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
