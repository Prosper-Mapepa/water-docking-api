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

# Run migrations to create all tables
npm run migration:run
```

**Important**: Always use migrations in production. The `synchronize` option is disabled to prevent accidental schema changes.

## Running Migrations

### Local Development
```bash
# Run all pending migrations
npm run migration:run

# Generate a new migration (after changing entities)
npm run migration:generate -- src/migrations/MigrationName

# Revert last migration
npm run migration:revert
```

### Railway Deployment
Migrations need to be run manually on Railway:

```bash
# Via Railway CLI
railway run npm run migration:run

# Or set RUN_MIGRATIONS=true in Railway environment variables
# to automatically run migrations on app startup
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
   Railway automatically provides PostgreSQL connection variables. The app supports both:
   
   **Railway's default variables** (automatically set when you add PostgreSQL):
   - `PGHOST` - PostgreSQL host
   - `PGPORT` - PostgreSQL port
   - `PGUSER` - PostgreSQL username
   - `PGPASSWORD` - PostgreSQL password
   - `PGDATABASE` - PostgreSQL database name
   - `DATABASE_URL` - Complete connection string (if provided, takes precedence)
   
   **Manual variables** (if you need to override):
   - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` - Alternative naming
   
   **Required custom variables:**
   - `JWT_SECRET` - Secret key for JWT tokens (generate a strong random string)
   - `NODE_ENV` - Set to `production`

   **Optional:**
   - `JWT_EXPIRES_IN` - JWT token expiration (default: `24h`)
   - `PORT` - Server port (Railway sets this automatically)
   - `RUN_MIGRATIONS` - Set to `true` to auto-run migrations on startup
   - `MAX_FILE_SIZE` - Maximum file upload size in bytes (default: `5242880`)
   - `UPLOAD_PATH` - Path for file uploads (default: `./uploads`)

5. **Run Database Migrations** (if needed):
   ```bash
   railway run npm run migration:run
   ```

#### Environment Variables Setup

Railway automatically provides PostgreSQL connection variables when you add a PostgreSQL service. The application will automatically detect and use:
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` (Railway's default)
- Or `DATABASE_URL` (complete connection string, takes precedence)
- Or fallback to `DB_HOST`, `DB_PORT`, etc. if you prefer custom names

**Important**: 
- Set `NODE_ENV=production` to disable database synchronization in production
- Set `RUN_MIGRATIONS=true` to automatically run migrations on app startup (optional)
- Make sure your PostgreSQL service is running before the app starts

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










