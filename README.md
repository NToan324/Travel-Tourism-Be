# Food Order Backend

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (Latest LTS)
- MongoDB
- Docker & Docker Compose

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo/project.git
   cd project
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in required fields

### Running the Backend Locally

```sh
pnpm run dev
```

### Running with Docker

```sh
docker compose --profile dev up -d
```

## API Documents

- **API Docs**: [Swagger](http://localhost:3000/swagger/api-docs)

## Overview

This project is a modern web application utilizing a **Next.js frontend** deployed on **Vercel** and a **Node.js backend** hosted on **AWS EC2**. It integrates various cloud services, authentication mechanisms, and real-time features to ensure a scalable and efficient system.

## Technologies Used

### Frontend (Next.js)

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: TailwindCSS, MUI, shadcn/ui
- **State Management & Validation**: Formik, Yup, Zod
- **Testing**: Jest
- **Utilities**: PostCSS, Axios

### Backend (Node.js)

- **Framework**: Express.js (TypeScript)
- **Authentication**: JWT
- **Database**: MongoDB
- **Cloud Storage**: AWS S3, Cloudinary
- **Security**: Cloudflare, express-rate-limit
- **Validation**: Zod
- **Real-time Communication**: Socket.io
- **Email Service**: SendGrid
- **API Gateway**: Custom implementation
- **CI/CD**: GitHub Actions, Jenkins, Docker, AWS ECR

### Authentication & Realtime Services

- **Authentication**: Firebase, Supabase
- **Realtime Event Handling**: Socket.io

## Project Architecture

- **Frontend**: Hosted on Vercel and built with Next.js
- **Backend**: Runs on AWS EC2 with a CI/CD pipeline using Docker & Jenkins
- **Database**: Uses MongoDB with a dedicated storage structure
- **API Gateway**: Secure API gateway with rate limiting using Cloudflare
- **Storage**: AWS S3 for file storage, Amazon CloudFront for CDN distribution
- **Email Service**: SendGrid for email notifications
- **WebSockets**: Socket.io for real-time communication

## Deployment & CI/CD

- The project follows a CI/CD workflow:
  1. **Frontend** is deployed via **Vercel**.
  2. **Backend** is deployed via **AWS EC2** with **Dockerized images** stored in **AWS ECR**.
  3. **Jenkins** triggers webhooks and rebuilds the backend container upon updates.
  4. **GitHub Actions** ensures version control and automated builds.

## Folder Structure

```
BE/
|-- .github/workflows/
|   |-- node.js.yml  # GitHub Actions workflow
|-- dist/             # Compiled output
|-- logs/             # Application logs
|-- mongodb_data/     # MongoDB data storage
|-- node_modules/     # Dependencies
|-- src/
|   |-- @types/       # TypeScript types
|   |-- configs/      # Configuration files
|   |-- constants/    # Constant values
|   |-- controllers/  # Business logic controllers
|   |-- core/         # Core utilities and services
|   |-- dbs/          # Database connection setup
|   |-- logger/       # Logging utilities
|   |-- middlewares/  # Express middleware
|   |-- models/       # Database models
|   |-- routes/       # API routes
|   |-- services/     # Application services
|   |-- utils/        # Helper utilities
|   |-- validations/  # Data validation schemas
|   |-- server.ts     # Main entry point
|   |-- types.d.ts    # TypeScript definitions
|-- .dockerignore
|-- .editorconfig
|-- .env             # Environment variables
|-- .gitignore
|-- .prettierignore
|-- .prettierrc
|-- docker-compose.yml
|-- Dockerfile
|-- eslint.config.mjs
|-- nodemon.json
|-- package.json
|-- pnpm-lock.yaml
|-- README.md
|-- tsconfig.json
|-- tsconfig.prod.json
```
