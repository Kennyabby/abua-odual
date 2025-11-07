# IGR Payment Portal - Abua/Odual LGA

## Project Overview

A comprehensive Internally Generated Revenue (IGR) Payment Portal for Abua/Odual Local Government Area. This is a demonstration system using mock data to showcase all features of a complete revenue collection and management system.

## Key Features

### Authentication & User Management
- Mock authentication system with pre-loaded demo accounts
- Four user roles: Citizen, Administrator, Finance Officer, Auditor
- Role-based access control with different permissions and views
- Demo accounts with passwords displayed for easy testing

### For Citizens
- User-friendly citizen portal with quick access to payment services
- Complete payment flow with Remita-style interface
- Invoice viewing and payment
- Payment history tracking
- Receipt verification using RRR numbers

### For Administrators & Staff
- Real-time revenue dashboard with charts and metrics
- Revenue source/category management
- Invoice generation and tracking
- Payment monitoring and reconciliation
- Taxpayer database management
- Comprehensive reporting module (daily, weekly, monthly, quarterly, annual)
- System configuration and settings

### Payment Processing (Mock)
- Remita-style payment interface simulation
- Multiple payment methods: Card, Bank Transfer, USSD, Mobile Money
- RRR (Remita Retrieval Reference) number generation
- Automated receipt generation
- Payment status tracking and verification

## Technology Stack

### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Shadcn UI components
- Tailwind CSS for styling
- Recharts for data visualization
- Inter & Manrope fonts (Material Design approach)

### Backend
- Express.js server
- In-memory mock data storage
- RESTful API design
- Mock data for all entities

### Data Models
- Users (with roles and permissions)
- Taxpayers (individuals and businesses)
- Revenue Categories (fees, levies, permits, licenses)
- Invoices (with unique invoice numbers)
- Payments (with RRR numbers and transaction details)

## Demo Accounts

### Citizen Account
- Username: citizen1
- Password: password123
- Email: john.okafor@email.com

### Administrator Account
- Username: admin1
- Password: admin123
- Email: ada.nwosu@abuaodual.gov.ng

### Finance Officer Account
- Username: finance1
- Password: finance123
- Email: emeka.eze@abuaodual.gov.ng

### Auditor Account
- Username: auditor1
- Password: auditor123
- Email: ngozi.obi@abuaodual.gov.ng

## Application Routes

### Public Routes
- `/` - Login page
- `/verify` - Payment verification (public access)

### Citizen Routes
- `/citizen` - Citizen portal dashboard
- `/citizen/payment` - Payment flow (Remita-style)
- `/citizen/invoices` - View citizen invoices
- `/citizen/history` - Payment history

### Admin/Staff Routes
- `/dashboard` - Revenue dashboard (all staff)
- `/revenue-sources` - Manage revenue categories (admin, finance officer)
- `/invoices` - Invoice management (admin, finance officer)
- `/payments` - Payment tracking (all staff)
- `/taxpayers` - Taxpayer database (admin, finance officer)
- `/reports` - Revenue reports (all staff)
- `/settings` - System settings (admin only)

## Design System

- **Colors**: Government-appropriate green primary color with professional neutrals
- **Typography**: Inter for body text, Manrope for headings
- **Layout**: Sidebar navigation for admin, top navigation for citizens
- **Components**: Consistent use of Shadcn UI components throughout
- **Charts**: Recharts for all data visualization
- **Responsive**: Mobile-first design, works on all devices

## Mock Data Features

All data in the system is mock/demonstration data including:
- Pre-populated taxpayer profiles
- Sample revenue categories across departments
- Generated invoices with various statuses
- Payment transactions with RRR numbers
- Dashboard statistics and charts
- Report data for all time periods

## Development Notes

- This is a demonstration/prototype system
- All authentication is simulated
- Payment processing is mocked (no real transactions)
- Data is stored in-memory (resets on server restart)
- Production deployment would require:
  - Real authentication system
  - Live payment gateway integration (Remita, Paystack, etc.)
  - PostgreSQL database for persistence
  - Email/SMS notification services
  - Security enhancements and audit logging

## Running the Application

The application runs on a single port with both frontend and backend:
- Start: `npm run dev`
- The Vite dev server and Express server run together
- Frontend is served at the root
- API endpoints are prefixed with `/api`
