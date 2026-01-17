# VitalOps API Reference

Base URL: `http://localhost:5000/api/v1`

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "9876543210",
  "role": "MANAGER"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "jwt-token"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt-token"
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": { ... }
}
```

## Assets

### Create Asset
```http
POST /assets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "CPAP Machine - Model X",
  "categoryId": "uuid",
  "purchaseDate": "2024-01-01",
  "purchasePrice": 50000,
  "depreciationRate": 10,
  "manufacturer": "ResMed",
  "model": "AirSense 10",
  "serialNumber": "SN123456",
  "condition": "NEW",
  "currentLocation": "Warehouse A"
}

Response: 201 Created
{
  "success": true,
  "message": "Asset created successfully",
  "data": {
    "id": "uuid",
    "assetCode": "AST-2024-001",
    "qrCode": "VITALOPS:ASSET:AST-2024-001",
    "qrCodeImage": "data:image/png;base64...",
    ...
  }
}
```

### Get All Assets
```http
GET /assets?status=AVAILABLE&page=1&limit=20
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "assets": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

### Get Asset by ID
```http
GET /assets/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "assetCode": "AST-2024-001",
    "name": "CPAP Machine",
    "category": { ... },
    "status": "AVAILABLE",
    "rentalItems": [...],
    "assetLogs": [...],
    "serviceLogs": [...]
  }
}
```

### Scan Asset
```http
POST /assets/:id/scan
Authorization: Bearer <token>
Content-Type: application/json

{
  "location": "Customer Home - Delhi",
  "latitude": 28.7041,
  "longitude": 77.1025
}

Response: 200 OK
{
  "success": true,
  "message": "Asset scanned successfully",
  "data": { ... }
}
```

## Customers

### Create Customer
```http
POST /customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "address": "123 Main St, Delhi",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001",
  "aadharNumber": "123456789012",
  "panNumber": "ABCDE1234F"
}

Response: 201 Created
{
  "success": true,
  "message": "Customer created",
  "data": { ... }
}
```

### Get All Customers
```http
GET /customers?search=john&page=1&limit=20
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "customers": [...],
    "pagination": { ... }
  }
}
```

## Rentals

### Create Rental
```http
POST /rentals
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "uuid",
  "startDate": "2024-01-01",
  "monthlyRent": 5000,
  "securityDeposit": 10000,
  "billingDay": 1,
  "assetIds": ["uuid1", "uuid2"],
  "location": "Customer Home",
  "latitude": 28.7041,
  "longitude": 77.1025
}

Response: 201 Created
{
  "success": true,
  "message": "Rental created",
  "data": {
    "id": "uuid",
    "rentalNumber": "RNT-2024-001",
    "customer": { ... },
    "rentalItems": [...],
    "status": "ACTIVE"
  }
}
```

### Return Asset
```http
POST /rentals/:id/return
Authorization: Bearer <token>
Content-Type: application/json

{
  "assetId": "uuid",
  "location": "Warehouse",
  "latitude": 28.7041,
  "longitude": 77.1025
}

Response: 200 OK
{
  "success": true,
  "message": "Asset returned"
}
```

### Convert Rental to Sale
```http
POST /rentals/:id/convert-to-sale
Authorization: Bearer <token>
Content-Type: application/json

{
  "assetId": "uuid",
  "salePrice": 30000,
  "discount": 2000
}

Response: 200 OK
{
  "success": true,
  "message": "Converted to sale",
  "data": { ... }
}
```

## Jobs

### Create Job
```http
POST /jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "INSTALLATION",
  "technicianId": "uuid",
  "customerId": "uuid",
  "customerName": "John Doe",
  "customerPhone": "9876543210",
  "address": "123 Main St, Delhi",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "scheduledDate": "2024-01-15",
  "scheduledTime": "10:00 AM - 12:00 PM",
  "description": "Install CPAP machine",
  "amountToCollect": 5000
}

Response: 201 Created
{
  "success": true,
  "message": "Job created",
  "data": {
    "id": "uuid",
    "jobNumber": "JOB-2024-001",
    ...
  }
}
```

### Start Job
```http
POST /jobs/:id/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "qrScan": "VITALOPS:ASSET:AST-2024-001"
}

Response: 200 OK
{
  "success": true,
  "message": "Job started"
}
```

### Complete Job
```http
POST /jobs/:id/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "qrScan": "VITALOPS:ASSET:AST-2024-001",
  "amountCollected": 5000,
  "paymentMethod": "UPI",
  "paymentProofUrl": "https://...",
  "notes": "Installation completed successfully",
  "images": ["https://..."]
}

Response: 200 OK
{
  "success": true,
  "message": "Job completed"
}
```

## Invoices

### Create Invoice
```http
POST /invoices
Authorization: Bearer <token>
Content-Type: application/json

{
  "rentalId": "uuid",
  "type": "RENTAL_MONTHLY",
  "subtotal": 5000,
  "tax": 900,
  "discount": 0,
  "total": 5900,
  "dueDays": 7,
  "items": [
    {
      "description": "Monthly rent - CPAP Machine",
      "quantity": 1,
      "unitPrice": 5000,
      "amount": 5000
    }
  ]
}

Response: 201 Created
{
  "success": true,
  "message": "Invoice created",
  "data": {
    "id": "uuid",
    "invoiceNumber": "INV-2024-001",
    ...
  }
}
```

### Send Invoice via WhatsApp
```http
POST /invoices/:id/send-whatsapp
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Invoice sent via WhatsApp"
}
```

## Payments

### Record Payment
```http
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "invoiceId": "uuid",
  "customerId": "uuid",
  "amount": 5900,
  "paymentMethod": "UPI",
  "transactionId": "TXN123456",
  "upiId": "customer@upi",
  "proofImageUrl": "https://..."
}

Response: 201 Created
{
  "success": true,
  "message": "Payment recorded",
  "data": {
    "id": "uuid",
    "paymentNumber": "PAY-2024-001",
    ...
  }
}
```

## Dashboard

### Get Overview
```http
GET /dashboard/overview
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "assets": {
      "total": 100,
      "available": 65,
      "rented": 30,
      "utilizationRate": 30
    },
    "rentals": {
      "active": 25
    },
    "customers": {
      "total": 150
    },
    "invoices": {
      "pending": 10,
      "overdue": 3
    }
  }
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- No rate limiting currently implemented
- Future: 100 requests per minute per IP

## Pagination

List endpoints support pagination via query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)



