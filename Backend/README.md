# Backend API - MVC Architecture

A robust Node.js backend API built with Express.js following the Model-View-Controller (MVC) architectural pattern.

## 🚀 Features

- **MVC Architecture**: Clean separation of concerns with Models, Views, Controllers
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling with custom error responses
- **Security**: Helmet, CORS, and other security best practices
- **Database**: MongoDB with Mongoose ODM
- **Logging**: Request logging with Morgan
- **Environment Configuration**: Dotenv for environment variables

## 📁 Project Structure

```
Backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── userController.js    # User management logic
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── errorHandler.js     # Global error handling
│   └── validation.js       # Input validation rules
├── models/
│   └── User.js             # User data model
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   └── userRoutes.js       # User management routes
├── utils/
│   └── jwt.js              # JWT utility functions
├── views/
│   └── responseFormatter.js # API response formatting
├── .env.example            # Environment variables template
├── server.js               # Application entry point
└── package.json            # Dependencies and scripts
```

## 🛠️ Installation

1. **Clone and navigate to the Backend directory**

   ```bash
   cd Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bytebound_db
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB** (make sure MongoDB is running on your system)

5. **Run the application**

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Password

```http
PUT /api/auth/updatepassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword123"
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### User Management Endpoints (Admin Only)

#### Get All Users

```http
GET /api/users?page=1&limit=10&search=john&role=user&isActive=true
Authorization: Bearer <admin_token>
```

#### Get Single User

```http
GET /api/users/:id
Authorization: Bearer <admin_token>
```

#### Update User

```http
PUT /api/users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "admin",
  "isActive": true
}
```

#### Delete User

```http
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

#### Update Own Profile

```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

### Health Check

```http
GET /api/health
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🛡️ Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Password Hashing**: Bcrypt with salt rounds
- **JWT**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Can be easily added with express-rate-limit

## 📝 Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "status": "success",
  "message": "Operation successful",
  "data": {
    "user": { ... }
  },
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required",
      "value": ""
    }
  ],
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

## 🧪 Testing

To test the API endpoints, you can use:

- **Postman**: Import the endpoints and test manually
- **curl**: Command-line testing
- **Frontend Integration**: Connect with your frontend application

Example curl command:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Password123"}'
```

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2
3. Set up a reverse proxy with Nginx
4. Use a cloud database service for MongoDB
5. Configure proper environment variables

## 🤝 Contributing

1. Follow the MVC pattern
2. Add proper validation for new endpoints
3. Include error handling
4. Update documentation for new features
5. Test thoroughly before committing

## 📄 License

This project is licensed under the ISC License.
