# Lead Management System

## Project Overview
The Lead Management System is a web application designed to manage and track leads for a B2B platform. It provides functionality for creating, updating, and tracking leads with performance ratings and order statistics. The system also includes user authentication and role management, enabling secure access to its features.

## System Requirements
- **Operating System**: Windows, macOS, or Linux
- **Node.js**: v16.0.0 or later
- **MongoDB**: v4.4 or later (local or cloud instance)
- **npm**: v7.0.0 or later
- **Dependencies**: See `package.json` for required libraries

## Installation Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Abhranil1033/KAM.git
   cd lead-management-system
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     PORT=8000
     DB_URL=<Your MongoDB Connection URI>
     ACCESS_TOKEN_SECRET=<Your Access Token Secret>
     ACCESS_TOKEN_EXPIRY=1h
     REFRESH_TOKEN_SECRET=<Your Refresh Token Secret>
     REFRESH_TOKEN_EXPIRY=7d
     ```

4. **Set Up MongoDB:**
   - Ensure MongoDB is running locally or provide a cloud-based MongoDB URI.

## Running Instructions

1. **Start the Server:**
   ```bash
   npm run dev
   ```

2. **Access the Application:**
   - The server will start at `http://localhost:8000`.

<!-- ## Test Execution Guide

1. **Install Testing Dependencies:**
   - If you have unit or integration tests, ensure dependencies like `jest` or `mocha` are installed:
     ```bash
     npm install --save-dev jest supertest
     ```

2. **Run Tests:**
   ```bash
   npm test -->
   <!-- ``` -->

## API Documentation

### Base URL
`http://localhost:8000`

### Endpoints

#### User Authentication
1. **Register User**
   - **POST** `/api/v1/user/register`
   - **Request Body:**
     ```json
     {
       "fullname": "John Doe",
       "email": "johndoe@example.com",
       "username": "johndoe",
       "password": "password123"
     }
     ```

2. **Login User**
   - **POST** `/api/v1/user/login`
   - **Request Body:**
     ```json
     {
       "username": "johndoe",
       "password": "password123"
     }
     ```
2. **Logout User**
   - **POST** `/api/v1/user/logout`

#### Lead Management
1. **Create Lead**
   - **POST** `/api/v1/create-lead`
   - **Request Body:**
     ```json
     {
       "restaurantName": "ABC Restaurant",
       "address": "123 Main Street",
       "status": "new",
       "assignedKAM": "<any User ID from DB>"
     }
     ```

2. **Update Lead**
   - **PUT** `/api/v1/update-details/:id`
   - **Request Body:**
     ```json
     {
       "status": "in-progress",
       "totalOrders": 10,
       "lastOrderDate": "2024-12-30"
     }
     ```

3. **Get current Lead details**
   - **GET** `/api/v1/details/:id`

4. **Get All Leads**
   - **GET** `/api/v1/restaurants/all`

5. **Get Leads by Performance**
   - **GET** `/api/v1/restaurants/performance`



#### POC 
1. **Add POC for a lead(restaurant)**
   - **POST** `/api/v1/restaurants/:id/add-poc`
   - **Request Body:**
     ```json
     {
       "restaurant" : "676be13807ea53c15fd055af",
       "name": "Jane Doe",
       "role": "Manager",
       "contactInfo": "jane.doe@example.com"
     }
     ```

2. **Get POCs for a lead(restaurant)**
   - **GET** `/api/v1/restaurants/:id/pocs`



#### Call Tracker
1. **Get Call Details**
   - **GET** `/api/v1/restaurants/:id/calls`

2. **Add Call Details**
   - **POST** `/api/v1/restaurants/:id/add-call-details`
   - **Request Body:**
     ```json
     {
        "callTo": "<poc id from db>",
        "callSummary": "Discussed new order discounts",
        "rating": 1,
        "callDate": "2025-01-02"
     }
     ```

3. **Get leads to be called today**
   - **GET** `/api/v1/today-calls`



## Sample Usage Examples

Try out these routes in postman to verify the results.