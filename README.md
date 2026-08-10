# 🚗 Odoo Rides — Enterprise Carpooling Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Bun](https://img.shields.io/badge/Bun-Runtime-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)

**Odoo Rides** is a full-stack Enterprise Carpooling and Shared Mobility Platform designed to optimize daily commutes for organization employees. By facilitating intelligent route matching, real-time trip tracking, digital wallet transactions, and comprehensive sustainability analytics, Odoo Rides reduces transportation costs and environmental impact across corporate fleets.

---

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🖼️ Application Screenshots](#️-application-screenshots)
  - [1. Authentication & Onboarding](#1-authentication--onboarding)
  - [2. Ride Discovery & Route Matching](#2-ride-discovery--route-matching)
  - [3. Ride Publishing & Vehicle Management](#3-ride-publishing--vehicle-management)
  - [4. Live Trip Tracking & Management](#4-live-trip-tracking--management)
  - [5. Wallet & Payments](#5-wallet--payments)
  - [6. Reports & Analytics Dashboard](#6-reports--analytics-dashboard)
- [🏗 System Architecture](#-system-architecture)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [🔑 Environment Variables](#-environment-variables)
- [🔌 API Endpoints Summary](#-api-endpoints-summary)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Key Features

- **🔍 Intelligent Ride Discovery:** Search rides by pickup, destination, date, time, and available seat preferences with interactive map-based route confirmation.
- **🚘 Ride Publishing & Vehicle Management:** Register vehicles (capacity, plate number, model) and publish open seats with customized fare rules.
- **🗺 Live GPS Trip Tracking:** Real-time interactive trip monitoring via OpenStreetMap / Leaflet, showing ETA, route progress, and status markers.
- **💳 Digital Wallet & Multi-channel Payments:** Integrated internal wallet system supporting recharges and trip payments via Cash, Card, UPI, and Razorpay sandbox.
- **💬 In-App Communication:** Real-time chat & contact options between drivers and passengers for seamless trip coordination.
- **📊 Analytics & Carbon Accounting:** Executive dashboards tracking fuel efficiency trends, total distance covered, cost per km, and corporate carbon footprint reduction.
- **🛡 Enterprise Role-Based Access:** Dual view capabilities for employees (driver/rider) and company administrative management.

---

## 🖼️ Application Screenshots

> 💡 **Developer Note:** Place your PNG/JPG screenshots inside the `docs/screenshots/` folder matching the filenames referenced below.

### 1. Authentication & Onboarding
| Employee Login | User Registration |
| :---: | :---: |
| ![Login Screen](docs/screenshots/login.png) | ![Sign Up Screen](docs/screenshots/signup.png) |
| *Secure organizational login with JWT authentication.* | *Employee registration and profile setup.* |

---

### 2. Ride Discovery & Route Matching
| Search Rides | Available Rides Listing | Route Confirmation |
| :---: | :---: | :---: |
| ![Find Ride](docs/screenshots/find-ride.png) | ![Available Rides](docs/screenshots/available-rides.png) | ![Route Preview](docs/screenshots/route-confirmation.jpeg) |
| *Search rides by location & schedule.* | *Compare ratings, prices, and driver profiles.* | *Interactive map preview of calculated route.* |

---

### 3. Ride Publishing & Vehicle Management
| Offer a Ride | Vehicle Registry |
| :---: | :---: |
| ![Publish Ride](docs/screenshots/offer-ride.png) | ![Vehicle Management](docs/screenshots/vehicles.png) |
| *Publish available seats and set fare parameters.* | *Add and manage vehicle specifications.* |

---

### 4. Live Trip Tracking & Management
| Live Map Tracking | Trip Management & Communication |
| :---: | :---: |
| ![Live Tracking](docs/screenshots/live-tracking.png) | ![My Trips Detail](docs/screenshots/trip-details.png) |
| *Real-time position updates, ETA, and progress bar.* | *Active trip controls, passenger info, and in-app chat.* |

---

### 5. Wallet & Payments
| Digital Wallet | Payment Options |
| :---: | :---: |
| ![Wallet Dashboard](docs/screenshots/wallet.png) | ![Payment Gateway](docs/screenshots/payment.png) |
| *Wallet balance, top-up modal, and ledger history.* | *Multi-modal payment checkout (UPI, Wallet, Card).* |

---

### 6. Reports & Analytics Dashboard
| Corporate Analytics & ESG Reports |
| :---: |
| ![Analytics Dashboard](docs/screenshots/analytics.png) |
| *Fuel savings, trip metrics, cost-per-kilometer breakdown, and environmental impact.* |

---

## 🏗 System Architecture

```mermaid
graph TD
    subgraph Client Layer
        A[React 19 Frontend + Vite] --> B[React Router & TanStack Query]
        B --> C[Leaflet / OpenStreetMap UI]
    end

    subgraph API Layer
        D[Express.js Node/Bun Server] --> E[Auth & Middleware Security]
        E --> F[Zod Validation Layer]
    end

    subgraph Business Logic & Controllers
        F --> G[Ride Controller]
        F --> H[Vehicle Controller]
        F --> I[Wallet & Payment Controller]
        F --> J[Admin Analytics Controller]
    end

    subgraph Database & External Services
        G & H & I & J --> K[(PostgreSQL Database)]
        I --> L[Razorpay Payment API]
        D --> M[Nodemailer / SMTP Email Service]
    end
```

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Base UI, Lucide Icons, Animate.css
- **State & Data Fetching:** TanStack Query (React Query v5), Axios
- **Maps & Geolocation:** Leaflet, React-Leaflet
- **Form Handling:** React Hook Form + Zod
- **Data Visualization:** Recharts

### Backend
- **Runtime:** Bun / Node.js
- **Framework:** Express.js (v5)
- **ORM:** Prisma ORM (v7)
- **Database:** PostgreSQL (with `@prisma/adapter-pg`)
- **Authentication:** JSON Web Tokens (JWT)
- **Payments:** Razorpay Node SDK
- **Logging & Security:** Pino, Helmet, Cors, Compression

---

## 📁 Project Structure

```text
odoo-rides/
├── docs/
│   └── screenshots/          # Application screenshot assets
│       ├── README.md         # Instructions for adding screenshots
│       ├── login.png
│       ├── find-ride.png
│       ├── live-tracking.png
│       └── ...
├── backend/
│   ├── config/               # Database & App configurations
│   ├── controllers/          # Business logic handlers
│   ├── lib/                  # Shared backend utilities & emailers
│   ├── middlewares/          # JWT auth & error handling middlewares
│   ├── prisma/               # Database schema & migrations
│   │   └── schema.prisma
│   ├── routes/               # Express API endpoints
│   ├── app.ts                # App initializer
│   ├── server.ts             # Server entrypoint
│   └── package.json
├── frontend/
│   ├── public/               # Static assets & icons
│   ├── src/
│   │   ├── app/              # Router & Providers
│   │   ├── components/       # UI Components & Layouts
│   │   ├── modules/          # Feature modules (Rides, Wallet, Analytics)
│   │   └── lib/              # API clients & helper functions
│   ├── design-doc.md         # Full feature specifications document
│   ├── vite.config.ts        # Vite configuration
│   └── package.json
└── README.md                 # Project README
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18+ recommended) or [Bun](https://bun.sh/)
- [PostgreSQL](https://www.postgresql.org/) (v14+)
- [Git](https://git-scm.com/)

---

### 1. Clone Repository

```bash
git clone https://github.com/Soumyodeep-Das/odoo-rides.git
cd odoo-rides
```

---

### 2. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in your PostgreSQL connection string and secrets:
   ```bash
   cp .env.example .env
   ```

4. **Initialize Database & Seed Data:**
   ```bash
   bun run db:setup
   # or
   npm run db:setup
   ```

5. **Start the Backend Server:**
   ```bash
   bun run server.ts
   # or
   npx tsx server.ts
   ```
   *Backend server will run on `http://localhost:3000` (or configured `PORT`).*

---

### 3. Frontend Setup

1. **Open a new terminal and navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Start Development Server:**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

4. Open your browser and navigate to: `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/odoo_rides` |
| `JWT_SECRET` | Secret key for JWT signing | `super-secret-jwt-key` |
| `PORT` | Backend server port | `3000` |
| `FRONTEND_URL` | Frontend origin URL | `http://localhost:5173` |

---

## 🔌 API Endpoints Summary

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Register new employee account |
| **Auth** | `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| **Rides** | `GET` | `/api/rides/search` | Search rides matching criteria |
| **Rides** | `POST` | `/api/rides/offer` | Publish a new ride |
| **Rides** | `POST` | `/api/rides/book` | Book seats on an available ride |
| **Vehicles** | `GET` | `/api/vehicles` | List user registered vehicles |
| **Vehicles** | `POST` | `/api/vehicles` | Register a new vehicle |
| **Wallet** | `GET` | `/api/wallet` | Fetch wallet balance & transaction history |
| **Wallet** | `POST` | `/api/wallet/recharge` | Add funds to digital wallet |
| **Payments** | `POST` | `/api/payments/verify` | Process & verify ride payment |
| **Admin** | `GET` | `/api/admin/analytics` | Get corporate analytics & ESG metrics |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the project repository.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Developed with ❤️ for <b>Odoo x Adamas University Hackathon</b>
</p>
