// Customer Management Service
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerService {
  async createCustomer(data: any) {
    return await prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        aadharNumber: data.aadharNumber,
        panNumber: data.panNumber,
        documentImages: data.documentImages || [],
        notes: data.notes,
      },
    });
  }

  async getAllCustomers(filters: { search?: string; page: number; limit: number }) {
    const { search, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.customer.count({ where });
    const customers = await prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      customers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCustomerById(customerId: string) {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        rentals: { include: { rentalItems: true } },
        sales: true,
        sleepStudies: true,
        payments: { orderBy: { paymentDate: 'desc' }, take: 10 },
      },
    });

    if (!customer) throw new Error('Customer not found');
    return customer;
  }

  async updateCustomer(customerId: string, data: any) {
    return await prisma.customer.update({
      where: { id: customerId },
      data,
    });
  }

  async deleteCustomer(customerId: string) {
    const activeRentals = await prisma.rental.count({
      where: { customerId, status: 'ACTIVE' },
    });

    if (activeRentals > 0) {
      throw new Error('Cannot delete customer with active rentals');
    }

    await prisma.customer.delete({ where: { id: customerId } });
  }

  async getCustomerRentals(customerId: string) {
    return await prisma.rental.findMany({
      where: { customerId },
      include: { rentalItems: { include: { asset: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCustomerPayments(customerId: string) {
    return await prisma.payment.findMany({
      where: { customerId },
      orderBy: { paymentDate: 'desc' },
    });
  }
}



