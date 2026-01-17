# VitalOps Database Schema

## Entity Relationship Diagram

```
User
├── createdAssets (1:N → Asset)
├── assignedJobs (1:N → Job)
└── activityLogs (1:N → ActivityLog)

Customer
├── rentals (1:N → Rental)
├── sales (1:N → Sale)
├── sleepStudies (1:N → SleepStudy)
└── payments (1:N → Payment)

Asset
├── category (N:1 → AssetCategory)
├── createdBy (N:1 → User)
├── rentalItems (1:N → RentalItem)
├── sales (1:N → Sale)
├── serviceLogs (1:N → ServiceLog)
├── assetLogs (1:N → AssetLog)
└── sleepStudies (1:N → SleepStudy)

Rental
├── customer (N:1 → Customer)
├── rentalItems (1:N → RentalItem)
├── payments (1:N → Payment)
└── invoices (1:N → Invoice)

Invoice
├── rental (N:1 → Rental)
├── invoiceItems (1:N → InvoiceItem)
└── payments (1:N → Payment)
```

## Core Tables

### users
Authentication and user management

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | String | Unique email address |
| password | String | Hashed password |
| name | String | Full name |
| phone | String | Contact number |
| role | Enum | ADMIN, MANAGER, TECHNICIAN, ACCOUNTANT, SALES_REP |
| isActive | Boolean | Account status |
| createdAt | DateTime | Registration timestamp |
| updatedAt | DateTime | Last update timestamp |

### asset_categories
Equipment categories

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | String | Category name (unique) |
| description | String | Category description |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Example Categories:**
- CPAP Machine
- Oxygen Concentrator
- Sleep Study Device
- Wheelchair
- Hospital Bed

### assets
Medical equipment inventory

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| assetCode | String | Unique code (AST-2024-001) |
| qrCode | String | QR code data |
| name | String | Asset name |
| categoryId | UUID | Foreign key to asset_categories |
| purchaseDate | DateTime | Purchase date |
| purchasePrice | Decimal | Original cost |
| currentValue | Decimal | Depreciated value |
| depreciationRate | Decimal | % per year |
| manufacturer | String | Equipment manufacturer |
| model | String | Model number |
| serialNumber | String | Unique serial number |
| status | Enum | AVAILABLE, RENTED, IN_SERVICE, DAMAGED, SOLD, RETIRED |
| condition | Enum | NEW, EXCELLENT, GOOD, FAIR, POOR |
| currentLocation | String | Current location text |
| lastKnownLat | Decimal | GPS latitude |
| lastKnownLng | Decimal | GPS longitude |
| lastScannedAt | DateTime | Last QR scan timestamp |
| notes | String | Additional notes |
| images | String[] | Image URLs |
| createdById | UUID | Foreign key to users |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### customers
Client information

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | String | Full name |
| phone | String | Unique phone number |
| email | String | Email address |
| address | String | Full address |
| city | String | City |
| state | String | State |
| pincode | String | PIN code |
| aadharNumber | String | Aadhaar number |
| panNumber | String | PAN number |
| documentImages | String[] | KYC document URLs |
| notes | String | Additional notes |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### rentals
Rental contracts

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| rentalNumber | String | Unique number (RNT-2024-001) |
| customerId | UUID | Foreign key to customers |
| startDate | DateTime | Rental start date |
| endDate | DateTime | Rental end date (null for open-ended) |
| monthlyRent | Decimal | Monthly rental amount |
| securityDeposit | Decimal | Security deposit |
| status | Enum | ACTIVE, PAUSED, COMPLETED, CANCELLED, CONVERTED_TO_SALE |
| billingDay | Int | Day of month for billing (1-31) |
| lastBilledDate | DateTime | Last billing date |
| nextBillingDate | DateTime | Next billing date |
| notes | String | Additional notes |
| contractPdfUrl | String | Signed contract URL |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### rental_items
Assets in a rental

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| rentalId | UUID | Foreign key to rentals |
| assetId | UUID | Foreign key to assets |
| rentedAt | DateTime | Rented timestamp |
| returnedAt | DateTime | Returned timestamp (null if active) |
| rentedLocation | String | Location when rented |
| returnedLocation | String | Location when returned |
| rentedLat | Decimal | GPS latitude (rented) |
| rentedLng | Decimal | GPS longitude (rented) |
| returnedLat | Decimal | GPS latitude (returned) |
| returnedLng | Decimal | GPS longitude (returned) |
| notes | String | Additional notes |

### sales
Direct sales and conversions

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| saleNumber | String | Unique number (SAL-2024-001) |
| customerId | UUID | Foreign key to customers |
| assetId | UUID | Foreign key to assets |
| saleType | Enum | DIRECT_SALE, RENTAL_CONVERSION |
| saleDate | DateTime | Sale date |
| salePrice | Decimal | Original price |
| discount | Decimal | Discount amount |
| finalPrice | Decimal | Final sale price |
| invoiceNumber | String | Invoice reference |
| invoicePdfUrl | String | Invoice PDF URL |
| notes | String | Additional notes |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### jobs
Technician assignments

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| jobNumber | String | Unique number (JOB-2024-001) |
| type | Enum | INSTALLATION, PICKUP, DELIVERY, SERVICE, REPAIR, SLEEP_STUDY_SETUP, SLEEP_STUDY_PICKUP |
| status | Enum | ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED |
| technicianId | UUID | Foreign key to users |
| customerId | String | Customer ID (optional) |
| customerName | String | Customer name |
| customerPhone | String | Customer phone |
| address | String | Job location |
| latitude | Decimal | GPS latitude |
| longitude | Decimal | GPS longitude |
| scheduledDate | DateTime | Scheduled date |
| scheduledTime | String | Time slot (e.g., "10:00 AM - 12:00 PM") |
| startedAt | DateTime | Job start timestamp |
| completedAt | DateTime | Job completion timestamp |
| startQrScan | String | QR scanned at start |
| endQrScan | String | QR scanned at end |
| amountToCollect | Decimal | Payment to collect |
| amountCollected | Decimal | Payment collected |
| paymentMethod | Enum | CASH, UPI, BANK_TRANSFER, CHEQUE, CARD |
| paymentProofUrl | String | Payment proof image URL |
| description | String | Job description |
| notes | String | Additional notes |
| images | String[] | Before/after photos |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### invoices
Billing and invoicing

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| invoiceNumber | String | Unique number (INV-2024-001) |
| rentalId | UUID | Foreign key to rentals (optional) |
| type | Enum | RENTAL_MONTHLY, RENTAL_DEPOSIT, SALE, SERVICE, SLEEP_STUDY |
| status | Enum | DRAFT, SENT, PAID, PARTIALLY_PAID, OVERDUE, CANCELLED |
| subtotal | Decimal | Subtotal amount |
| tax | Decimal | Tax amount |
| discount | Decimal | Discount amount |
| total | Decimal | Total amount |
| paidAmount | Decimal | Amount paid |
| dueAmount | Decimal | Amount due |
| issueDate | DateTime | Issue date |
| dueDate | DateTime | Due date |
| paidDate | DateTime | Payment date |
| upiQrUrl | String | UPI QR code URL |
| pdfUrl | String | Invoice PDF URL |
| sentViaWhatsApp | Boolean | WhatsApp sent flag |
| whatsappSentAt | DateTime | WhatsApp sent timestamp |
| notes | String | Additional notes |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### invoice_items
Line items in invoice

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| invoiceId | UUID | Foreign key to invoices |
| description | String | Item description |
| quantity | Int | Quantity |
| unitPrice | Decimal | Unit price |
| amount | Decimal | Total amount |

### payments
Payment records

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| paymentNumber | String | Unique number (PAY-2024-001) |
| invoiceId | UUID | Foreign key to invoices (optional) |
| rentalId | UUID | Foreign key to rentals (optional) |
| saleId | UUID | Foreign key to sales (optional) |
| customerId | UUID | Foreign key to customers |
| amount | Decimal | Payment amount |
| paymentMethod | Enum | CASH, UPI, BANK_TRANSFER, CHEQUE, CARD |
| paymentDate | DateTime | Payment date |
| transactionId | String | Transaction reference |
| upiId | String | UPI ID |
| bankReference | String | Bank reference |
| receiptUrl | String | Receipt PDF URL |
| proofImageUrl | String | Proof image URL |
| notes | String | Additional notes |
| recordedBy | String | User who recorded payment |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Indexes

Key indexes for performance:

```prisma
@@index([assetCode])
@@index([rentalNumber])
@@index([saleNumber])
@@index([jobNumber])
@@index([invoiceNumber])
@@index([paymentNumber])
@@index([status])
@@index([customerId])
@@index([technicianId])
```

## Data Relationships

- **1:N** - One-to-Many (e.g., One Customer has Many Rentals)
- **N:1** - Many-to-One (e.g., Many Assets belong to One Category)
- **N:M** - Many-to-Many (implemented via junction tables)

## Cascading Deletes

- Deleting an asset does NOT delete logs (preserved for audit)
- Deleting a customer is blocked if active rentals exist
- Deleting a user is blocked if they created assets or have jobs



