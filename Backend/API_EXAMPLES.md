# API Testing Examples

Here are some curl commands to test the API endpoints:

## 1. Health Check
```bash
curl http://localhost:5000/api/health
```

## 2. Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

## 3. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

## 4. Get Current User (requires token from login)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 5. Update User Profile (requires token)
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "John Updated",
    "email": "john.updated@example.com"
  }'
```

## 6. Change Password (requires token)
```bash
curl -X PUT http://localhost:5000/api/auth/updatepassword \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "currentPassword": "Password123",
    "newPassword": "NewPassword123"
  }'
```

## 7. Logout (requires token)
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Admin Endpoints (requires admin role)

### Get All Users
```bash
curl -X GET "http://localhost:5000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

### Get Single User
```bash
curl -X GET http://localhost:5000/api/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

### Update User (Admin)
```bash
curl -X PUT http://localhost:5000/api/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "admin",
    "isActive": true
  }'
```

### Delete User (Admin)
```bash
curl -X DELETE http://localhost:5000/api/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

## Testing Workflow

1. **Start the server**: `npm run dev`
2. **Register a user** using the register endpoint
3. **Login** to get a JWT token
4. **Use the token** in subsequent requests by replacing `YOUR_JWT_TOKEN_HERE`
5. **Test various endpoints** with the token

## Creating an Admin User

To create an admin user, you can:

1. Register a normal user first
2. Manually update the user's role in the database to 'admin'
3. Or modify the register endpoint temporarily to allow admin registration

## Notes

- Replace `YOUR_JWT_TOKEN_HERE` with the actual token received from login
- Replace `USER_ID_HERE` with actual MongoDB ObjectId
- The server must be running on port 5000
- MongoDB must be running and accessible
