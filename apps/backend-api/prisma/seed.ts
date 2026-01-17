// Database seed file - Initial data for VitalOps
import { PrismaClient, UserRole, AssetStatus, AssetCondition } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Admin User
  console.log('👤 Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vitalops.com' },
    update: {},
    create: {
      email: 'admin@vitalops.com',
      password: adminPassword,
      name: 'Admin User',
      phone: '9999999999',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 2. Create Manager User
  console.log('👤 Creating manager user...');
  const managerPassword = await bcrypt.hash('manager123', 12);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@vitalops.com' },
    update: {},
    create: {
      email: 'manager@vitalops.com',
      password: managerPassword,
      name: 'Manager User',
      phone: '9999999998',
      role: UserRole.MANAGER,
      isActive: true,
    },
  });
  console.log('✅ Manager user created:', manager.email);

  // 3. Create Technician User
  console.log('👤 Creating technician user...');
  const techPassword = await bcrypt.hash('tech123', 12);
  const technician = await prisma.user.upsert({
    where: { email: 'tech@vitalops.com' },
    update: {},
    create: {
      email: 'tech@vitalops.com',
      password: techPassword,
      name: 'Technician User',
      phone: '9999999997',
      role: UserRole.TECHNICIAN,
      isActive: true,
    },
  });
  console.log('✅ Technician user created:', technician.email);

  // 4. Create Asset Categories
  console.log('📦 Creating asset categories...');
  const categories = [
    {
      name: 'CPAP Machine',
      description: 'Continuous Positive Airway Pressure devices for sleep apnea treatment',
    },
    {
      name: 'Oxygen Concentrator',
      description: 'Medical devices that concentrate oxygen from ambient air',
    },
    {
      name: 'Sleep Study Device',
      description: 'Portable devices for home sleep study monitoring',
    },
    {
      name: 'Wheelchair',
      description: 'Manual and electric wheelchairs for mobility assistance',
    },
    {
      name: 'Hospital Bed',
      description: 'Adjustable hospital beds for home care',
    },
    {
      name: 'Nebulizer',
      description: 'Devices that convert liquid medication into a mist',
    },
    {
      name: 'BiPAP Machine',
      description: 'Bilevel Positive Airway Pressure devices',
    },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.assetCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
    createdCategories.push(created);
    console.log(`  ✅ Category: ${created.name}`);
  }

  // 5. Create Sample Customers
  console.log('👥 Creating sample customers...');
  const customers = [
    {
      name: 'Rajesh Kumar',
      phone: '9876543210',
      email: 'rajesh@example.com',
      address: '123 MG Road, Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      aadharNumber: '123456789012',
      panNumber: 'ABCDE1234F',
    },
    {
      name: 'Priya Sharma',
      phone: '9876543211',
      email: 'priya@example.com',
      address: '456 Park Street, Salt Lake',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700091',
      aadharNumber: '234567890123',
      panNumber: 'BCDEF2345G',
    },
    {
      name: 'Amit Patel',
      phone: '9876543212',
      email: 'amit@example.com',
      address: '789 Brigade Road, Jayanagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560011',
      aadharNumber: '345678901234',
      panNumber: 'CDEFG3456H',
    },
  ];

  const createdCustomers = [];
  for (const customer of customers) {
    const created = await prisma.customer.upsert({
      where: { phone: customer.phone },
      update: {},
      create: customer,
    });
    createdCustomers.push(created);
    console.log(`  ✅ Customer: ${created.name}`);
  }

  // 6. Create Sample Doctors
  console.log('👨‍⚕️ Creating sample doctors...');
  const doctors = [
    {
      name: 'Dr. Suresh Reddy',
      specialization: 'Pulmonology',
      phone: '9123456789',
      email: 'dr.suresh@hospital.com',
      hospital: 'Apollo Hospital',
      address: 'Sarita Vihar, New Delhi',
    },
    {
      name: 'Dr. Anjali Mehta',
      specialization: 'Sleep Medicine',
      phone: '9123456790',
      email: 'dr.anjali@hospital.com',
      hospital: 'Fortis Hospital',
      address: 'Vasant Kunj, New Delhi',
    },
  ];

  for (const doctor of doctors) {
    const created = await prisma.doctor.create({
      data: doctor,
    });
    console.log(`  ✅ Doctor: ${created.name}`);
  }

  // 7. Create System Settings
  console.log('⚙️ Creating system settings...');
  const settings = [
    { key: 'DEFAULT_DEPRECIATION_RATE', value: '10', category: 'BILLING' },
    { key: 'DEFAULT_RENTAL_BILLING_DAY', value: '1', category: 'BILLING' },
    { key: 'INVOICE_DUE_DAYS', value: '7', category: 'BILLING' },
    { key: 'RENTAL_TO_SALE_FACTOR', value: '0.65', category: 'BILLING' },
    { key: 'WHATSAPP_ENABLED', value: 'false', category: 'WHATSAPP' },
    { key: 'COMPANY_NAME', value: 'VitalOps Medical Equipment', category: 'GENERAL' },
    { key: 'COMPANY_ADDRESS', value: 'Delhi, India', category: 'GENERAL' },
    { key: 'COMPANY_PHONE', value: '1800-123-4567', category: 'GENERAL' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
    console.log(`  ✅ Setting: ${setting.key} = ${setting.value}`);
  }

  console.log('\n✨ Database seeding completed successfully!');
  console.log('\n📋 Default Login Credentials:');
  console.log('┌─────────────────────────────────────────────┐');
  console.log('│ Admin:                                      │');
  console.log('│   Email: admin@vitalops.com                 │');
  console.log('│   Password: admin123                        │');
  console.log('├─────────────────────────────────────────────┤');
  console.log('│ Manager:                                    │');
  console.log('│   Email: manager@vitalops.com               │');
  console.log('│   Password: manager123                      │');
  console.log('├─────────────────────────────────────────────┤');
  console.log('│ Technician:                                 │');
  console.log('│   Email: tech@vitalops.com                  │');
  console.log('│   Password: tech123                         │');
  console.log('└─────────────────────────────────────────────┘');
  console.log('\n⚠️  IMPORTANT: Change these passwords in production!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



