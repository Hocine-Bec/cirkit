# CirKit Architecture

## Tech Stack Overview
### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4 (Dark tech theme with glassmorphism)
- **State Management**: TanStack React Query v5 for server state, React Context for Auth/Cart
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts

### Backend
- **Framework**: .NET 10.0 ASP.NET Core Web API
- **Architecture**: Clean Architecture (Presentation, Application, Domain, Infrastructure layers)
- **Database**: PostgreSQL (via Entity Framework Core)
- **Authentication**: JWT Bearer Tokens
- **Design Patterns**: CQRS (MediatR), Repository/Unit of Work

## System Design
The system is divided into two decoupled monolithic applications:
1. **Frontend SPA**: Hosted on Vercel. Static assets delivered via CDN. Makes stateless REST HTTPS calls to the backend.
2. **Backend API**: Hosted on Railway in a Docker container. Stateless API instances connect to a managed PostgreSQL database.

## Data Models
- **User/Customer**: Role-based access (Admin vs Customer). Customers own Orders and Addresses.
- **Product**: Hierarchical catalog (Category → Product → Variant). Products have multiple Images and Reviews.
- **Order**: Contains OrderItems capturing price snapshots at checkout time.

## Deployment Pipeline
- **Vercel**: Listens to the `frontend` directory. Builds via `npm run build` and serves `dist/` with SPA rewrite rules (`vercel.json`).
- **Railway**: Listens to the `backend` directory (or root `Dockerfile`). Builds the .NET source into an Alpine Linux container and exposes the ASP.NET Kestrel web server. Railway provisions the PostgreSQL database.
