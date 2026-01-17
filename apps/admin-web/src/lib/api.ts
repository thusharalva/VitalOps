// API client for VitalOps Admin Web
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error.response?.data || error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Auth
  async login(email: string, password: string) {
    const response: any = await this.client.post('/auth/login', { email, password });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async register(data: any) {
    const response: any = await this.client.post('/auth/register', data);
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async getCurrentUser() {
    return this.client.get('/auth/me');
  }

  async updateUser(userId: string, data: any) {
    return this.client.put(`/users/${userId}`, data);
  }

  async getAllUsers() {
    return this.client.get('/users');
  }

  logout() {
    this.clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Dashboard
  async getDashboardOverview() {
    return this.client.get('/dashboard/overview');
  }

  async getDashboardStats() {
    return this.client.get('/dashboard/stats');
  }

  // Assets
  async getAssets(params?: any) {
    return this.client.get('/assets', { params });
  }

  async getAssetById(id: string) {
    return this.client.get(`/assets/${id}`);
  }

  async createAsset(data: any) {
    return this.client.post('/assets', data);
  }

  async updateAsset(id: string, data: any) {
    return this.client.put(`/assets/${id}`, data);
  }

  async scanAsset(id: string, data: any) {
    return this.client.post(`/assets/${id}/scan`, data);
  }

  async getAssetCategories() {
    return this.client.get('/assets/categories/list');
  }

  async createAssetCategory(data: any) {
    return this.client.post('/assets/categories', data);
  }

  // Customers
  async getCustomers(params?: any) {
    return this.client.get('/customers', { params });
  }

  async getCustomerById(id: string) {
    return this.client.get(`/customers/${id}`);
  }

  async createCustomer(data: any) {
    return this.client.post('/customers', data);
  }

  async updateCustomer(id: string, data: any) {
    return this.client.put(`/customers/${id}`, data);
  }

  // Rentals
  async getRentals(params?: any) {
    return this.client.get('/rentals', { params });
  }

  async getRentalById(id: string) {
    return this.client.get(`/rentals/${id}`);
  }

  async createRental(data: any) {
    return this.client.post('/rentals', data);
  }

  async updateRental(id: string, data: any) {
    return this.client.put(`/rentals/${id}`, data);
  }

  async returnAsset(rentalId: string, data: any) {
    return this.client.post(`/rentals/${rentalId}/return`, data);
  }

  async getActiveRentals() {
    return this.client.get('/rentals/active/list');
  }

  async convertToSale(rentalId: string, data: any) {
    return this.client.post(`/rentals/${rentalId}/convert-to-sale`, data);
  }

  // Jobs
  async getJobs(params?: any) {
    return this.client.get('/jobs', { params });
  }

  async getJobById(id: string) {
    return this.client.get(`/jobs/${id}`);
  }

  async createJob(data: any) {
    return this.client.post('/jobs', data);
  }

  // Invoices
  async getInvoices(params?: any) {
    return this.client.get('/invoices', { params });
  }

  async getInvoiceById(id: string) {
    return this.client.get(`/invoices/${id}`);
  }

  async createInvoice(data: any) {
    return this.client.post('/invoices', data);
  }

  async updateInvoice(id: string, data: any) {
    return this.client.put(`/invoices/${id}`, data);
  }

  async sendInvoiceViaWhatsApp(id: string) {
    return this.client.post(`/invoices/${id}/send-whatsapp`);
  }

  // Payments
  async getPayments(params?: any) {
    return this.client.get('/payments', { params });
  }

  async createPayment(data: any) {
    return this.client.post('/payments', data);
  }

  // Sleep Studies
  async getSleepStudies(params?: any) {
    return this.client.get('/sleep-studies', { params });
  }

  async getSleepStudyById(id: string) {
    return this.client.get(`/sleep-studies/${id}`);
  }

  async createSleepStudy(data: any) {
    return this.client.post('/sleep-studies', data);
  }

  async uploadSleepStudyReport(id: string, data: any) {
    return this.client.post(`/sleep-studies/${id}/upload-report`, data);
  }
}

export const api = new ApiClient();

