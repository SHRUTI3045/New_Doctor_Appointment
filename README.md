# Doctor Appointment Application

## Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+
- MySQL 8

## Setup

### 1. MySQL
Create a database (auto-created on first run via `createDatabaseIfNotExist=true`):
```sql
CREATE DATABASE doctor_appointment_db;
```
Update `backend/src/main/resources/application.properties` with your MySQL credentials.

### 2. Backend
```bash
cd backend
mvn spring-boot:run
```
Runs on http://localhost:8080

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173

## Default Users
Create users via POST /api/auth/register or directly in the DB.

Example admin seed (run in MySQL after first startup):
```sql
INSERT INTO users (user_name, password, role) VALUES
  ('admin', '$2a$10$HASH_YOUR_PASSWORD', 'ADMIN');
```
Or register via the /register endpoint and manually update the role in the DB to ADMIN/DOCTOR.

## API Base URL
All endpoints are prefixed with `/api`. The Vite dev server proxies `/api` → `http://localhost:8080`.
