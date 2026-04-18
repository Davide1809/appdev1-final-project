# Inventory System API

## Project Description

A backend API for managing inventory across categories and products. Users can create accounts, log in, and manage inventory items including creating, reading, updating, and deleting products and categories. The system includes authentication and authorization to ensure users can only access their own data.

## Features

- **User Authentication**: Session-based login and logout
- **Role-Based Access**: Users and admin roles
- **Ownership-Based Access**: Users can only manage their own data
- **Product Management**: Full CRUD operations for inventory items
- **Category Management**: Organize products by categories
- **Error Handling**: Consistent JSON error responses with proper status codes

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Authentication**: Sessions with bcryptjs for password hashing
- **Other**: CORS, dotenv for environment management

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MySQL Server running locally
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Create MySQL Database
Connect to MySQL and create the database:
```bash
mysql -u root -p
CREATE DATABASE inventory_system;
```

### 3. Create Tables
Load the schema:
```bash
mysql -u root -p inventory_system < schema.sql
```

### 4. Configure Environment Variables
Update `.env` file with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inventory_system
SESSION_SECRET=your-secret-key
PORT=3000
```

### 5. Run the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3000`

## Database Schema

### Users Table
- `id` (INT, Primary Key)
- `username` (VARCHAR, Unique)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `role` (ENUM: 'user', 'admin')
- `created_at`, `updated_at` (Timestamps)

### Categories Table
- `id` (INT, Primary Key)
- `name` (VARCHAR)
- `description` (TEXT)
- `created_by` (INT, Foreign Key → users.id)
- `created_at`, `updated_at` (Timestamps)

### Products Table
- `id` (INT, Primary Key)
- `name` (VARCHAR)
- `description` (TEXT)
- `category_id` (INT, Foreign Key → categories.id)
- `quantity` (INT)
- `price` (DECIMAL)
- `created_by` (INT, Foreign Key → users.id)
- `created_at`, `updated_at` (Timestamps)

## API Endpoints (Planned for Week 2)

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user

### Products (Protected Routes)
- `GET /api/products` - Get all products for authenticated user
- `GET /api/products/:id` - Get specific product (ownership check)
- `POST /api/products` - Create new product (requires login)
- `PUT /api/products/:id` - Update product (ownership check)
- `DELETE /api/products/:id` - Delete product (ownership check)

### Categories (Protected Routes)
- `GET /api/categories` - Get all categories for authenticated user
- `GET /api/categories/:id` - Get specific category
- `POST /api/categories` - Create new category (requires login)
- `PUT /api/categories/:id` - Update category (ownership check)
- `DELETE /api/categories/:id` - Delete category (ownership check)

## Error Handling

All errors return JSON responses with the following format:
```json
{
  "status": "error",
  "message": "Description of the error",
  "code": 400
}
```

### Status Codes
- `200` - Success
- `400` - Bad request
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (not authorized to access)
- `404` - Not found
- `500` - Internal server error

## Project Structure
```
final-project/
├── routes/              # Route definitions
├── controllers/         # Business logic
├── middleware/          # Custom middleware (auth, validation)
├── db.js               # Database connection pool
├── server.js           # Express server setup
├── schema.sql          # Database schema
├── .env                # Environment variables
├── package.json        # Dependencies
├── README.md           # This file
└── screenshots/        # Screenshots of functionality
```

## Author
Davide Silverii - App Development 1 Final Project