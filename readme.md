# Task Management System

A full-stack task management application with JWT authentication, role-based access control, Redis caching, and Swagger documentation. Built with Node.js/Express (ES modules) and React + Vite.

## Live Demo

- **Frontend**: [https://task.deployhub.online](https://task.deployhub.online)
- **Backend API**: [https://apitask.deployhub.online/api](https://apitask.deployhub.online/api)
- **API Documentation (Swagger)**: [https://apitask.deployhub.online/api-docs](https://apitask.deployhub.online/api-docs)

Use the dummy admin account to explore the app:
- **Email**: `admin@admin.com`
- **Password**: `123456`

## Features

- User registration & login with JWT
- Role-based access (user/admin)
- CRUD operations for tasks
- Redis caching for performance
- API versioning (v1)
- Swagger/OpenAPI documentation
- Centralized error handling & validation
- React frontend with Bootstrap
- Docker support

## Tech Stack

**Backend:**
- Node.js (ES modules)
- Express 
- MongoDB with Mongoose 
- Redis
- JWT authentication
- Winston logging
- Swagger UI

**Frontend:**
- React
- Vite
- Bootstrap
- Axios
- React Router

## Prerequisites

- Node.js (v20+)
- MongoDB (local or Atlas)
- Redis (local or cloud)
- npm

## Installation

### Backend Setup
```bash
cd backend
cp .env.example .env
# Update .env with your MongoDB URI, JWT secret, Redis URL
npm install
npm run dev
