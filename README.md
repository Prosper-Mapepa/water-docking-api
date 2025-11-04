# Water Docking Management System - Backend

A comprehensive NestJS backend API for managing water docking business operations including CRM and maintenance management.

## Features

### CRM System
- **Customer Management**: Track customer profiles, preferences, and membership tiers
- **Visit History**: Record and monitor dock visits with service usage
- **Service Requests**: Manage customer service requests with priority and status tracking
- **Feedback System**: Collect and analyze customer feedback automatically
- **Loyalty Rewards**: Automatic tier upgrades based on loyalty points

### Maintenance & Asset Management
- **Asset Tracking**: Manage docks, power stations, and equipment
- **Maintenance Scheduling**: Schedule routine and preventive maintenance
- **Photo Upload**: Support for maintenance issue documentation with photos
- **Cost Prediction**: Generate reports to predict future maintenance costs
- **Automated Alerts**: Daily checks for overdue maintenance tasks

### Analytics & Reporting
- Revenue analytics with date range filtering
- Customer insights and membership distribution
- Service request analytics
- Maintenance cost tracking
- Dock occupancy rates

## Tech Stack

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL with TypeORM
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Scheduling**: @nestjs/schedule
- **File Upload**: Multer

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your database credentials
```

## Database Setup

```bash
# Create PostgreSQL database
createdb water_docking

# Run migrations (if any)
npm run migration:run
```

## Running the Application

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001`

Swagger documentation: `http://localhost:3001/api`

## API Endpoints

### Customers
- `GET /customers` - Get all customers
- `POST /customers` - Create new customer
- `GET /customers/:id` - Get customer by ID
- `PATCH /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer
- `POST /customers/:id/loyalty-points` - Add loyalty points

### Visits
- `GET /visits` - Get all visits
- `POST /visits` - Create new visit
- `GET /visits/current` - Get active visits
- `GET /visits/:id` - Get visit by ID
- `PATCH /visits/:id` - Update visit
- `DELETE /visits/:id` - Delete visit

### Service Requests
- `GET /service-requests` - Get all service requests
- `POST /service-requests` - Create service request
- `GET /service-requests/:id` - Get service request by ID
- `PATCH /service-requests/:id` - Update service request
- `DELETE /service-requests/:id` - Delete service request

### Feedback
- `GET /feedback` - Get all feedback
- `POST /feedback` - Submit feedback
- `GET /feedback/stats` - Get feedback statistics
- `GET /feedback/:id` - Get feedback by ID
- `PATCH /feedback/:id` - Update feedback
- `DELETE /feedback/:id` - Delete feedback

### Assets
- `GET /assets` - Get all assets
- `POST /assets` - Create new asset
- `GET /assets/stats` - Get asset statistics
- `GET /assets/:id` - Get asset by ID
- `PATCH /assets/:id` - Update asset
- `DELETE /assets/:id` - Delete asset

### Maintenance
- `GET /maintenance` - Get all maintenance records
- `POST /maintenance` - Create maintenance record
- `GET /maintenance/upcoming` - Get upcoming maintenance
- `GET /maintenance/overdue` - Get overdue maintenance
- `GET /maintenance/stats` - Get maintenance statistics
- `GET /maintenance/predict-costs` - Predict future costs
- `GET /maintenance/:id` - Get maintenance record by ID
- `PATCH /maintenance/:id` - Update maintenance record
- `DELETE /maintenance/:id` - Delete maintenance record

### File Upload
- `POST /upload/single` - Upload single file
- `POST /upload/multiple` - Upload multiple files
- `GET /upload/:fileName` - Get uploaded file

### Analytics
- `GET /analytics/dashboard` - Dashboard overview
- `GET /analytics/revenue` - Revenue analytics
- `GET /analytics/customers` - Customer insights
- `GET /analytics/services` - Service analytics
- `GET /analytics/maintenance` - Maintenance analytics
- `GET /analytics/occupancy` - Dock occupancy rate

## Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=water_docking

PORT=3001
NODE_ENV=development

MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Optional: Email & SMS Integration
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
SMS_API_KEY=
SMS_API_URL=
```

## Project Structure

```
src/
├── config/           # Configuration files
├── entities/         # TypeORM entities
├── modules/          # Feature modules
│   ├── customers/
│   ├── visits/
│   ├── service-requests/
│   ├── feedback/
│   ├── assets/
│   ├── maintenance/
│   ├── file-upload/
│   └── analytics/
├── app.module.ts     # Root module
└── main.ts          # Application entry point
```

## License

MIT










