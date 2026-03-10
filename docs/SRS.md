# CirKit: Software Requirements Specification (SRS)

## 1. Introduction
This document outlines the software architecture, technical requirements, and system behaviors for the CirKit e-commerce platform.

## 2. System Overview
The application follows a client-server architecture:
- **Client**: React 19 Single Page Application.
- **Server**: ASP.NET Core 10 Web API.
- **Database**: PostgreSQL (Relational).

## 3. Functional Requirements

### 3.1 Authentication & Authorization
- **FR1**: The system must support JWT-based authentication.
- **FR2**: The system must differentiate between `Admin` and `Customer` roles using dual independent contexts to prevent session bleeding.

### 3.2 Product Catalog
- **FR3**: The system must paginate product queries to prevent database strain.
- **FR4**: The system must decrement stock dynamically upon successful checkout.

### 3.3 Order Processing
- **FR5**: The API must validate cart items (price and stock availability) before finalizing orders.
- **FR6**: The system must snapshot shipping address data directly into the Order entity to preserve historical truth.

## 4. Non-Functional Requirements

### 4.1 Performance
- **NFR1**: API responses for catalog endpoints must be under 200ms.
- **NFR2**: The frontend must use stale-while-revalidate data fetching (via TanStack Query) to ensure the UI never blocks on network requests after initial load.

### 4.2 Security
- **NFR3**: Passwords must be hashed using ASP.NET Core Identity's default PBKDF2 algorithm.
- **NFR4**: API endpoints must validate all incoming DTOs using FluentValidation (Backend) and Zod (Frontend).

### 4.3 Deployment
- **NFR5**: The backend must be containerized using Docker.
- **NFR6**: The frontend must support serverless deployment via Vercel with SPA fallback routing.
