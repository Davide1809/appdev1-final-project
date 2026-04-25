# API Testing Guide - Postman

This guide shows how to test the Inventory System API endpoints using Postman.

## Prerequisites

1. Make sure the server is running:
```bash
npm start
```
Server should be running on `http://localhost:3000`

2. Download and install [Postman](https://www.postman.com/downloads/)

## Setup in Postman

### 1. Create a New Collection
- Click **+ New** → **Collection**
- Name it: `Inventory System API`

### 2. Create Environment Variables (Optional but Recommended)
- Click **Environments** (gear icon)
- Click **Create New Environment**
- Name it: `Local Dev`
- Add variable:
  - **Key**: `base_url`
  - **Value**: `http://localhost:3000`
- Add variable:
  - **Key**: `api_url`
  - **Value**: `http://localhost:3000/api`
- Save

---

## Testing Endpoints

### 1. User Authentication

#### 1.1 Register a New User
**Method**: POST  
**URL**: `{{api_url}}/users/register`

**Headers**:
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Expected Response** (201):
```json
{
  "status": "success",
  "message": "User registered successfully",
  "userId": 1,
  "code": 201
}
```

---

#### 1.2 Login
**Method**: POST  
**URL**: `{{api_url}}/users/login`

**Headers**:
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Expected Response** (200):
```json
{
  "status": "success",
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "testuser",
    "role": "user"
  },
  "code": 200
}
```

**⚠️ IMPORTANT**: Postman automatically saves session cookies after login. You can see them in:
- **Cookies** tab (at the bottom of the request)
- Or go to **Cookies** → **Manage Cookies** to view all saved cookies

---

#### 1.3 Logout
**Method**: POST  
**URL**: `{{api_url}}/users/logout`

**Headers**:
- `Content-Type`: `application/json`

**Body**: (empty)

**Expected Response** (200):
```json
{
  "status": "success",
  "message": "Logout successful",
  "code": 200
}
```

---

### 2. Categories (CRUD Operations)

#### 2.1 Create a Category
**Method**: POST  
**URL**: `{{api_url}}/categories`

**Headers**:
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
  "name": "Electronics",
  "description": "Electronic items and gadgets"
}
```

**Expected Response** (201):
```json
{
  "status": "success",
  "message": "Category created successfully",
  "categoryId": 1,
  "code": 201
}
```

---

#### 2.2 Get All Categories
**Method**: GET  
**URL**: `{{api_url}}/categories`

**Headers**:
- `Content-Type`: `application/json`

**Body**: (empty)

**Expected Response** (200):
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic items and gadgets",
      "created_at": "2026-04-25T16:11:48.000Z",
      "updated_at": "2026-04-25T16:11:48.000Z"
    }
  ],
  "count": 1,
  "code": 200
}
```

---

#### 2.3 Get Specific Category
**Method**: GET  
**URL**: `{{api_url}}/categories/1`

**Headers**:
- `Content-Type`: `application/json`

**Body**: (empty)

**Expected Response** (200):
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic items and gadgets",
    "created_by": 1,
    "created_at": "2026-04-25T16:11:48.000Z",
    "updated_at": "2026-04-25T16:11:48.000Z"
  },
  "code": 200
}
```

---

#### 2.4 Update Category
**Method**: PUT  
**URL**: `{{api_url}}/categories/1`

**Headers**:
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
  "name": "Electronics & Gadgets",
  "description": "Updated description for electronics"
}
```

**Expected Response** (200):
```json
{
  "status": "success",
  "message": "Category updated successfully",
  "code": 200
}
```

---

#### 2.5 Delete Category
**Method**: DELETE  
**URL**: `{{api_url}}/categories/1`

**Headers**:
- `Content-Type`: `application/json`

**Body**: (empty)

**Expected Response** (200):
```json
{
  "status": "success",
  "message": "Category deleted successfully",
  "code": 200
}
```

---

### 3. Products (CRUD Operations)

#### 3.1 Create a Product
**Method**: POST  
**URL**: `{{api_url}}/products`

**Headers**:
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "category_id": 1,
  "quantity": 5,
  "price": 999.99
}
```

**Expected Response** (201):
```json
{
  "status": "success",
  "message": "Product created successfully",
  "productId": 1,
  "code": 201
}
```

---

#### 3.2 Get All Products
**Method**: GET  
**URL**: `{{api_url}}/products`

**Headers**:
- `Content-Type`: `application/json`

**Body**: (empty)

**Expected Response** (200):
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "category_id": 1,
      "category_name": "Electronics",
      "quantity": 5,
      "price": "999.99",
      "created_at": "2026-04-25T16:11:58.000Z",
      "updated_at": "2026-04-25T16:11:58.000Z"
    }
  ],
  "count": 1,
  "code": 200
}
```

---

#### 3.3 Get Specific Product
**Method**: GET  
**URL**: `{{api_url}}/products/1`

**Headers**:
- `Content-Type`: `application/json`

**Body**: (empty)

**Expected Response** (200):
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "category_id": 1,
    "category_name": "Electronics",
    "quantity": 5,
    "price": "999.99",
    "created_by": 1,
    "created_at": "2026-04-25T16:11:58.000Z",
    "updated_at": "2026-04-25T16:11:58.000Z"
  },
  "code": 200
}
```

---

#### 3.4 Update Product
**Method**: PUT  
**URL**: `{{api_url}}/products/1`

**Headers**:
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
  "quantity": 15,
  "price": 1099.99
}
```

**Expected Response** (200):
```json
{
  "status": "success",
  "message": "Product updated successfully",
  "code": 200
}
```

---

#### 3.5 Delete Product
**Method**: DELETE  
**URL**: `{{api_url}}/products/1`

**Headers**:
- `Content-Type`: `application/json`

**Body**: (empty)

**Expected Response** (200):
```json
{
  "status": "success",
  "message": "Product deleted successfully",
  "code": 200
}
```

---

### 4. Error Testing

#### 4.1 Test 401 - Unauthorized (Protected Route Without Login)
**Method**: GET  
**URL**: `{{api_url}}/products`

**Steps**:
1. Logout first (or open a new Postman tab without session cookies)
2. Remove all cookies from the request:
   - Click **Cookies** (bottom of screen)
   - Clear all cookies for localhost
3. Send the request

**Expected Response** (401):
```json
{
  "status": "error",
  "message": "Unauthorized - Please log in",
  "code": 401
}
```

---

#### 4.2 Test 403 - Forbidden (Accessing Someone Else's Data)

**Steps**:
1. Create User 1 and login (save session)
2. Create a category as User 1 (e.g., Category ID 2)
3. Logout
4. Create User 2 and login (save new session)
5. Try to delete User 1's category as User 2

**Delete User 1's Category**:
- **Method**: DELETE  
- **URL**: `{{api_url}}/categories/2`
- **Expected Response** (403):
```json
{
  "status": "error",
  "message": "Not authorized to delete this category",
  "code": 403
}
```

---

#### 4.3 Test 404 - Not Found
**Method**: GET  
**URL**: `{{api_url}}/products/9999`

**Expected Response** (404):
```json
{
  "status": "error",
  "message": "Product not found",
  "code": 404
}
```

---

## Testing Checklist

- [ ] User Registration (POST /api/users/register)
- [ ] User Login (POST /api/users/login)
- [ ] Create Category (POST /api/categories)
- [ ] Read All Categories (GET /api/categories)
- [ ] Read Single Category (GET /api/categories/:id)
- [ ] Update Category (PUT /api/categories/:id)
- [ ] Delete Category (DELETE /api/categories/:id)
- [ ] Create Product (POST /api/products)
- [ ] Read All Products (GET /api/products)
- [ ] Read Single Product (GET /api/products/:id)
- [ ] Update Product (PUT /api/products/:id)
- [ ] Delete Product (DELETE /api/products/:id)
- [ ] Test 401 Unauthorized
- [ ] Test 403 Forbidden
- [ ] Test 404 Not Found
- [ ] User Logout (POST /api/users/logout)

---

For more details, see README.md
