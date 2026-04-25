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
- MySQL Server (v5.7+) running locally
  - **macOS**: Install via Homebrew: `brew install mysql` and `brew services start mysql`
  - **Linux**: Install via package manager
  - **Windows**: Download from [mysql.com](https://dev.mysql.com/downloads/mysql/)
- npm or yarn

**Note**: Before running the server, ensure MySQL is running!

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
Load the database schema:
```bash
mysql -u root -p inventory_system < schema.sql
```
Or if MySQL allows passwordless root:
```bash
mysql -u root inventory_system < schema.sql
```

### 4. Configure Environment Variables
Update `.env` file with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inventory_system
SESSION_SECRET=your-secret-key-change-this
PORT=3000
NODE_ENV=development
```

**Security Tip**: Change `SESSION_SECRET` to a random string in production!

### 5. Run the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3000`

## Development Progress

### Week 1 ✓
- [x] Project idea finalized (Inventory System)
- [x] Database schema designed (3 tables with relationships)
- [x] Express server basic setup
- [x] Folder structure created
- [x] Environment configuration

### Week 2 ✓
- [x] CRUD endpoints implementation (Products & Categories)
- [x] Database integration working
- [x] Authentication routes (register/login/logout)
- [x] Authorization middleware (ownership-based access)
- [x] All endpoints tested and verified

### Week 3 (To Do)
- [ ] Role-based access control (admin features)
- [ ] Unit testing
- [ ] Documentation completion
- [ ] Screenshots and final polish

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

## API Endpoints (✓ Week 2 Complete)

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
├── routes/              # Route definitions (users, products, categories)
├── controllers/         # Business logic for each resource
├── middleware/          # Custom middleware (authentication checks)
├── db.js               # MySQL connection pool setup
├── server.js           # Express server configuration
├── schema.sql          # Database tables and relationships
├── .env                # Environment variables (not in git)
├── .gitignore          # Files to exclude from git
├── package.json        # Dependencies and scripts
├── TESTING.md          # Postman testing guide
├── README.md           # This file
└── screenshots/        # Screenshots for submission (Week 3)
```

## Testing

See [TESTING.md](TESTING.md) for comprehensive API endpoint testing guide using **Postman**.

### How Sessions Work
When a user logs in successfully:
1. Server creates a session and stores session ID in a cookie
2. Postman automatically saves this cookie
3. On subsequent requests, Postman sends the cookie with the request
4. Server validates the session and allows access to protected routes
5. Logging out destroys the session and clears the cookie

### Test Summary (Week 2)
✅ User Registration & Authentication
✅ User Login & Session Management
✅ User Logout
✅ Create Products (CRUD - Create)
✅ Read Products (CRUD - Read)
✅ Update Products (CRUD - Update)
✅ Delete Products (CRUD - Delete)
✅ Create Categories (CRUD - Create)
✅ Read Categories (CRUD - Read)
✅ Update Categories (CRUD - Update)
✅ Delete Categories (CRUD - Delete)
✅ Protected Routes (401 Unauthorized)
✅ Authorization Checks (403 Forbidden)
✅ 404 Not Found Errors
✅ Database Integration Verified

## Troubleshooting

### MySQL Connection Errors
**Error**: `ER_ACCESS_DENIED_FOR_USER`
- **Solution**: Check your MySQL password in `.env` matches your actual MySQL password
- Try: `mysql -u root -p` to verify credentials

**Error**: `ER_BAD_DB_ERROR` - Database doesn't exist
- **Solution**: Run step 2 and 3 of setup: Create database and load schema

### Server Won't Start
**Error**: `Port 3000 already in use`
- **Solution**: Kill the process on port 3000 or change PORT in `.env`
- Or: `lsof -i :3000` to find process ID, then `kill -9 <PID>`

### Getting 401 Unauthorized
- **Solution**: Make sure you logged in first and Postman has the session cookie
- Check: Click **Cookies** button in Postman to verify session is saved

### Getting 403 Forbidden
- **Problem**: You're trying to access another user's data
- **Solution**: This is expected! Each user can only access their own data
- Create your own categories/products to test

## API Response Examples

### Success Response
```json
{
  "status": "success",
  "data": { /* response data */ },
  "code": 200
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Descriptive error message",
  "code": 400
}
```

## Author
Davide Silverii - App Development 1 Final Project