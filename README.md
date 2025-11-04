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

## Deployment

### Railway Deployment

This application is configured for easy deployment on Railway.

#### Quick Start

1. **Install Railway CLI** (optional but recommended):
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Deploy via Railway Dashboard**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Connect your repository
   - Railway will automatically detect and build the application

3. **Set up PostgreSQL Database**:
   - In Railway dashboard, click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically provide connection variables

4. **Configure Environment Variables**:
   Add the following environment variables in Railway dashboard:
   
   **Required:**
   - `DB_HOST` - PostgreSQL host (auto-provided by Railway)
   - `DB_PORT` - PostgreSQL port (auto-provided by Railway)
   - `DB_USERNAME` - PostgreSQL username (auto-provided by Railway)
   - `DB_PASSWORD` - PostgreSQL password (auto-provided by Railway)
   - `DB_DATABASE` - PostgreSQL database name (auto-provided by Railway)
   - `JWT_SECRET` - Secret key for JWT tokens (generate a strong random string)
   - `NODE_ENV` - Set to `production`

   **Optional:**
   - `JWT_EXPIRES_IN` - JWT token expiration (default: `24h`)
   - `PORT` - Server port (Railway sets this automatically)
   - `MAX_FILE_SIZE` - Maximum file upload size in bytes (default: `5242880`)
   - `UPLOAD_PATH` - Path for file uploads (default: `./uploads`)

5. **Run Database Migrations** (if needed):
   ```bash
   railway run npm run migration:run
   ```

#### Environment Variables Setup

Railway automatically provides PostgreSQL connection variables. You can reference them in your service:
- `${{Postgres.PGHOST}}` → `DB_HOST`
- `${{Postgres.PGPORT}}` → `DB_PORT`
- `${{Postgres.PGUSER}}` → `DB_USERNAME`
- `${{Postgres.PGPASSWORD}}` → `DB_PASSWORD`
- `${{Postgres.PGDATABASE}}` → `DB_DATABASE`

**Important**: Make sure to set `NODE_ENV=production` to disable database synchronization in production.

#### Deploy via CLI

```bash
# Initialize Railway project
railway init

# Link to existing project
railway link

# Deploy
railway up

# Set environment variables
railway variables set JWT_SECRET=your-secret-key
railway variables set NODE_ENV=production

# View logs
railway logs
```

## License

MIT










