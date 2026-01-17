// Shared TypeScript types and interfaces for VitalOps

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TECHNICIAN = 'TECHNICIAN',
  ACCOUNTANT = 'ACCOUNTANT',
  SALES_REP = 'SALES_REP',
}

export enum AssetStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  IN_SERVICE = 'IN_SERVICE',
  DAMAGED = 'DAMAGED',
  SOLD = 'SOLD',
  RETIRED = 'RETIRED',
}

export enum RentalStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  CONVERTED_TO_SALE = 'CONVERTED_TO_SALE',
}

export enum JobType {
  INSTALLATION = 'INSTALLATION',
  PICKUP = 'PICKUP',
  DELIVERY = 'DELIVERY',
  SERVICE = 'SERVICE',
  REPAIR = 'REPAIR',
  SLEEP_STUDY_SETUP = 'SLEEP_STUDY_SETUP',
  SLEEP_STUDY_PICKUP = 'SLEEP_STUDY_PICKUP',
}

export enum JobStatus {
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  UPI = 'UPI',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
  CARD = 'CARD',
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Asset {
  id: string;
  assetCode: string;
  qrCode: string;
  name: string;
  categoryId: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  status: AssetStatus;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface Rental {
  id: string;
  rentalNumber: string;
  customerId: string;
  startDate: Date;
  endDate?: Date;
  monthlyRent: number;
  securityDeposit: number;
  status: RentalStatus;
}

export interface Job {
  id: string;
  jobNumber: string;
  type: JobType;
  status: JobStatus;
  technicianId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  scheduledDate: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationParams;
}



